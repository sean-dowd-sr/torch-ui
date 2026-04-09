# CodeInput

**Category:** forms
**Import:** `@torch-ui/solid/forms`
**Source:** `src/components/forms/CodeInput.tsx`

## Exports

```ts
import {
  CodeInput,
  type CodeInputProps
} from "@torch-ui/solid/forms";
```

## Props

```ts
export interface CodeInputProps

	extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'maxLength'> {

	/** 'single' = one input; 'digits' = one input per digit with paste/keyboard nav (e.g. verification code) */

	variant?: 'single' | 'digits'

	label?: string

	error?: JSX.Element

	helperText?: JSX.Element

	/** When true, never render label row or error/helper text (control only). */

	bare?: boolean

	/** When true, show required indicator on label. */

	required?: boolean

	/** When true, show "optional" on the label row when not required. Default false. */

	optional?: boolean

	/** Length of code (default 6) */

	length?: number

	value?: string

	onValueChange?: (value: string) => void

	onErrorClear?: () => void

	/** Component size. Default 'md'. */

	size?: ComponentSize

}
```
