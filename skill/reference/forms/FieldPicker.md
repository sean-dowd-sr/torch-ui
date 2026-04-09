# FieldPicker

**Category:** forms
**Import:** `@torch-ui/solid/forms`
**Source:** `src/components/forms/FieldPicker.tsx`

## Exports

```ts
import {
  FieldPicker,
  type FieldPickerOption,
  type FieldPickerProps
} from "@torch-ui/solid/forms";
```

## Props

```ts
export interface FieldPickerProps {
	label?: string
	options: FieldPickerOption[]
	value: string
	onValueChange: (value: string) => void
	onAdd: () => void
	addLabel?: string
	addIcon?: JSX.Element
	addDisabled?: boolean
	placeholder?: string
	class?: string
}
```

```ts
export interface FieldPickerOption {
	value: string
	label: string
}
```
