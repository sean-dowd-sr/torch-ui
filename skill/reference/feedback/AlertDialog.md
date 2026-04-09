# AlertDialog

**Category:** feedback
**Import:** `@torch-ui/solid/feedback`
**Source:** `src/components/feedback/AlertDialog.tsx`

## Exports

```ts
import {
  AlertDialog,
  type AlertDialogProps
} from "@torch-ui/solid/feedback";
```

## Props

```ts
export interface AlertDialogProps extends Omit<KobalteAlertDialogRootProps, 'open' | 'onOpenChange'> {
	/** Whether the dialog is open */
	open: boolean
	/** Called when open state changes */
	onOpenChange?: (open: boolean) => void
	/** Dialog title */
	title: string
	/** Dialog description */
	description?: JSX.Element
	/** Label for the confirm/action button */
	confirmLabel?: string
	/** Label for the cancel button */
	cancelLabel?: string
	/** Called when user confirms. If it returns a Promise, the dialog stays open until resolved. */
	onConfirm?: () => void | Promise<void>
	/** Called when user cancels */
	onCancel?: () => void
	/** When true, confirm button uses destructive (red) styling */
	destructive?: boolean
	/** Additional class for the content panel */
	class?: string
	/** Additional class for the overlay */
	overlayClass?: string
}
```
