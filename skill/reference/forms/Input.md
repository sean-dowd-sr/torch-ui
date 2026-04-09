# Input

**Category:** forms
**Import:** `@torch-ui/solid/forms`
**Source:** `src/components/forms/Input.tsx`

## Exports

```ts
import {
  Input,
  type InputProps
} from "@torch-ui/solid/forms";
```

## Props

```ts
export interface InputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
	label?: string
	/** Optional content on the label row (e.g. "Forgot password?" link) */
	labelTrailing?: JSX.Element
	error?: JSX.Element
	helperText?: JSX.Element
	/** When true, never render label row or error/helper text (input only; error still affects border) */
	bare?: boolean
	/** When true, native required on input and required indicator (asterisk) on label. */
	required?: boolean
	/** When true, show "optional" on the label row when the field is not required. Default false. */
	optional?: boolean
	/** Input size. Controls height, text size, and padding. Default: md (36px). */
	size?: ComponentSize
	/** When true and type is "password", show a show/hide toggle (eye icon) to reveal the password. Default false. */
	revealable?: boolean
	/** Content at the start of the input (e.g. "$", a currency label, or an icon). */
	startAdornment?: JSX.Element
	/** Content at the end of the input (e.g. "USD", a unit label, or an icon). */
	endAdornment?: JSX.Element
	/** Fixed text/content segment at the start, separated by a border (e.g. "https://"). Renders outside the text area so it cannot be overwritten. */
	prefix?: JSX.Element
	/** Fixed text/content segment at the end, separated by a border (e.g. ".com"). Renders outside the text area so it cannot be overwritten. */
	suffix?: JSX.Element
	/** @deprecated Use startAdornment. */
	leftIcon?: JSX.Element
	/** @deprecated Use endAdornment. */
	rightIcon?: JSX.Element
	/** Applied to the native input element when you need to style the control itself. */
	inputClass?: string
	onValueChange?: (value: string) => void
	onErrorClear?: () => void
}
```
