# Slider

**Category:** forms
**Import:** `@torch-ui/solid/forms`
**Source:** `src/components/forms/Slider.tsx`

## Exports

```ts
import {
  Slider,
  type SliderSize,
  type SliderProps
} from "@torch-ui/solid/forms";
```

## Props

```ts
export interface SliderProps {
	/** Label for the slider. */
	label?: string
	/** Hint text below the control. */
	helperText?: JSX.Element
	/** Error message and invalid styling. */
	error?: JSX.Element
	/** When true, never render label row or error/helper text (control only). */
	bare?: boolean
	/** When true, show required indicator on label. */
	required?: boolean
	/** When true, show "optional" on the label row when not required. Default false. */
	optional?: boolean
	/** Controlled value(s). Single thumb: [number], range: [min, max]. */
	value?: number[]
	/** Default value(s) when uncontrolled. */
	defaultValue?: number[]
	/** Called when value changes. */
	onValueChange?: (value: number[]) => void
	/** Called when user finishes dragging. */
	onValueChangeEnd?: (value: number[]) => void
	/** Called when the user interacts with the control while an error is shown, allowing the parent to clear the error. */
	onErrorClear?: () => void
	/** Minimum value. Default 0. */
	minValue?: number
	/** Maximum value. Default 100. */
	maxValue?: number
	/** Step. Default 1. */
	step?: number
	/** Minimum steps between thumbs (for range). */
	minStepsBetweenThumbs?: number
	/** Custom accessible value label. */
	getValueLabel?: (params: { values: number[] }) => string
	/** Orientation. */
	orientation?: 'horizontal' | 'vertical'
	/** Content before the track (e.g. icon or min label). */
	startContent?: JSX.Element
	/** Content after the track (e.g. icon or max label). */
	endContent?: JSX.Element
	/** Track thickness (height for horizontal, width for vertical). Default sm. Length is controlled by container. */
	size?: SliderSize
	/** Track and thumb color. Default primary (theme). */
	color?: 'primary' | 'indigo' | 'rose'
	/** Optional marks (e.g. [0, 25, 50, 75, 100]) shown below the track, aligned with step positions. */
	marks?: number[]
	/** Disabled. */
	disabled?: boolean
	/** Name for form submission. */
	name?: string
	/** Root class. */
	class?: string
}
```

```ts
export type SliderSize = 'sm' | 'md' | 'lg'
```
