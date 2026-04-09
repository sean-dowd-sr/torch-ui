# EmptyState

**Category:** data-display
**Import:** `@torch-ui/solid/data-display`
**Source:** `src/components/data-display/EmptyState.tsx`

## Exports

```ts
import {
  EmptyState,
  type EmptyStateProps
} from "@torch-ui/solid/data-display";
```

## Props

```ts
export interface EmptyStateProps extends JSX.HTMLAttributes<HTMLDivElement> {
	title: string
	description?: JSX.Element
	icon?: JSX.Element
	actions?: JSX.Element
	/** When true, sets role="status" + aria-live="polite" so screen readers announce the empty state. Default: false. */
	announce?: boolean
}
```
