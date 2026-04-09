# Timeline

**Category:** data-display
**Import:** `@torch-ui/solid/data-display`
**Source:** `src/components/data-display/Timeline.tsx`

## Exports

```ts
import {
  Timeline,
  type TimelineItemStatus,
  type TimelineVariant,
  type TimelineConnector,
  type TimelineItem,
  type TimelineProps
} from "@torch-ui/solid/data-display";
```

## Props

```ts
export interface TimelineProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Timeline entries */
	items: TimelineItem[]
	/** Visual style. Default: 'default'. */
	variant?: TimelineVariant
	/** Connector line style. Default: 'solid'. */
	connector?: TimelineConnector
	/** Show connector line between items. Default: true. */
	showConnector?: boolean
	/** Place timestamp to the left of the connector. Default: false. */
	timeLeft?: boolean
}
```

```ts
export type TimelineItemStatus = 'completed' | 'active' | 'pending' | 'error'
```

```ts
export type TimelineVariant = 'default' | 'compact' | 'outlined'
```

```ts
export type TimelineConnector = 'solid' | 'dashed' | 'dotted'
```

```ts
export interface TimelineItem {
	id?: string
	/** Main heading for the event */
	title: JSX.Element
	/** Secondary description text */
	description?: JSX.Element
	/** Timestamp or label shown beside the title */
	time?: JSX.Element
	/** Custom icon/content inside the dot. If omitted, a default dot or status icon renders. */
	icon?: JSX.Element
	/** Controls the dot color and default icon. Default: 'pending'. */
	status?: TimelineItemStatus
	/** Extra content slot rendered below description */
	content?: JSX.Element
	/** Override the dot color with any Tailwind bg class e.g. 'bg-purple-500' */
	color?: string
}
```
