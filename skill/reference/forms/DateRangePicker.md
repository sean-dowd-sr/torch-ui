# DateRangePicker

**Category:** forms
**Import:** `@torch-ui/solid/forms`
**Source:** `src/components/forms/DateRangePicker.tsx`

## Exports

```ts
import {
  DateRangePicker,
  type DateRangePickerProps
} from "@torch-ui/solid/forms";
```

## Props

```ts
export interface DateRangePickerProps {

	/** ISO date string YYYY-MM-DD for range start */

	start?: string

	/** ISO date string YYYY-MM-DD for range end */

	end?: string

	/** Called when range changes. end may be empty string if only start is selected. */

	onValueChange?: (start: string, end: string) => void

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

	optional?: boolean

	/** Show two months side by side. Default: true */

	dualMonth?: boolean

	/** Allow clearing the range. Default: true */

	clearable?: boolean

	/** Component size. Default 'md'. */

	size?: ComponentSize

	/** When true, include HH:MM time pickers for start and end. Value format becomes YYYY-MM-DDTHH:MM. */

	showTime?: boolean

	/** Time display format when showTime is true. Default: '12h'. */

	timeFormat?: '12h' | '24h'

	/** Minute increment for the time picker. Default: 1 (every minute). */

	minuteStep?: number

	class?: string

	id?: string

}
```
