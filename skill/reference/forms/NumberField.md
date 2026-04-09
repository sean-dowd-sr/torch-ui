# NumberField

**Category:** forms
**Import:** `@torch-ui/solid/forms`
**Source:** `src/components/forms/NumberField.tsx`

## Exports

```ts
import {
  NumberField,
  type NumberFieldProps
} from "@torch-ui/solid/forms";
```

## Props

```ts
export interface NumberFieldProps {

	/** Label above the input. */

	label?: string

	/** Error message and invalid styling. */

	error?: JSX.Element

	/** Hint text below the input. */

	helperText?: JSX.Element

	/** When true, never render label row or error/helper text (control only). */

	bare?: boolean

	/** When true, show required indicator on label. */

	required?: boolean

	/** When true, show "optional" on the label row when not required. Default false. */

	optional?: boolean

	/** Controlled value (number). */

	value?: number

	/** Called when value changes. */

	onValueChange?: (value: number | undefined) => void

	/** Called when the user interacts with the control while an error is shown, allowing the parent to clear the error. */

	onErrorClear?: () => void

	/** Minimum value. */

	minValue?: number

	/** Maximum value. */

	maxValue?: number

	/** Step for increment/decrement. */

	step?: number

	/** Disables the input and steppers. */

	disabled?: boolean

	/** Placeholder when empty. */

	placeholder?: string

	/** Input size. Controls height, text size, and padding. Default: md (36px). */

	size?: ComponentSize

	/** When true, show increment/decrement buttons. */

	showStepper?: boolean

	/** Stepper layout when showStepper is true. Default: "compact". */

	stepperVariant?: 'compact' | 'inlineLabel'

	/** Additional class for the root. */

	class?: string

	/** Ref forwarded to the number input element. */

	ref?: (el: HTMLInputElement) => void

}
```
