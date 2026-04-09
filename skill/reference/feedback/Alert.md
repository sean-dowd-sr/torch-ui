# Alert

**Category:** feedback
**Import:** `@torch-ui/solid/feedback`
**Source:** `src/components/feedback/Alert.tsx`

## Exports

```ts
import {
  Alert,
  type AlertStatus,
  type AlertAppearance,
  type AlertProps
} from "@torch-ui/solid/feedback";
```

## Props

```ts
export interface AlertProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
	/** Semantic status: error, success, warning, or info. Ignored when colorClass is set. */
	status?: AlertStatus
	/** Visual style: subtle (default), solid, outline, or transparent. */
	appearance?: AlertAppearance
	/** Optional icon shown at the start. */
	icon?: JSX.Element
	/** When true, shows a close button and calls onClose when clicked. */
	closeable?: boolean
	/** Called when the close button is clicked. Required when closeable is true. */
	onClose?: () => void
	/** Override default status colors. Provide Tailwind classes for border, background, and text (include dark: variants). */
	colorClass?: string
	/** Controls the ARIA live region behavior. 'assertive' → role="alert" (interrupts SR), 'polite' → role="status" (queued), 'off' → no role. Default 'polite'. */
	ariaLive?: 'polite' | 'assertive' | 'off'
	/** Optional CTAs (e.g. Resend, Upgrade) rendered at the end of the alert. */
	actions?: JSX.Element
	/** Optional heading (e.g. "Error" or "Session expired") shown above the message. */
	title?: JSX.Element
	class?: string
	children?: JSX.Element
}
```

```ts
export type AlertStatus = 'error' | 'success' | 'warning' | 'info'
```

```ts
export type AlertAppearance = 'subtle' | 'solid' | 'outline' | 'transparent'
```
