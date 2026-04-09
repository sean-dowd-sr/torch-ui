# StatCard

**Category:** data-display
**Import:** `@torch-ui/solid/data-display`
**Source:** `src/components/data-display/StatCard.tsx`

## Exports

```ts
import {
  StatCard,
  type StatCardProps
} from "@torch-ui/solid/data-display";
```

## Props

```ts
export interface StatCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	label: string
	/** Optional subtitle or category below the label (e.g. "Travel and tourism"). */
	subtitle?: string
	/** Optional icon (e.g. app logo) shown at top left. */
	icon?: JSX.Element
	/** Accessible label for the icon when it conveys meaning. When set, icon wrapper gets role="img" + aria-label. When omitted, the wrapper is transparent — the icon child controls its own accessibility. */
	iconLabel?: string
	/** Optional content at top right (e.g. Tag or "Connect" button). */
	topRight?: JSX.Element
	value?: string | number | null
	helperText?: string
	trendLabel?: string
	/** Optional secondary line below trendLabel (e.g. "last week"). Rendered smaller and muted. */
	trendSubLabel?: string
	/** Default: 'positive' (emerald). */
	trendVariant?: 'positive' | 'neutral' | 'negative'
	trendIcon?: JSX.Element
	emptyText?: string
	/** Optional content rendered below the trend block. Use for breakdown rows, sub-metrics, or any body content. Works with both chartPosition values. */
	body?: JSX.Element
	/** Optional chart or sparkline. Use chartPosition to place under the trend or to the right. */
	chart?: JSX.Element
	/** Where to render the chart: under the trend (default) or in a column to the right of the value/trend. */
	chartPosition?: 'under' | 'right'
	/** When set, the chart wrapper gets role="img" + aria-label instead of aria-hidden. The chart child should be decorative (aria-hidden) to avoid duplicate announcements. */
	chartA11yLabel?: string
	/** Tailwind height class for the chart wrapper. Default 'h-10' (under) or 'h-20' (right). */
	chartHeight?: string
	/** Tailwind width classes for the right-position chart wrapper. Default 'w-36 sm:w-44'. Only applies when chartPosition is 'right'. */
	chartWidth?: string
}
```
