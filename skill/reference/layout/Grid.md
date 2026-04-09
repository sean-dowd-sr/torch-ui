# Grid

**Category:** layout
**Import:** `@torch-ui/solid/layout`
**Source:** `src/components/layout/Grid.tsx`

## Exports

```ts
import {
  Grid,
  type GridCols,
  type GridGap,
  type GridProps
} from "@torch-ui/solid/layout";
```

## Props

```ts
export interface GridProps {
	/** Number of columns (1–6). Default 1. */
	cols?: GridCols
	/** Gap between items. Default md. */
	gap?: GridGap
	/** Additional class for the grid wrapper. */
	class?: string
	children?: JSX.Element
}
```

```ts
export type GridCols = 1 | 2 | 3 | 4 | 5 | 6
```

```ts
export type GridGap = 'none' | 'sm' | 'md' | 'lg' | 'xl'
```
