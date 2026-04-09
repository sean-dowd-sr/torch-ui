# RelativeDateDefaultInput

**Category:** forms
**Import:** `@torch-ui/solid/forms`
**Source:** `src/components/forms/RelativeDateDefaultInput.tsx`

## Exports

```ts
import {
  RelativeDateDefaultInput,
  type RelativeDateDefaultInputProps
} from "@torch-ui/solid/forms";
```

## Props

```ts
export interface RelativeDateDefaultInputProps {
	value: string
	onValueChange: (value: string) => void
	/** Label before the controls (default "Today") */
	prefixLabel?: string
	/** Label after days (default "day(s)") */
	suffixLabel?: string
	class?: string
}
```
