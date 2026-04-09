# DarkModeToggle

**Category:** actions
**Import:** `@torch-ui/solid/actions`
**Source:** `src/components/actions/DarkModeToggle.tsx`

## Exports

```ts
import {
  DarkModeToggle,
  type ColorScheme,
  type DarkModeToggleProps
} from "@torch-ui/solid/actions";
```

## Props

```ts
export interface DarkModeToggleProps {
	variant?: 'icon' | 'switch'
	/** Controlled value. When provided, internal state is bypassed. */
	value?: ColorScheme
	/** Called when the user toggles. Use with `value` for controlled mode. */
	onValueChange?: (scheme: ColorScheme) => void
	/** Element to toggle the `dark` class on. Default: `document.documentElement`. */
	target?: () => HTMLElement
	/** localStorage key for persistence. Set to `false` to disable. Default `'torch-theme'`. */
	storageKey?: string | false
	/** Set `data-switching-theme` on body during toggle to suppress CSS transitions. Default: true. */
	suppressTransitions?: boolean
	class?: string
}
```

```ts
export type ColorScheme = 'light' | 'dark'
```
