---
name: torch-ui
description: Build SolidJS interfaces with Torch UI (@torch-ui/solid). Prefer the Torch UI MCP tools for component discovery and API docs when available; otherwise use skill/reference markdown. Covers Kobalte primitives, category imports, compound components, theming, and accessibility. Use when creating or editing SolidJS UI that uses Torch UI, @torch-ui/solid, or Kobalte-based components.
---

# Torch UI — SolidJS Component Library

Torch UI (`@torch-ui/solid`) is a production-grade SolidJS component library built on **Kobalte** primitives and **Tailwind CSS v4**. 90+ components across 9 categories.

## MCP-first workflow (recommended)

When the **Torch UI MCP** server is enabled, use its tools **before** guessing props or import paths. The server reads `manifest.jsonl` and `skill/reference/<category>/<Component>.md` from this skill package.

| Tool | Use it when |
|------|-------------|
| **`resolve_component`** | You have a symbol name (`Button`, `DataTable`, `useToast`, `AlertDialogProps`) and need the matching `doc_id` and metadata. |
| **`search_components`** | You have a fuzzy need (“table with sorting”, “destructive confirm”, “toast”) and want ranked matches. |
| **`list_components`** | You need an inventory of components, optionally filtered by `category`. |
| **`read_component`** | You have a `doc_id` (e.g. `forms/Input`, `data-display/DataTable`) and need the full API markdown (props, exports, types). |
| **`read_conventions`** | You need this entire conventions guide (imports, `cn()`, compound components, providers) without opening files. |

**`doc_id` format:** `{category}/{Component}` with category one of: `actions`, `charts`, `data-display`, `feedback`, `forms`, `layout`, `navigation`, `overlays`, `typography`. Examples: `layout/Card`, `feedback/Toast`, `overlays/Dialog`.

**Suggested sequence for implementation work:**

1. **`resolve_component`** or **`search_components`** → get `doc_id` and `import_path`.
2. **`read_component`** → copy accurate props, variants, and type exports into code.
3. If still unsure about cross-cutting rules (tree-shaking imports, `cn`, providers), call **`read_conventions`** or read the sections below.

### Without MCP (offline / tools unavailable)

From a checkout of the **torch-ui** repo, read:

- `skill/SKILL.md` — this file (conventions + patterns).
- `skill/reference/INDEX.md` — component index.
- `skill/reference/<category>/<Component>.md` — per-component API.

Regenerate reference docs after library changes: `bun run skill/scripts/extract-api.ts` (from the torch-ui repo).

## Quick reference

Per-component API docs live under `skill/reference/`. Full index: `skill/reference/INDEX.md`.

## Installation & setup

```bash
npm install @torch-ui/solid @kobalte/core solid-js tailwindcss
```

Import the theme CSS in your app entry:

```ts
import "@torch-ui/solid/styles/theme.css";
```

Wrap your app with providers:

```tsx
import { IconsProvider, ToastProvider, AppI18nProvider } from "@torch-ui/solid";

<AppI18nProvider locale="en">
  <IconsProvider icons={customIcons}>
    <ToastProvider position="bottom-right">
      <App />
    </ToastProvider>
  </IconsProvider>
</AppI18nProvider>
```

## Import paths

Prefer category sub-path imports for tree-shaking:

| Category | Import path | Components |
|----------|------------|------------|
| Actions | `@torch-ui/solid/actions` | Button, ButtonGroup, Copy, Link, DarkModeToggle |
| Charts | `@torch-ui/solid/charts` | Chart, Sparkline |
| Data Display | `@torch-ui/solid/data-display` | DataTable, Table, Avatar, Badge, Tag, EmptyState, Board, Carousel, Kbd, StatCard, Timeline, TreeView, Video, Image, Persona, AvatarGroup, ColorSwatch |
| Feedback | `@torch-ui/solid/feedback` | Alert, AlertDialog, Banner, Toast/useToast, Loading, Progress, Skeleton, SkeletonBlocks, PasswordStrengthIndicator |
| Forms | `@torch-ui/solid/forms` | Input, TextArea, Select, Autocomplete, MultiSelect, Checkbox, Switch, RadioGroup, NumberField, Slider, DatePicker, DateRangePicker, TimePicker, ColorPicker, FileUpload, CodeInput, FilterBuilder, FieldPicker, ReorderableList |
| Layout | `@torch-ui/solid/layout` | Card, Section, PageHeading, Container, Grid, Inline, Divider, Form, FormActions, Accordion, Collapsible, CodeBlock, BlockQuote, TablePanel, Wizard/WizardStepper, PromptWithAction |
| Navigation | `@torch-ui/solid/navigation` | Tabs, Sidebar, Breadcrumbs, Pagination, DropdownMenu, MenuBar, MegaMenu, ViewSwitcher, ViewCustomizer |
| Overlays | `@torch-ui/solid/overlays` | Dialog, Drawer, Tooltip, Popover, HoverCard, ContextMenu, SearchPalette |
| Typography | `@torch-ui/solid/typography` | Code, Icon |

Root import (`@torch-ui/solid`) re-exports everything plus utilities: `cn`, `mergeRefs`, `createSortableDrag`, `ComponentSizeProvider`, `FormSizeProvider`.

## Conventions

### Props pattern

Every component uses `splitProps` to separate local props from pass-through HTML attributes:

```tsx
const [local, others] = splitProps(props, ["variant", "size", "class", "children"]);
return <div class={cn(baseClass, local.class)} {...others}>{local.children}</div>;
```

### Styling with `cn()`

Use `cn()` (clsx + tailwind-merge) for conditional class composition:

```tsx
import { cn } from "@torch-ui/solid";
cn("px-4 py-2", props.active && "bg-primary-500", props.class)
```

### Compound components

Some components use `Object.assign` to attach sub-components. Access via dot notation:

```tsx
<Card>
  <Card.Header title="Title" action={<Button variant="ghost">Edit</Button>} />
  <Card.Body><p>Content</p></Card.Body>
</Card>

<DropdownMenu>
  <DropdownMenu.Trigger as={Button}>Open</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item onSelect={handleEdit}>Edit</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onSelect={handleDelete}>Delete</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>
```

Compound components: **ButtonGroup**, **Board**, **Card**, **Collapsible**, **DropdownMenu**, **MenuBar**, **MegaMenu**, **ContextMenu**, **HoverCard**, **Popover**, **Tooltip**.

### Icons

Components use `useIcons()` internally for default icons (chevrons, close, spinner, etc.). Override globally via `<IconsProvider>`:

```tsx
import { IconsProvider, type TorchUIIcons } from "@torch-ui/solid";
const myIcons: Partial<TorchUIIcons> = { close: (p) => <MyCloseIcon {...p} /> };
<IconsProvider icons={myIcons}>...</IconsProvider>
```

### ComponentSize

Many components accept `size?: ComponentSize` where `ComponentSize = "xs" | "sm" | "md" | "lg" | "xl"`. Use `<ComponentSizeProvider>` or `<FormSizeProvider>` to set a default for a subtree.

### Theming

Torch UI uses CSS custom properties via Tailwind v4. The theme maps semantic tokens like `--color-primary-500`, `--color-surface-raised`, `--color-ink-700` etc. Import `@torch-ui/solid/styles/theme.css` for defaults.

## Common patterns

### Toast notifications

```tsx
const toast = useToast();
toast.show("Saved!", "Your changes have been saved.", { variant: "success" });
```

### Destructive confirmation

```tsx
<AlertDialog
  open={showDelete()}
  onOpenChange={setShowDelete}
  title="Delete item?"
  description="This action cannot be undone."
  confirmLabel="Delete"
  destructive
  onConfirm={handleDelete}
/>
```

### DataTable

```tsx
<DataTable
  items={rows()}
  columns={[
    { id: "name", header: "Name", cell: (r) => r.name, sortable: true },
    { id: "status", header: "Status", cell: (r) => <Tag variant={r.active ? "success" : "default"}>{r.active ? "Active" : "Inactive"}</Tag> },
  ]}
  emptyMessage="No items found"
  emptyState={{ title: "No items", description: "Create your first item.", icon: <PlusIcon /> }}
  sort={{ column: sortCol(), direction: sortDir(), onSortChange: handleSort }}
  primaryButton={{ label: "Add item", onClick: handleAdd, startIcon: <PlusIcon /> }}
/>
```

### Form with validation feedback

```tsx
<Form onSubmit={handleSubmit}>
  <Section title="Details">
    <Input label="Name" value={name()} onInput={(e) => setName(e.currentTarget.value)} error={errors().name} required />
    <Select label="Type" options={typeOptions} value={type()} onChange={setType} />
  </Section>
  <FormActions>
    <Button type="submit" loading={saving()}>Save</Button>
  </FormActions>
</Form>
```

## Regenerating docs

```bash
bun run skill/scripts/extract-api.ts
```

This reads all component source files and regenerates `skill/reference/` markdown docs.
