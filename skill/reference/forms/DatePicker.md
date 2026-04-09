# DatePicker

**Category:** forms
**Import:** `@torch-ui/solid/forms`
**Source:** `src/components/forms/DatePicker.tsx`

## Exports

```ts
import {
  DatePicker,
  type DatePickerPreset,
  type DatePickerProps
} from "@torch-ui/solid/forms";
```

## Props

```ts
export interface DatePickerProps {

	value?: string

	onValueChange?: (value: string) => void

	/** Called when the user interacts with the control while an error is shown, allowing the parent to clear the error. */

	onErrorClear?: () => void

	placeholder?: string

	disabled?: boolean

	/** Min date YYYY-MM-DD */

	min?: string

	/** Max date YYYY-MM-DD */

	max?: string

	label?: string

	error?: JSX.Element

	helperText?: JSX.Element

	bare?: boolean

	required?: boolean

	/** When true, show "optional" on the label row when not required. Default false. */

	optional?: boolean

	/** Component size. Default 'md'. */

	size?: ComponentSize

	class?: string

	id?: string

	/** Quick-select presets shown in a sidebar. Each has label and value (YYYY-MM-DD). */

	presets?: DatePickerPreset[]

	/** When true, adds HH:MM time selectors in the footer. Value format becomes YYYY-MM-DDTHH:MM. */

	showTime?: boolean

	/** Clock format for time picker. Default '12h'. */

	timeFormat?: '12h' | '24h'

}
```

```ts
export interface DatePickerPreset {

	label: string

	value: string

}
```
