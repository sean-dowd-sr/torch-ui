# Sparkline

**Category:** charts
**Import:** `@torch-ui/solid/charts`
**Source:** `src/components/charts/Sparkline.tsx`

## Exports

```ts
import {
  Sparkline,
  type SparklineProps
} from "@torch-ui/solid/charts";
```

## Props

```ts
export interface SparklineProps {
	/** Data points for the line (e.g. [12, 19, 8, 15, 22, 18]). */
	data: number[]
	/** Line and fill color (CSS color, e.g. rgb(59, 130, 246) or #3b82f6). Default: primary blue. */
	color?: string
	/** Fill area under the line. Default true. */
	fill?: boolean
	/** Line tension (0 = straight, 0.4 = smooth). Default 0.3. */
	tension?: number
	/** Show a point at the last value. Default true. */
	showPoint?: boolean
	/** Fix the y-axis minimum. Useful to prevent the line from filling the full height when values are close together. */
	min?: number
	/** Fix the y-axis maximum. */
	max?: number
	/** Accessible label for the sparkline. When provided, the chart is exposed to assistive tech. */
	'aria-label'?: string
	/** ID of an element that labels the sparkline. When provided, the chart is exposed to assistive tech. */
	'aria-labelledby'?: string
	class?: string
}
```
