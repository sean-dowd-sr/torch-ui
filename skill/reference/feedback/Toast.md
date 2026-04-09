# Toast

**Category:** feedback
**Import:** `@torch-ui/solid/feedback`
**Source:** `src/components/feedback/Toast.tsx`

## Exports

```ts
import {
  useToast,
  ToastProvider,
  type ToastVariant,
  type ToastAppearance,
  type ToastItem,
  type ToastContextValue,
  type ToastProviderProps
} from "@torch-ui/solid/feedback";
```

## Props

```ts
export interface ToastProviderProps {
	children: JSX.Element
	/** Position of the toast container. Default bottom-right. */
	position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
	/** Default visual style for all toasts. Can be overridden per toast. Default 'subtle'. */
	defaultAppearance?: ToastAppearance
	/** Hotkey to jump to toast region. Default Alt+T. */
	hotkey?: string
	/** Maximum number of toasts shown at once. Oldest is removed when exceeded. Default 5. */
	maxToasts?: number
}
```

```ts
export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'
```

```ts
export type ToastAppearance = 'subtle' | 'solid'
```

```ts
export interface ToastItem {
	id: string
	title?: string
	description?: string
	/** Legacy: for backward compatibility */
	message?: string
	variant?: ToastVariant
	/** Visual style. Default inherited from ToastProvider defaultAppearance, which defaults to 'subtle'. */
	appearance?: ToastAppearance
	/** Auto-dismiss duration in ms. Default 5000. Set to 0 to disable auto-dismiss. */
	duration?: number
	/** Show progress bar for countdown. Default true when duration > 0. */
	showProgress?: boolean
	/** Show the status icon for the variant. Default true. */
	showIcon?: boolean
	/** Optional action label; when set, onAction is called when clicked. */
	actionLabel?: string
	onAction?: () => void
}
```

```ts
export interface ToastContextValue {
	toasts: () => ToastItem[]
	show: (title: string, description?: string, options?: { variant?: ToastVariant; appearance?: ToastAppearance; duration?: number; showProgress?: boolean; showIcon?: boolean; actionLabel?: string; onAction?: () => void }) => string
	dismiss: (id: string) => void
}
```
