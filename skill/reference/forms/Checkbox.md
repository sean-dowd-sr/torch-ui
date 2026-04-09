# Checkbox

**Category:** forms
**Import:** `@torch-ui/solid/forms`
**Source:** `src/components/forms/Checkbox.tsx`

## Exports

```ts
import {
  Checkbox,
  type CheckboxSize,
  type CheckboxProps
} from "@torch-ui/solid/forms";
```

## Props

```ts
export interface CheckboxProps extends Omit<JSX.HTMLAttributes<HTMLInputElement>, 'onChange' | 'onValueChange'> {

	/** Label text (or use children). */

	label?: string

	/** Error message shown below the checkbox. */

	error?: JSX.Element

	/** Hint text below the checkbox. */

	helperText?: JSX.Element

	/** When true, never render label row or error/helper text (checkbox only). */

	bare?: boolean

	/** When true, show as required (e.g. asterisk). */

	required?: boolean

	/** When true, show "optional" on the label row when not required. Default false. */

	optional?: boolean

	/** Controlled checked state. */

	checked?: boolean

	/** Controlled change handler. Receives the new checked boolean. */

	onValueChange?: (checked: boolean) => void

	/** Called when the user interacts with the control while an error is shown, allowing the parent to clear the error. */

	onErrorClear?: () => void

	/** Visual size. */

	size?: CheckboxSize

	/** Indeterminate state (e.g. parent when some children selected). */

	indeterminate?: boolean

	/** Disable the checkbox. */

	disabled?: boolean

	class?: string

	id?: string

	/** Form field name. */

	name?: string

	/** Form field value. */

	value?: string

	children?: JSX.Element

}
```

```ts
export type CheckboxSize = 'sm' | 'md'
```
