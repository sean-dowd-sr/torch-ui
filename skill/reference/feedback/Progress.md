# Progress

**Category:** feedback
**Import:** `@torch-ui/solid/feedback`
**Source:** `src/components/feedback/Progress.tsx`

## Exports

```ts
import {
  Progress,
  type ProgressSize,
  type ProgressColor,
  type ProgressRadius,
  type ProgressClassNames,
  type ProgressProps
} from "@torch-ui/solid/feedback";
```

## Props

```ts
export interface ProgressProps {
	/** Current value (between minValue and maxValue) */
	value?: number
	/** Minimum value */
	minValue?: number
	/** Maximum value */
	maxValue?: number
	/** Label above the bar; also used for aria-label when aria-label not set and label is a string */
	label?: JSX.Element | string
	/** Custom value label (e.g. "3/10"). When not set, value is shown as percentage if showValueLabel. */
	valueLabel?: JSX.Element
	/** Size of the track */
	size?: ProgressSize
	/** Color of the indicator */
	color?: ProgressColor
	/** Track and indicator radius */
	radius?: ProgressRadius
	/** Intl.NumberFormat options for default value display (e.g. { style: 'percent' }) */
	formatOptions?: Intl.NumberFormatOptions
	/** Whether to show the value label (default true when determinate and no valueLabel) */
	showValueLabel?: boolean
	/** Indeterminate animation when total progress is unknown */
	isIndeterminate?: boolean
	/** Striped indicator */
	isStriped?: boolean
	/** Disabled state */
	disabled?: boolean
	/** Disable fill animation */
	disableAnimation?: boolean
	/** When set, render as segmented bar (e.g. password strength) */
	segments?: number
	/** Animate from 0 to 100 over this duration (ms). Use for indeterminate-duration progress. */
	durationMs?: number
	/** Accessible label (required when label prop is not provided) */
	'aria-label'?: string
	'aria-labelledby'?: string
	'aria-describedby'?: string
	'aria-valuetext'?: string
	'aria-valuenow'?: number
	'aria-valuemin'?: number
	'aria-valuemax'?: number
	/** Slot class overrides */
	classNames?: ProgressClassNames
	class?: string
	trackClass?: string
	fillClass?: string
}
```

```ts
export type ProgressSize = 'sm' | 'md' | 'lg'
```

```ts
export type ProgressColor =
	| 'default'
	| 'primary'
	| 'secondary'
	| 'success'
	| 'warning'
	| 'danger'
```

```ts
export type ProgressRadius = 'none' | 'sm' | 'md' | 'lg' | 'full'
```
