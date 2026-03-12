# Changelog

All notable changes to `@torch-ui/solid` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-03-10

### Added
- `MegaMenuBarLink` exported from `@torch-ui/solid/navigation` barrel

### Fixed
- Component prop corrections across navigation components

## [0.1.0] - 2026-03-09

### Added
- Initial release of `@torch-ui/solid`
- 60+ accessible components across actions, charts, data-display, feedback, forms, layout, navigation, overlays, and typography
- Full SolidJS reactivity with Kobalte accessible primitives (ARIA, keyboard navigation)
- Tailwind CSS v4 theming via `theme.css` CSS custom properties (`surface-*`, `ink-*`, `primary-*`, `danger-*`, `success-*`, `warning-*`, `info-*`)
- Bring-your-own-icons model via `IconsProvider` — built-in Lucide-derived SVG defaults with per-icon overrides
- Custom drag-and-drop for `ReorderableList` and `MultiSelect` (no external DnD library)
- Subpath exports: `@torch-ui/solid/actions`, `/forms`, `/layout`, `/overlays`, `/navigation`, `/data-display`, `/feedback`, `/typography`, `/charts`
- `CodeBlock` with Prism syntax highlighting, language switcher, line numbers, collapsible, and forced dark mode
- `ColorPicker` with HSB area, hue slider, hex/RGB/HSL/HSB channel fields, presets, last-used colors, `error` and `helperText` support
- `DatePicker`, `Autocomplete`, `MultiSelect`, `FileUpload`, `Select`, `Slider`, `NumberField`, `CodeInput`
- `DataTable` / `TablePanel` with sorting, filtering, pagination, and column visibility
- `Sidebar`, `Drawer`, `Dialog`, `AlertDialog`, `Popover`, `Tooltip`, `HoverCard`, `ContextMenu`, `DropdownMenu`, `SearchPalette`
- `Chart` and `Sparkline` (Chart.js peer dep, optional)
- `DarkModeToggle` — reads `localStorage` and `prefers-color-scheme`, reacts to OS theme changes, persists user preference
- Component height scale tokens (`--torch-h-xs` through `--torch-h-xl`) for resizing all interactive controls globally
- 423 unit tests across 69 test files

