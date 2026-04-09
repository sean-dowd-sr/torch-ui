# ColorPicker

**Category:** forms
**Import:** `@torch-ui/solid/forms`
**Source:** `src/components/forms/ColorPicker/ColorPicker.tsx`

## Exports

```ts
import {
  ColorPicker,
  type ColorFormat,
  type ColorPickerProps
} from "@torch-ui/solid/forms";
```

## Props

```ts
export interface ColorPickerProps {

	/** Current value as hex (e.g. #3b82f6). */

	value?: string

	onValueChange?: (hex: string) => void

	/** Preset hex colors shown as swatches. Defaults to a built-in set. */

	presets?: string[]

	/** Optional label above the control. */

	label?: string

	/** Error message and invalid styling. */

	error?: JSX.Element

	/** Hint text below the control. */

	helperText?: JSX.Element

	/** When true, never render label row or error/helper text (control only). */

	bare?: boolean

	/** When true, show required indicator on label. */

	required?: boolean

	/** When true, show "optional" on the label row when not required. Default false. */

	optional?: boolean

	/** Called when the user interacts with the control while an error is shown, allowing the parent to clear the error. */

	onErrorClear?: () => void

	/** Component size. 'sm' hides preset strip and shows trigger only. Default 'md'. */

	size?: ComponentSize

	disabled?: boolean

	class?: string

	/** Max number of "last used" colors to keep. 0 to hide. Default 9. */

	lastUsedCount?: number

	/** Which format(s) to show in the custom panel. Default ['hex']. Use more for Hex/RGB/HSL/HSB tabs. */

	allowedFormats?: ColorFormat[]

	/** Predefined hex colors shown at the bottom of the custom panel, below last used. Use for theme presets etc. */

	predefined?: string[]

}
```

```ts
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsb'
```
