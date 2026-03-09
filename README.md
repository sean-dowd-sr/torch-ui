# @torch-ui/solid

A SolidJS component library built on [Kobalte](https://kobalte.dev) primitives and [Tailwind CSS](https://tailwindcss.com).

## Installation

```bash
# npm
npm install @torch-ui/solid

# pnpm
pnpm add @torch-ui/solid

# yarn
yarn add @torch-ui/solid

# bun
bun add @torch-ui/solid

# deno
deno add npm:@torch-ui/solid
```

## Setup

After installing, add a `@source` directive to your main CSS file so Tailwind scans TorchUI's classes:

```css
@import "tailwindcss";
@import "@torch-ui/solid/styles/theme.css";

@source "../node_modules/@torch-ui/solid/dist";
```

For class-based dark mode (e.g. `<body class="dark">`), add the custom variant:

```css
@import "tailwindcss";
@import "@torch-ui/solid/styles/theme.css";

@custom-variant dark (&:where(.dark, .dark *));
@source "../node_modules/@torch-ui/solid/dist";
```

## Usage

```tsx
import { Button } from '@torch-ui/solid/actions';
import { Input } from '@torch-ui/solid/forms';
import { Card } from '@torch-ui/solid/layout';

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
- FieldPicker, ReorderableList, RelativeDateDefaultInput

### Layout
- Card, Grid, Container, Section, Inline, Divider
- Accordion, Collapsible, Form, FormActions
- CodeBlock, TablePanel, WizardStepper, PageHeading, BlockQuote, PromptWithAction

### Overlays
- Dialog, Drawer, Popover, Tooltip, AlertDialog, ContextMenu, HoverCard, SearchPalette

### Navigation
- Tabs, Breadcrumbs, DropdownMenu, Pagination, ViewSwitcher
- NavigationMenu, MegaMenu, Sidebar

### Data Display
- Table, DataTable, Image, Avatar, AvatarGroup, Badge, Tag, Kbd
- Persona, StatCard, EmptyState, Carousel, ColorSwatch
- Timeline, TreeView, Video

### Feedback
- Alert, Banner, AlertDialog, Loading, Progress, Toast
- Skeleton, SkeletonBlocks, PasswordStrengthIndicator

### Typography
- Code, BlockQuote, Icon

### Charts
- Chart, Sparkline

## Theming

TorchUI uses a semantic color system built on three concepts:

- **Surface** - the canvas (backgrounds, containers)
- **Ink** - the pen (text, borders, icons)
- **Primary** - accents (brand colors, active states)

### CSS Variables

Override just these base values in your CSS — TorchUI generates the full `50`–`950` palette for each color automatically via `color-mix()`:

```css
:root {
  /* Ink: dark value used in light mode, light value used in dark mode */
  --ink-light:     #18181c;
  --ink-dark:      #f0f0f2;

  /* Surface: base canvas color per mode */
  --surface-light: #fafafa;
  --surface-dark:  #020b13;

  /* Brand / semantic colors — each generates a full 50–950 scale */
  --primary: #ff7547;
  --success: #0dcd51;
  --warning: #ebd405;
  --danger:  #f12828;
  --info:    #10b3f4;
}
```

You can also override the component height scale to resize all interactive controls (buttons, inputs, selects, etc.) at once:

```css
:root {
  --torch-h-xs: 1.75rem;  /* 28px */
  --torch-h-sm: 2rem;     /* 32px */
  --torch-h-md: 2.25rem;  /* 36px — default */
  --torch-h-lg: 2.5rem;   /* 40px */
  --torch-h-xl: 2.75rem;  /* 44px */
}
```

### Dark Mode

Dark mode is class-based. TorchUI components switch automatically when `.dark` is present on the root element.

The built-in `<DarkModeToggle />` component handles this automatically — it reads `localStorage` and `prefers-color-scheme` on mount, persists user preference, and reacts to OS theme changes while the app is open.

#### Preventing flash of light mode

On first visit, users with a dark OS theme may briefly see light mode before the component mounts. Add this blocking script to your HTML `<head>` to prevent it:

```html
<script>
  (function() {
    var stored = localStorage.getItem('torch-theme')
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark')
    }
  })()
</script>
```

This runs before paint so dark mode users see dark immediately. `<DarkModeToggle />` syncs with the class on mount.

### Available Tokens

| Group | Tokens | Usage |
|---|---|---|
| `surface-*` | `base`, `raised`, `dim`, `overlay`, `border` | Backgrounds, containers |
| `ink-*` | `50` – `950` | Text, icons, borders |
| `primary-*` | `50` – `950` | Brand, accents, focus rings |
| `success-*` | `50` – `950` | Confirmations, positive states |
| `warning-*` | `50` – `950` | Cautions |
| `danger-*` | `50` – `950` | Errors, destructive actions |
| `info-*` | `50` – `950` | Informational states |

## Documentation

For full documentation and examples, visit: https://torch-ui.dev

## Icons

TorchUI includes built-in SVG icons for key UI chrome elements (chevrons, close, calendar, etc.) derived from [Lucide](https://lucide.dev). Components were designed with Lucide's style in mind, but any icon library works.

<IconsProvider> is only needed if you want to swap out TorchUI's default Lucide icons for ones that match your own icon set. For general icon usage in your own code, just import from whatever library you prefer — no configuration needed.

```tsx
import { IconsProvider } from '@torch-ui/solid'

<IconsProvider icons={{ chevronDown: MyChevronDown }}>
  <App />
</IconsProvider>
```

You can override as many or as few icons as you like — unspecified icons fall back to the built-in defaults. For a full list of overridable icon keys see the `TorchUIIcons` interface exported from `@torch-ui/solid`.

## Requirements

### Peer Dependencies

| Package | Version | Notes |
|---|---|---|
| [solid-js](https://www.solidjs.com) | ^1.9.0 | Required |
| [tailwindcss](https://tailwindcss.com) | ^4.0.0 | Required |
| [@kobalte/core](https://kobalte.dev) | >=0.13.11 | Required — accessible primitives (ARIA, keyboard nav) |
| [chart.js](https://www.chartjs.org) | ^4.0.0 | Optional — only needed if using `Chart` or `Sparkline` |
| [prismjs](https://prismjs.com) | ^1.29.0 | Optional — only needed if using `CodeBlock` |

## License

MIT © Sean Dowd
