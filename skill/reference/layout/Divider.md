# Divider

**Category:** layout
**Import:** `@torch-ui/solid/layout`
**Source:** `src/components/layout/Divider.tsx`

## Exports

```ts
import {
  Divider,
  type DividerStyle,
  type DividerWeight,
  type DividerProps
} from "@torch-ui/solid/layout";
```

## Props

```ts
export interface DividerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Optional label shown in the center (e.g. "or continue with") */
	label?: string
	/** Line style: solid (default), dotted, or dashed */
	lineStyle?: DividerStyle
	/** Line thickness: thin (1px), medium (2px), or thick (4px). Default thin. */
	weight?: DividerWeight
}
```

```ts
export type DividerStyle = 'solid' | 'dotted' | 'dashed'
```

```ts
export type DividerWeight = 'thin' | 'medium' | 'thick'
```
