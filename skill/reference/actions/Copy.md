# Copy

**Category:** actions
**Import:** `@torch-ui/solid/actions`
**Source:** `src/components/actions/Copy.tsx`

## Exports

```ts
import {
  Copy,
  type CopyDisplay,
  type CopyProps
} from "@torch-ui/solid/actions";
```

## Props

```ts
export interface CopyProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'href' | 'target' | 'rel'> {
	/** Text to copy to clipboard. */
	text: string
	/** How to show the button: "Copy" only, icon + "Copy", or icon only. */
	display?: CopyDisplay
	/** Label when not copied. Default: "Copy" */
	label?: string
	/** Label after copy. Default: "Copied" */
	copiedLabel?: string
	/** Button visual variant. Default: outlined */
	variant?: ButtonVariant
	size?: ComponentSize
	class?: string
	/** Called after successful copy. */
	onCopied?: () => void
}
```

```ts
export type CopyDisplay = 'text' | 'icon-and-text' | 'icon-only'
```
