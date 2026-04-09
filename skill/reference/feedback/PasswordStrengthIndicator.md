# PasswordStrengthIndicator

**Category:** feedback
**Import:** `@torch-ui/solid/feedback`
**Source:** `src/components/feedback/password/PasswordStrengthIndicator.tsx`

## Exports

```ts
import {
  PasswordStrengthIndicator,
  type PasswordStrength,
  type PasswordStrengthDetail,
  type PasswordStrengthMessages,
  type PasswordStrengthIndicatorProps
} from "@torch-ui/solid/feedback";
```

## Props

```ts
export interface PasswordStrengthIndicatorProps {
	/** Current strength level */
	strength: PasswordStrength
	/** Score for the progress bar (0-100) */
	score?: number
	/** Optional details about what passed/failed */
	details?: PasswordStrengthDetail[]
	class?: string
	/** Show helper text below the bar. Default: true. */
	showHelperText?: boolean
	/** Custom labels and helper text for each strength level */
	messages?: PasswordStrengthMessages
	/** Custom title for the indicator */
	title?: string
	/** Number of segments for the progress bar. Default: 8 */
	segments?: number
}
```

```ts
export type PasswordStrength = 'empty' | 'poor' | 'fair' | 'good' | 'excellent'
```

```ts
export interface PasswordStrengthDetail {
	name: string
	passed: boolean
	optional?: boolean
}
```

```ts
export interface PasswordStrengthMessages {
	empty?: { label?: string; helperText?: string }
	poor?: { label?: string; helperText?: string }
	fair?: { label?: string; helperText?: string }
	good?: { label?: string; helperText?: string }
	excellent?: { label?: string; helperText?: string }
}
```
