# Switch

**Category:** forms
**Import:** `@torch-ui/solid/forms`
**Source:** `src/components/forms/Switch.tsx`

## Exports

```ts
import {
  Switch,
  type SwitchProps
} from "@torch-ui/solid/forms";
```

## Props

```ts
export interface SwitchProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange' | 'onValueChange'> {

	/** Label text. */

	label?: string

	/** Visual style variant. */

	variant?: 'default' | 'icon'

	/** Icon to render inside the thumb when unchecked (icon variant). */

	thumbOffIcon?: JSX.Element

	/** Icon to render inside the thumb when checked (icon variant). */

	thumbOnIcon?: JSX.Element

	/** Track color when unchecked. Accepts any CSS color string (e.g. 'rebeccapurple', '#fff', 'var(--color-surface-dim)'). */

	trackColor?: string

	/** Track color when checked. Accepts any CSS color string (e.g. 'var(--color-primary-500)'). */

	trackCheckedColor?: string

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

	/** Controlled checked state. */

	checked?: boolean

	/** Default checked (uncontrolled). */

	defaultChecked?: boolean

	/** Called when checked state changes. */

	onValueChange?: (checked: boolean) => void

	/** Called when the user interacts with the control while an error is shown, allowing the parent to clear the error. */

	onErrorClear?: () => void

	/** Disables the switch. */

	disabled?: boolean

	/** For form submission when checked (e.g. "on"). */

	value?: string

	/** Form name. */

	name?: string

	/** Component size. Default 'md'. */

	size?: ComponentSize

	/** When true, the root wrapper uses full width. Default true. */

	fullWidth?: boolean

	/** Additional class for the root wrapper. */

	class?: string

	/** Additional class for the control (track). */

	controlClass?: string

	/** Ref forwarded to the root wrapper div. */

	ref?: (el: HTMLDivElement) => void

}
```
