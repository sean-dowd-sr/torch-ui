# MultiSelect

**Category:** forms
**Import:** `@torch-ui/solid/forms`
**Source:** `src/components/forms/MultiSelect.tsx`

## Exports

```ts
import {
  MultiSelect,
  type MultiSelectOption,
  type MultiSelectProps
} from "@torch-ui/solid/forms";
```

## Props

```ts
export interface MultiSelectProps {



	label?: string

	helperText?: JSX.Element

	error?: JSX.Element

	bare?: boolean

	required?: boolean

	optional?: boolean

	options: MultiSelectOption[]

	value: string[]

	onValueChange: (value: string[]) => void

	onErrorClear?: () => void

	placeholder?: string

	class?: string

	reorderable?: boolean

	searchable?: boolean

	disabled?: boolean

	size?: ComponentSize

	ref?: (el: HTMLDivElement) => void

}
```

```ts
export interface MultiSelectOption {

	value: string

	label: string

	icon?: JSX.Element

}
```
