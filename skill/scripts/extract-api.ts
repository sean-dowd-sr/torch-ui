/**
 * Extract component API docs from Torch UI source and generate per-component
 * markdown reference files.
 *
 * Usage:  bun run skill/scripts/extract-api.ts
 */
import { readdir, stat, mkdir } from "node:fs/promises";
import { join, relative, basename, dirname } from "node:path";

const SRC = join(import.meta.dir, "..", "..", "src", "components");
const OUT = join(import.meta.dir, "..", "reference");

const CATEGORIES: Record<string, string> = {
  actions: "@torch-ui/solid/actions",
  charts: "@torch-ui/solid/charts",
  "data-display": "@torch-ui/solid/data-display",
  feedback: "@torch-ui/solid/feedback",
  forms: "@torch-ui/solid/forms",
  layout: "@torch-ui/solid/layout",
  navigation: "@torch-ui/solid/navigation",
  overlays: "@torch-ui/solid/overlays",
  typography: "@torch-ui/solid/typography",
};

interface ComponentDoc {
  name: string;
  category: string;
  importPath: string;
  filePath: string;
  exports: string[];
  typeExports: string[];
  propsSource: string[];
  isCompound: boolean;
  compoundRoot: string | null;
}

function extractExports(source: string): { functions: string[]; types: string[] } {
  const functions: string[] = [];
  const types: string[] = [];

  for (const m of source.matchAll(/export\s+(?:const|function)\s+(\w+)/g)) {
    functions.push(m[1]);
  }

  for (const m of source.matchAll(/export\s+(?:interface|type)\s+(\w+)/g)) {
    types.push(m[1]);
  }

  return { functions, types };
}

function extractBlock(source: string, startIdx: number, kind: "interface" | "type"): string {
  if (kind === "interface") {
    let braceCount = 0;
    let started = false;
    let endIdx = startIdx;
    for (let i = startIdx; i < source.length; i++) {
      if (source[i] === "{") { braceCount++; started = true; }
      if (source[i] === "}") { braceCount--; }
      if (started && braceCount === 0) { endIdx = i + 1; break; }
    }
    return source.slice(startIdx, endIdx).trim();
  }
  // type alias — scan until we hit a blank line or an `export`/`const`/`function` at col 0
  const eqIdx = source.indexOf("=", startIdx);
  if (eqIdx === -1) return source.slice(startIdx, startIdx + 200).trim();

  let endIdx = eqIdx + 1;
  let depth = 0;
  for (let i = eqIdx + 1; i < source.length; i++) {
    const ch = source[i];
    if (ch === "(" || ch === "{" || ch === "<") depth++;
    if (ch === ")" || ch === "}" || ch === ">") depth--;
    if (ch === "\n") {
      const rest = source.slice(i + 1);
      // end when we hit a blank line, or a new top-level declaration, and depth is 0
      if (depth <= 0 && (/^\s*$/.test(rest.split("\n")[0]) || /^(export |const |function |\/\*\*)/.test(rest))) {
        endIdx = i;
        break;
      }
    }
    endIdx = i + 1;
  }
  return source.slice(startIdx, endIdx).trim().replace(/;?\s*$/, "");
}

function extractDataTypes(source: string): string[] {
  const blocks: string[] = [];
  const seen = new Set<string>();
  // Capture exported interfaces that are NOT props/variant types (e.g. ColumnDef, ToastItem, TreeNode)
  const regex = /export\s+(interface|type)\s+(\w+)/g;
  let match: RegExpExecArray | null;
  const skipPatterns = /Props|Variant|Size|Style|Status|Appearance|Side|Align|Display|Format|Placement|Scope|Color|Connector|Stacking|Shape|Ring|Logic|Component|ClassNames/;
  while ((match = regex.exec(source)) !== null) {
    const name = match[2];
    if (seen.has(name) || skipPatterns.test(name)) continue;
    seen.add(name);
    blocks.push(extractBlock(source, match.index, match[1] as "interface" | "type"));
  }
  return blocks;
}

function extractPropsInterfaces(source: string): string[] {
  const blocks: string[] = [];
  const seen = new Set<string>();
  const regex = /export\s+(interface|type)\s+(\w*Props\w*)\s*/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(source)) !== null) {
    const name = match[2];
    if (seen.has(name)) continue;
    seen.add(name);
    blocks.push(extractBlock(source, match.index, match[1] as "interface" | "type"));
  }

  return blocks;
}

function extractVariantTypes(source: string): string[] {
  const blocks: string[] = [];
  const seen = new Set<string>();
  const regex = /export\s+type\s+(\w*(?:Variant|Size|Style|Status|Appearance|Side|Align|Display|Format|Placement|Scope|Color|Connector|Stacking|Shape|Ring|Logic)\w*)\s*=/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(source)) !== null) {
    if (seen.has(match[1])) continue;
    seen.add(match[1]);
    blocks.push(extractBlock(source, match.index, "type"));
  }
  return blocks;
}

function getCompoundRoot(source: string): string | null {
  const m = source.match(/export\s+const\s+(\w+)[^=]*=\s*Object\.assign/);
  if (m) return m[1];
  const m2 = source.match(/Object\.assign\((\w+),/);
  if (m2) return m2[1];
  return null;
}

async function* walkComponents(dir: string, category: string): AsyncGenerator<ComponentDoc> {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await readdir(full);
      for (const f of nested) {
        if (f.endsWith(".tsx") && !f.endsWith(".test.tsx") && f !== "index.tsx") {
          yield await parseComponent(join(full, f), category);
        }
      }
    } else if (entry.name.endsWith(".tsx") && entry.name !== "index.tsx" && !entry.name.endsWith(".test.tsx")) {
      yield await parseComponent(full, category);
    }
  }
}

async function parseComponent(filePath: string, category: string): Promise<ComponentDoc> {
  const source = await Bun.file(filePath).text();
  const { functions, types } = extractExports(source);
  const propsSource = extractPropsInterfaces(source);
  const variants = extractVariantTypes(source);
  const dataTypes = extractDataTypes(source);

  const componentName = basename(filePath, ".tsx");

  return {
    name: componentName,
    category,
    importPath: CATEGORIES[category] ?? `@torch-ui/solid/${category}`,
    filePath: relative(join(import.meta.dir, "..", ".."), filePath).replaceAll("\\", "/"),
    exports: functions,
    typeExports: types,
    propsSource: [...propsSource, ...variants, ...dataTypes],
    isCompound: getCompoundRoot(source) !== null,
    compoundRoot: getCompoundRoot(source),
  };
}

function generateMarkdown(doc: ComponentDoc): string {
  const lines: string[] = [];
  lines.push(`# ${doc.name}`);
  lines.push("");
  lines.push(`**Category:** ${doc.category}`);
  lines.push(`**Import:** \`${doc.importPath}\``);
  lines.push(`**Source:** \`${doc.filePath}\``);
  if (doc.isCompound && doc.compoundRoot) {
    lines.push(`**Pattern:** Compound component (use \`${doc.compoundRoot}.SubComponent\`)`);
  }
  lines.push("");

  if (doc.exports.length > 0) {
    lines.push("## Exports");
    lines.push("");
    lines.push("```ts");
    const fnExports = doc.exports.map((e) => `  ${e}`).join(",\n");
    const typeImports = doc.typeExports.map((e) => `  type ${e}`).join(",\n");
    const allImports = [fnExports, typeImports].filter(Boolean).join(",\n");
    lines.push(`import {\n${allImports}\n} from "${doc.importPath}";`);
    lines.push("```");
    lines.push("");
  }

  if (doc.propsSource.length > 0) {
    lines.push("## Props");
    lines.push("");
    for (const block of doc.propsSource) {
      const cleaned = block
        .split("\n")
        .filter((l) => !l.startsWith("const ") && !l.startsWith("function ") && !l.startsWith("/**") || l.includes("@"))
        .join("\n")
        .trim();
      if (!cleaned) continue;
      lines.push("```ts");
      lines.push(cleaned);
      lines.push("```");
      lines.push("");
    }
  }

  return lines.join("\n");
}

async function main() {
  let totalComponents = 0;
  const index: Array<{ name: string; category: string; file: string }> = [];
  const allDocs: ComponentDoc[] = [];

  for (const [category] of Object.entries(CATEGORIES)) {
    const catDir = join(SRC, category);
    try {
      await stat(catDir);
    } catch {
      continue;
    }

    const outDir = join(OUT, category);
    await mkdir(outDir, { recursive: true });

    for await (const doc of walkComponents(catDir, category)) {
      const md = generateMarkdown(doc);
      const outFile = join(outDir, `${doc.name}.md`);
      await Bun.write(outFile, md);
      totalComponents++;
      index.push({ name: doc.name, category, file: `${category}/${doc.name}.md` });
      allDocs.push(doc);
    }
  }

  const indexMd = [
    "# Torch UI Component Reference Index",
    "",
    `Generated: ${new Date().toISOString().split("T")[0]}`,
    `Total components: ${totalComponents}`,
    "",
    ...Object.keys(CATEGORIES).map((cat) => {
      const items = index.filter((i) => i.category === cat);
      if (items.length === 0) return "";
      return [
        `## ${cat}`,
        "",
        ...items.map((i) => `- [${i.name}](${i.file})`),
        "",
      ].join("\n");
    }),
  ].join("\n");

  await Bun.write(join(OUT, "INDEX.md"), indexMd);

  // Generate manifest.jsonl for MCP server
  const manifestLines = allDocs.map((doc) =>
    JSON.stringify({
      doc_id: `${doc.category}/${doc.name}`,
      component: doc.name,
      category: doc.category,
      import_path: doc.importPath,
      source_path: doc.filePath,
      reference_path: `reference/${doc.category}/${doc.name}.md`,
      is_compound: doc.isCompound,
      compound_root: doc.compoundRoot,
      exports: doc.exports,
      type_exports: doc.typeExports,
    })
  );
  await Bun.write(join(import.meta.dir, "..", "manifest.jsonl"), manifestLines.join("\n") + "\n");

  console.log(`Generated ${totalComponents} component docs in ${OUT}`);
  console.log(`Manifest written to ${join(import.meta.dir, "..", "manifest.jsonl")}`);
  console.log(`Index written to ${join(OUT, "INDEX.md")}`);
}

main();
