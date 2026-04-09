# Chart

**Category:** charts
**Import:** `@torch-ui/solid/charts`
**Source:** `src/components/charts/Chart.tsx`

## Exports

```ts
import {
  Chart,
  type ChartType,
  type ScatterPoint,
  type BubblePoint,
  type ChartDataset,
  type ChartData,
  type ChartProps
} from "@torch-ui/solid/charts";
```

## Props

```ts
export interface ChartProps {
	/** Chart type: line, bar, doughnut, pie, radar, polarArea, scatter, or bubble */
	type: ChartType
	/** Chart data: labels and datasets */
	data: ChartData
	/** When type is 'line', fill area under the line. Default false. Same idea as Sparkline fill. */
	fill?: boolean
	/** Dataset border width. Defaults: line=2, bar=0, doughnut/pie handled by segment borders. */
	borderWidth?: number
	/** Optional Chart.js options override (merged with defaults) */
	options?: ChartConfiguration<ChartType>['options']
	/** Accessible label for the chart wrapper. When provided, the chart is exposed to assistive tech. */
	'aria-label'?: string
	/** ID of an element that labels the chart. When provided, the chart is exposed to assistive tech. */
	'aria-labelledby'?: string
	class?: string
}
```

```ts
export type ChartType = 'line' | 'bar' | 'doughnut' | 'pie' | 'radar' | 'polarArea' | 'scatter' | 'bubble'
```

```ts
export type ScatterPoint = { x: number; y: number }
```

```ts
export type BubblePoint = { x: number; y: number; r: number }
```

```ts
export interface ChartDataset {
	label: string
	/** For line/bar/pie/doughnut/radar/polarArea: number[]. For scatter: ScatterPoint[]. For bubble: BubblePoint[]. */
	data: number[] | ScatterPoint[] | BubblePoint[]
	backgroundColor?: string | string[]
	borderColor?: string | string[]
	hoverBackgroundColor?: string | string[]
	hoverBorderColor?: string | string[]
}
```

```ts
export interface ChartData {
	/** For scatter/bubble can be empty []. For other types, one label per data point. */
	labels: string[]
	datasets: ChartDataset[]
}
```
