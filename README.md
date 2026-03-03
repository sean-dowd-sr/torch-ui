# @torchui/solid

A SolidJS component library built on [Kobalte](https://kobalte.dev) primitives and [Tailwind CSS](https://tailwindcss.com).

## Installation

```bash
# npm
npm install @torchui/solid

# pnpm
pnpm add @torchui/solid

# yarn
yarn add @torchui/solid

# bun
bun add @torchui/solid
```

## Setup

After installing, add a `@source` directive to your main CSS file so Tailwind scans TorchUI's classes:

```css
@import "tailwindcss";
@import "@torchui/solid/styles/theme.css";

@source "../node_modules/@torchui/solid/src/**/*.{ts,tsx}";
```

For class-based dark mode (e.g. `<body class="dark">`), add the custom variant before `@source`:

```css
@import "tailwindcss";
@import "@torchui/solid/styles/theme.css";

@custom-variant dark (&:where(.dark, .dark *));
```

## Usage

```tsx
import { Button } from '@torchui/solid/actions';
import { Input } from '@torchui/solid/forms';
import { Card } from '@torchui/solid/layout';

function App() {
  return (
    <Card>
      <Input label="Name" placeholder="Enter your name" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

## Components

### Actions
- Button, ButtonGroup, Link, Copy, DarkModeToggle

### Forms
- Input, TextArea, Select, Checkbox, Switch, RadioGroup
- NumberField, Slider, DatePicker, DateRangePicker, ColorPicker, FileUpload
- Autocomplete, MultiSelect, CodeInput

### Layout
- Card, Grid, Container, Section, Divider
- Accordion, Collapsible, Form, FormActions

### Overlays
- Dialog, Drawer, Popover, Tooltip, AlertDialog, ContextMenu, HoverCard

### Navigation
- Tabs, Breadcrumbs, DropdownMenu, Pagination, ViewSwitcher
- NavigationMenu, MegaMenu, Sidebar

### Data Display
- Table, DataTable, Image, Avatar, AvatarGroup, Badge, Tag
- Persona, StatCard, EmptyState, Carousel, ColorSwatch
- Timeline, TreeView, Video

### Feedback
- Loading, Progress, Skeleton, Toast, PasswordStrengthIndicator

### Typography
- Code, Icon

### Charts
- Chart, Sparkline

## Theming

TorchUI uses a semantic color system built on three concepts:

- **Surface** - the canvas (backgrounds, containers)
- **Ink** - the content (text, borders, icons)
- **Primary** - the accent (brand colors, active states)

### CSS Variables

TorchUI generates full color palettes from base colors. Override just the `500` variants to customize an entire scale:

```css
:root {
  --surface-base: #f5f5f5;
  --surface-raised: #ffffff;
  --ink-500: #374151;
  --primary-500: #6366f1;
}
```

The lighter (`50-400`) and darker (`600-950`) variants are generated automatically using `color-mix()`. You can still override any individual token if needed.

### Dark Mode

Dark mode is class-based. Add `.dark` to your root element:

```js
document.documentElement.classList.toggle('dark')
```

Or use the built-in `<DarkModeToggle />` component.

### Available Tokens

| Group | Tokens | Usage |
|---|---|---|
| `surface-*` | `base`, `raised`, `dim`, `overlay`, `border` | Backgrounds, containers |
| `ink-*` | `50` – `950` | Text, icons, borders |
| `primary-*` | `50` – `950` | Brand, accents, focus rings |
| `danger-*` | `50` – `950` | Errors, destructive actions |
| `success-*` | `50` – `950` | Confirmations, positive states |
| `warning-*` | `50` – `950` | Cautions |

## Documentation

For full documentation and examples, visit: https://torch-ui.dev

## Requirements

### Peer Dependencies

| Package | Version |
|---|---|
| [solid-js](https://www.solidjs.com) | ^1.9.0 |
| [tailwindcss](https://tailwindcss.com) | ^4.0.0 |

### Bundled

| Package | Used for |
|---|---|
| [@kobalte/core](https://kobalte.dev) | Accessible primitives (ARIA, keyboard nav) |
| [lucide-solid](https://lucide.dev) | Icons |
| [chart.js](https://www.chartjs.org) | Chart and Sparkline components |
| [@thisbeyond/solid-dnd](https://github.com/thisbeyond/solid-dnd) | Drag-and-drop (MultiSelect, ReorderableList) |
| [prismjs](https://prismjs.com) | Syntax highlighting (CodeBlock) |

## License

MIT © Sean Dowd
