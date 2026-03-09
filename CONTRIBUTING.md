# Contributing to TorchUI

Guidelines for building and maintaining components in this library. Every component should follow these practices.

---

## 1. Color Tokens

- **Always use design tokens** — never raw Tailwind color classes for backgrounds, borders, or text
- **Surface tokens** for structural chrome:
  - `surface-base` — page/app background
  - `surface-raised` — cards, inputs, dropdowns
  - `surface-overlay` — hover states, subtle fills
  - `surface-dim` — disabled backgrounds, track fills
  - `surface-border` — all borders and dividers
- **Ink tokens** for text and icons:
  - `text-ink-900` — primary text
  - `text-ink-700` — labels, secondary headings
  - `text-ink-500` — muted text, helper text, placeholders (use `text-ink-400` for `placeholder:`)
- **Semantic tokens** for intent: `primary-*`, `danger-*`, `success-*`, `warning-*`, `info-*`
  - Never substitute Tailwind equivalents (e.g. do not use `sky-*` for info)
- **No `dark:ink-*` or `dark:surface-*` overrides** — ink and surface auto-invert in dark mode via CSS variables. Adding `dark:` variants fights the auto-swap and produces wrong colors.
- `dark:` overrides are only valid for semantic/brand colors that don't auto-adjust (e.g. `primary-*` on a `Link` used as text in a paragraph).

## 2. Focus Rings

Two patterns — never mixed:

**Interactive elements** (buttons, links, toggles, checkboxes, radio items, tree nodes):
```
outline-none focus-visible:ring-2 focus-visible:ring-{color}/50
```
- Keyboard-only (`:focus-visible`)
- **No `ring-offset`** — causes clipping inside overflow containers

**Form fields** (Input, TextArea, Select trigger, NumberField, CodeInput, MultiSelect trigger):
```
focus:ring-2 focus:ring-inset focus:ring-{color}-500
```
- Always visible on focus (`:focus`, not `:focus-visible`)
- Inset ring so it doesn't expand the element

Error state: swap ring color to `danger-500`. No other changes to the ring pattern.

## 3. Accessibility

- `aria-hidden="true"` as a **string literal**, never `{true}` (boolean). This is a JSX quirk: JSX strips boolean `false` attributes entirely, but in some AT implementations the mere presence of `aria-hidden` (even as `"false"`) hides the element. The string `"true"` is the safe, spec-compliant form in JSX.
- **Icon-only interactive elements** must have `aria-label`, `title`, or `aria-labelledby`. Emit a `console.warn` in `import.meta.env.DEV` when missing.
- **Bare form fields** (label suppressed via `bare` prop) must have an accessible name from the caller. Emit a DEV warning when none is present.
- All decorative icons must carry `aria-hidden="true"`.
- Use semantic HTML — don't override `role` unless Kobalte doesn't provide the correct one automatically.

## 4. Consistent Props API

All form-like components expose this standard set:

| Prop | Type | Purpose |
|---|---|---|
| `label` | `string` | Visible label |
| `helperText` | `string` | Hint shown below the control |
| `error` | `string` | Error message; also triggers invalid styling |
| `bare` | `boolean` | Suppress label/helper/error (control only) |
| `required` | `boolean` | Shows `*` indicator on label |
| `optional` | `boolean` | Shows "optional" when `!required` |
| `onValueChange` | `(value) => void` | Typed change handler (not native `onChange`) |
| `onErrorClear` | `() => void` | Called when user interacts while an error is shown |
| `disabled` | `boolean` | Always a named prop, never only via spread |
| `size` | `ComponentSize` | From prop or `useComponentSize()` context; default `md` |
| `class` | `string` | Applied to the root wrapper via `cn()` |

## 5. Prop Destructuring

- Use `splitProps` to separate component-specific props from HTML attribute passthrough (`others`)
- Spread `{...others}` only onto the semantically correct element (e.g. the native `<input>`, not a wrapper `<div>`)
- Never spread `others` onto the root wrapper when it would leak non-HTML props to the DOM
- Always strip non-semantic props from `splitProps` before spreading `others` — e.g. native `onChange` on a component that exposes `onValueChange`. Leaving them in `others` leaks handlers that have no meaning on the target element and can produce confusing behaviour or DOM warnings.

## 6. Kobalte Primitives

- Use Kobalte for any component requiring: focus trap, keyboard navigation, automatic ARIA roles, or managed open/close state
- Import convention: `import { Name as KobalteName } from '@kobalte/core/name'` — the named import IS the root; sub-components via `KobalteName.SubComponent`
- Don't duplicate what Kobalte provides automatically (e.g. `role="separator"` on `Divider` — `Separator` adds it)

## 7. Reactivity

- Derived values that **depend on reactive state** must be accessor functions (`const foo = () => ...`), not expressions evaluated once at creation time. `const` is correct for values derived from non-reactive inputs — don't wrap static values in `() =>` unnecessarily.
- All reactive primitives (`createSignal`, `createEffect`, `createMemo`, etc.) must be declared **unconditionally** — never inside `if`/`switch` blocks. If you need conditional behavior, put the condition *inside* the primitive, not *around* it.
- Mode/variant decisions that are **fixed at creation time** (e.g. `toggle` vs `link` vs `button` in Button) may be computed once as a plain `const`. Always add a comment explaining why, otherwise it reads as a bug to the next reviewer.
- `createMemo` = pure derived value (cached, re-runs only when dependencies change). `createEffect` = side effect in response to reactive change. Never use one in place of the other:
  - Don't write a `createEffect` that only reads reactive state without performing a side effect — it's a no-op.
  - Don't use `createMemo` when you actually need a side effect (DOM mutation, network call, etc.).
- Prefer **`createMemo`** over bare `() =>` accessor functions for expensive derivations — array transforms, filtering, or mapping over reactive data. Bare accessors re-run on every read; `createMemo` caches the result and only re-runs when dependencies change. For simple, cheap expressions (`() => props.size ?? 'md'`) a bare accessor is fine.

## 8. CSS Animations

Inject keyframe animations via `<style>` in `onMount` with an ID guard:

```tsx
onMount(() => {
  const id = 'torch-my-component-styles'
  if (!document.getElementById(id)) {
    const style = document.createElement('style')
    style.id = id
    style.textContent = `@keyframes ...`
    document.head.appendChild(style)
  }
})
```

The injected `<style>` is **intentionally never removed**. The ID guard handles deduplication across mounts — the style is global (keyframes have no DOM scope) so removing it on cleanup would break any other instance still in the tree. This pattern is only appropriate for `@keyframes` declarations. Do not use it for component-scoped styles.

## 9. Dark Mode

- Toggle `.dark` on `document.documentElement` (`<html>`), **not** `document.body` — required for the CSS variable chain (`@theme` vars are defined on `:root`). `DarkModeToggle` enforces this as its default target; keep the component and this rule in sync.
- Persist preference in `localStorage` (default key `'torch-theme'`)
- Apply `data-switching-theme` to `body` during toggle to suppress CSS transitions

## 10. Component Structure

- Sub-components use the `Object.assign` pattern:
  ```tsx
  export const Card = Object.assign(CardRoot, { Header: CardHeader, Body: CardBody })
  ```
- Slot patterns (e.g. `ButtonGroup.Menu`) use a well-typed `Symbol` marker — never rely on component identity checks
- Export all public types alongside the component from the component file and re-export from `index.tsx`

## 11. Drag-to-Reorder

Use **`createSortableDrag`** for any sortable list or reorderable chip group. Do not reach for `@thisbeyond/solid-dnd` or any other drag library — the bespoke primitive handles our specific layout needs (both vertical lists and wrapping 2D grids).

**Required DOM attributes:**
- `data-sortable-container` on the list/grid wrapper element
- `data-sortable-id={item.id}` on each draggable item element

**API returned by `createSortableDrag`:**

| Member | Type | Usage |
|---|---|---|
| `handlePointerDown(id, e)` | function | Bind to the grip handle's `onPointerDown` |
| `getTransform(id)` | `() => string` | Apply as `style={{ transform: getTransform(item.id) \|\| undefined }}` on each item |
| `activeId()` | `() => string \| null` | Id of the item being dragged; use for opacity/visibility of the drag ghost |
| `overId()` | `() => string \| null` | Id of the current drop target |
| `isDragging()` | `() => boolean` | Use for `cursor-grabbing` and `pointer-events: none` on the active item |

**`onReorder`** receives the new id string array. The caller is responsible for updating their signal — `createSortableDrag` does not mutate state.

**Typical pattern:**
```tsx
const drag = createSortableDrag({
  items: () => props.items,
  onReorder: props.onReorder,
})

// On the container:
<div data-sortable-container>
  <For each={props.items}>
    {(item) => (
      <div
        data-sortable-id={item.id}
        style={{ transform: drag.getTransform(item.id) || undefined }}
      >
        <button
          type="button"
          aria-label={`Drag to reorder ${item.label}`}
          onPointerDown={(e) => drag.handlePointerDown(item.id, e)}
        />
      </div>
    )}
  </For>
</div>
```
