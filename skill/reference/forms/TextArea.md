# TextArea

**Category:** forms
**Import:** `@torch-ui/solid/forms`
**Source:** `src/components/forms/TextArea.tsx`

## Exports

```ts
import {
  TextArea,
  type TextAreaResize,
  type TextAreaProps
} from "@torch-ui/solid/forms";
```

## Props

```ts
export interface TextAreaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string
	error?: JSX.Element
	helperText?: JSX.Element
	/** When true, never render label row or error/helper text (textarea only) */
	bare?: boolean
	required?: boolean
	optional?: boolean
	resize?: TextAreaResize
	maxLength?: number
	autoresize?: boolean
	inputClass?: string
	onValueChange?: (value: string) => void
	onErrorClear?: () => void
}
```

```ts
export type TextAreaResize = 'none' | 'vertical' | 'horizontal' | 'both'
```
