# Loading

**Category:** feedback
**Import:** `@torch-ui/solid/feedback`
**Source:** `src/components/feedback/Loading.tsx`

## Exports

```ts
import {
  Loading,
  type LoadingVariant,
  type LoadingProps
} from "@torch-ui/solid/feedback";
```

## Props

```ts
export interface LoadingProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Spinner (default) or skeleton layout for full-page loading. Omit for spinner. */
	variant?: LoadingVariant
	/** For spinner: message (default "Loading…"). Omit or set iconOnly for no message. */
	message?: string
	/** For spinner: when true, show only the spinner (no message). */
	iconOnly?: boolean
	/** For spinner: size of the icon. Ignored when icon is provided. */
	size?: 'sm' | 'md' | 'lg'
	/** For spinner: custom icon element. Add animate-spin and size classes. */
	icon?: JSX.Element
	/** For spinner: minimum height (default 200px when not iconOnly). */
	minHeight?: string | number
}
```

```ts
export type LoadingVariant =
	| 'spinner'
	| 'dashboard'
	| 'tablePage'
	| 'admin'
	| 'generic'
```
