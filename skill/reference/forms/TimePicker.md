# TimePicker

**Category:** forms
**Import:** `@torch-ui/solid/forms`
**Source:** `src/components/forms/TimePicker.tsx`

## Exports

```ts
import {
  TimePicker,
  type TimePickerProps
} from "@torch-ui/solid/forms";
```

## Props

```ts
export interface TimePickerProps {

	value?: string

	onValueChange?: (value: string) => void

	/** Called when the user interacts with the control while an error is shown. */

	onErrorClear?: () => void

	placeholder?: string

	disabled?: boolean

	/** Time display format. Default: '12h'. */

	timeFormat?: '12h' | '24h'

	/** Minute increment. Default: 1 (every minute). */

	minuteStep?: number

	label?: string

	error?: JSX.Element

	helperText?: JSX.Element

	/** When true, renders without label/error chrome. */

	bare?: boolean

	required?: boolean

	/** Show "optional" badge when not required. */

	optional?: boolean

	size?: ComponentSize

	class?: string

	id?: string

}
```
