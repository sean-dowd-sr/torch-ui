/**
 * Canonical interactive-component size scale.
 * All TorchUI interactive components use this type so xs/sm/md/lg/xl produce
 * identical rendered heights, enabling mixed-component toolbars to align naturally.
 *
 * Heights (border-box):
 *   xs → h-7  (28px)
 *   sm → h-8  (32px)
 *   md → h-9  (36px) ← standard default
 *   lg → h-10 (40px)
 *   xl → h-11 (44px)
 */
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface InputSizeConfig {
	/** Height + min-height Tailwind classes. */
	h: string
	/** Vertical padding class. */
	py: string
	/** Font-size class. */
	text: string
	/** Left padding when no start adornment. */
	pl: string
	/** Right padding when no end adornment. */
	pr: string
	/** Left padding when a start adornment is present. */
	plAdorn: string
	/** Right padding when an end adornment is present. */
	prAdorn: string
	/** CSS `left` value for the start adornment element. */
	adornStart: string
	/** CSS `right` value for the end adornment element. */
	adornEnd: string
}

/**
 * Per-size layout config for form-input trigger elements
 * (Input, NumberField, Select, MultiSelect, Autocomplete).
 */
export const inputSizeConfig: Record<ComponentSize, InputSizeConfig> = {
	xs: { h: 'h-7 min-h-7',   py: 'py-1',   text: 'text-xs',   pl: 'pl-2',   pr: 'pr-2',   plAdorn: 'pl-7',  prAdorn: 'pr-7',  adornStart: 'left-2',   adornEnd: 'right-2'   },
	sm: { h: 'h-8 min-h-8',   py: 'py-1.5', text: 'text-xs',   pl: 'pl-2.5', pr: 'pr-2.5', plAdorn: 'pl-8',  prAdorn: 'pr-8',  adornStart: 'left-2',   adornEnd: 'right-2'   },
	md: { h: 'h-9 min-h-9',   py: 'py-2',   text: 'text-sm',   pl: 'pl-3',   pr: 'pr-3',   plAdorn: 'pl-9',  prAdorn: 'pr-9',  adornStart: 'left-2.5', adornEnd: 'right-2.5' },
	lg: { h: 'h-10 min-h-10', py: 'py-2',   text: 'text-sm',   pl: 'pl-3.5', pr: 'pr-3.5', plAdorn: 'pl-10', prAdorn: 'pr-10', adornStart: 'left-3',   adornEnd: 'right-3'   },
	xl: { h: 'h-11 min-h-11', py: 'py-2.5', text: 'text-base', pl: 'pl-4',   pr: 'pr-4',   plAdorn: 'pl-11', prAdorn: 'pr-11', adornStart: 'left-3.5', adornEnd: 'right-3.5' },
}
