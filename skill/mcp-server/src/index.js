#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const skillRoot = path.resolve(__dirname, '..', '..');
const referenceRoot = path.join(skillRoot, 'reference');
const manifestPath = path.join(skillRoot, 'manifest.jsonl');
const skillMdPath = path.join(skillRoot, 'SKILL.md');

async function loadManifest() {
  const content = await fs.readFile(manifestPath, 'utf8');
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function scoreEntry(entry, queryLower) {
  let score = 0;
  if (entry.component.toLowerCase() === queryLower) score += 10;
  if (entry.component.toLowerCase().includes(queryLower)) score += 5;
  if (entry.doc_id.toLowerCase().includes(queryLower)) score += 4;
  if (entry.category.toLowerCase().includes(queryLower)) score += 2;
  if (entry.import_path.toLowerCase().includes(queryLower)) score += 1;
  for (const exp of entry.exports || []) {
    if (exp.toLowerCase().includes(queryLower)) score += 3;
  }
  for (const texp of entry.type_exports || []) {
    if (texp.toLowerCase().includes(queryLower)) score += 2;
  }
  return score;
}

function formatEntry(entry) {
  return {
    doc_id: entry.doc_id,
    component: entry.component,
    category: entry.category,
    import_path: entry.import_path,
    source_path: entry.source_path,
    is_compound: entry.is_compound,
    compound_root: entry.compound_root,
    exports: entry.exports,
    type_exports: entry.type_exports,
  };
}

const server = new McpServer({
  name: 'torch-ui-mcp',
  version: '1.0.0',
});

server.registerTool(
  'list_components',
  {
    description:
      'List all Torch UI components with metadata (name, category, import path, exports). Filter by category.',
    inputSchema: z
      .object({
        category: z
          .string()
          .optional()
          .describe(
            'Filter by category: actions, charts, data-display, feedback, forms, layout, navigation, overlays, typography'
          ),
        limit: z.number().int().min(1).max(200).default(100).describe('Max results to return.'),
      })
      .shape,
  },
  async ({ category, limit = 100 }) => {
    const manifest = await loadManifest();
    const filtered = category
      ? manifest.filter((e) => e.category === category)
      : manifest;
    const payload = filtered.slice(0, limit).map(formatEntry);
    return {
      content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
    };
  }
);

server.registerTool(
  'read_component',
  {
    description:
      'Read full API reference for a Torch UI component by doc_id (e.g. "actions/Button", "forms/Input", "feedback/Toast").',
    inputSchema: z
      .object({
        doc_id: z
          .string()
          .min(1)
          .describe('Component doc_id from manifest, e.g. "layout/Card", "feedback/AlertDialog"'),
      })
      .shape,
  },
  async ({ doc_id: docId }) => {
    const manifest = await loadManifest();
    const entry = manifest.find((e) => e.doc_id === docId);
    if (!entry) {
      return {
        content: [
          { type: 'text', text: `No component found for doc_id '${docId}'. Use list_components or search_components to find valid IDs.` },
        ],
      };
    }
    const refPath = path.join(referenceRoot, `${entry.category}`, `${entry.component}.md`);
    const body = await fs.readFile(refPath, 'utf8');
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ metadata: formatEntry(entry), body }, null, 2),
        },
      ],
    };
  }
);

server.registerTool(
  'search_components',
  {
    description:
      'Search Torch UI components by name, category, exports, or props type names. Returns ranked results.',
    inputSchema: z
      .object({
        query: z.string().min(1).describe('Search query, e.g. "table", "dialog", "toast", "input props"'),
        category: z.string().optional().describe('Optional category filter.'),
        limit: z.number().int().min(1).max(50).default(10),
      })
      .shape,
  },
  async ({ query, category, limit = 10 }) => {
    const queryLower = query.toLowerCase();
    const manifest = await loadManifest();
    const filtered = category
      ? manifest.filter((e) => e.category === category)
      : manifest;

    const ranked = filtered
      .map((entry) => ({ entry, score: scoreEntry(entry, queryLower) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.component.localeCompare(b.entry.component))
      .slice(0, limit)
      .map((item) => ({ score: item.score, ...formatEntry(item.entry) }));

    return {
      content: [{ type: 'text', text: JSON.stringify(ranked, null, 2) }],
    };
  }
);

server.registerTool(
  'resolve_component',
  {
    description:
      'Resolve a Torch UI component or type name to its documentation. Matches component names, export names, and type names.',
    inputSchema: z
      .object({
        symbol: z
          .string()
          .min(1)
          .describe('Component or type name, e.g. "Button", "DataTableProps", "useToast", "AlertDialog"'),
        limit: z.number().int().min(1).max(20).default(5),
      })
      .shape,
  },
  async ({ symbol, limit = 5 }) => {
    const symbolLower = symbol.toLowerCase();
    const manifest = await loadManifest();

    const ranked = manifest
      .map((entry) => {
        let score = 0;
        if (entry.component.toLowerCase() === symbolLower) score += 10;
        if (entry.component.toLowerCase().includes(symbolLower)) score += 5;
        for (const exp of entry.exports || []) {
          if (exp.toLowerCase() === symbolLower) score += 8;
          if (exp.toLowerCase().includes(symbolLower)) score += 3;
        }
        for (const texp of entry.type_exports || []) {
          if (texp.toLowerCase() === symbolLower) score += 7;
          if (texp.toLowerCase().includes(symbolLower)) score += 3;
        }
        return { entry, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.component.localeCompare(b.entry.component))
      .slice(0, limit)
      .map((item) => ({ score: item.score, ...formatEntry(item.entry) }));

    return {
      content: [{ type: 'text', text: JSON.stringify(ranked, null, 2) }],
    };
  }
);

server.registerTool(
  'read_conventions',
  {
    description:
      'Read the Torch UI conventions and patterns guide (SKILL.md). Covers import paths, compound components, theming, cn(), icons, and common usage patterns.',
    inputSchema: z.object({}).shape,
  },
  async () => {
    const body = await fs.readFile(skillMdPath, 'utf8');
    return {
      content: [{ type: 'text', text: body }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
