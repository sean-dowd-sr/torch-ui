# Changelog

All notable changes to `@torch-ui/solid` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.4] - 2026-03-17

### Added
- `Link`: New `iconStart` and `iconEnd` props (`JSX.Element`) for inline icons. When either is set, the link renders as `inline-flex items-center gap-1`.
- `Tag`: New `iconStart` and `iconEnd` props (`JSX.Element`) for inline icons before/after the label.
- `Input`: New `prefix` and `suffix` props for fixed text/content segments separated by a border divider (e.g. `prefix="https://"`, `suffix=".com"`). Unlike `startAdornment`/`endAdornment`, these render outside the text area entirely so typed text can never overflow into them.

### Fixed
- `Input`: When `suffix` or `prefix` is present, the border and focus ring move to the wrapper container so the compound input renders as a single cohesive unit.

## [0.3.3] - 2026-03-15

### Changed
- `CodeBlock`: Removed built-in `prismjs` dependency. Syntax highlighting is now opt-in via a `highlighter` prop — pass any function `(code: string, language: string) => string | Promise<string>` (e.g. Prism, Shiki, highlight.js). Without a highlighter, code renders as plain text. This eliminates the `prismjs` peer dependency and all related CJS/ESM interop issues across bundlers and runtimes.

### Removed
- `prismjs` removed from `peerDependencies`. Consumers handle their own highlighter.

## [0.3.2] - 2026-03-15

### Fixed
- CSS files now shipped at root-level `styles/` in addition to `dist/styles/` so that `@import '@torch-ui/solid/styles/theme.css'` resolves correctly in `@tailwindcss/vite` and other CSS processors that use physical file paths rather than the `exports` map.

## [0.3.1] - 2026-03-15

### Added
- `--surface-stripe` CSS token — programmatically 1.5% darker than `surface-raised`, used for even striped table rows. Fully dynamic: adapts to any `--surface-light` / `--surface-dark` seed.
- `--color-surface-stripe` registered in `@theme` so `bg-surface-stripe` is available as a Tailwind utility.

### Changed
- **Surface elevation ladder refined** — `--surface-light` default updated to `#fdfdfd`; `--surface-raised` derives via `color-mix` from seed (lighter than base in light mode, lighter than base in dark mode).
- **Disabled form inputs** (`Input`, `CodeInput`, `Select`, `NumberField`, `TextArea`) now use `bg-surface-dim` so disabled fields are visibly muted against the page background.
- **Tag** dark-mode variant backgrounds (`success`, `warning`, `danger`, `info`) now use opacity-based tints (e.g. `success-500/20`) for consistency with the `primary` variant.
- **Table** `thead`/`tfoot` use `bg-surface-overlay`; body rows use `bg-surface-raised`; striped even rows use `bg-surface-stripe`; row hover uses `hover:bg-primary-500/20` (works in both light and dark mode).
- **CodeBlock** container background changed to `bg-surface-raised`; collapsible "Show code" trigger uses `bg-surface-overlay` (was transparent when embedded, making it invisible).

## [0.2.0] - 2026-03-13

### Changed (Breaking)
- **Compound component pattern** for `DropdownMenu`, `ContextMenu`, `Tooltip`, `Popover`, `HoverCard`, `Collapsible`, `MenuBar` (previously `NavigationMenu`), `MegaMenu`, and `Wizard`/`Stepper`. Sub-components are now accessed as properties of the root (e.g. `DropdownMenu.Trigger`, `HoverCard.Content`) instead of separate named exports. Update imports accordingly.
- `HoverCard.Content` `showArrow` now defaults to `true` (was `false`). Pass `showArrow={false}` to opt out.

### Fixed
- Resolved `computations created outside a createRoot or render will never be disposed` SolidJS warning — caused by JSX expressions in module-level data arrays in consumer apps, not by the icon helper.
- Fixed infinite recursion in `Collapsible`, `DropdownMenu`, `ContextMenu`, and `Tooltip` caused by `Object.assign` mutating Kobalte's namespace object — original sub-component references are now captured before reassignment.
- Fixed `MegaMenu` full-width variant opening taller than content then shrinking — removed `height` from viewport CSS transition so height snaps immediately.

## [0.1.1] - 2026-03-10

### Added
- `MegaMenuBarLink` exported from `@torch-ui/solid/navigation` barrel
- `FileUploadLabels` interface and `labels` prop on `FileUpload` — override any of the 27 built-in UI strings (dropzone copy, button text, aria-labels, status text, validation errors, summary messages) for full localisation support; English defaults preserved for backwards compatibility

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

