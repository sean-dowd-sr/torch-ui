# ColorSwatch

**Category:** data-display
**Import:** `@torch-ui/solid/data-display`
**Source:** `src/components/data-display/ColorSwatch.tsx`

## Exports

```ts
import {
  ColorSwatch,
  type ColorSwatchVariant,
  type ColorSwatchProps
} from "@torch-ui/solid/data-display";
```

## Props

```ts
export interface ColorSwatchProps {
	/** Color as hex string (e.g. #3b82f6). */
	value: string
	/** Shape: rounded (default), circle, or square. */
	variant?: ColorSwatchVariant
	/** Optional accessible name for the color. */
	colorName?: string
	class?: string
	style?: JSX.CSSProperties
	'aria-label'?: string
}
```

```ts
export type ColorSwatchVariant = 'rounded' | 'circle' | 'square'
```
