# Banner

**Category:** feedback
**Import:** `@torch-ui/solid/feedback`
**Source:** `src/components/feedback/Banner.tsx`

## Exports

```ts
import {
  Banner,
  type BannerStatus,
  type BannerAppearance,
  type BannerProps
} from "@torch-ui/solid/feedback";
```

## Props

```ts
export interface BannerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Semantic status. Default: info. */
	status?: BannerStatus
	/** Visual style: solid (default) or subtle. */
	appearance?: BannerAppearance
	/** Optional icon shown at the start. */
	icon?: JSX.Element
	/** Optional call-to-action (e.g. a link or small Button) rendered after the message. */
	action?: JSX.Element
	/** When true, shows a dismiss button and calls onClose on click. */
	closeable?: boolean
	/** Called when the dismiss button is clicked. Required when closeable is true. */
	onClose?: () => void
	/** Make the banner sticky to the top or bottom of its scroll container. */
	sticky?: 'top' | 'bottom'
	/** Override default status colors with custom Tailwind classes. */
	colorClass?: string
	class?: string
	children?: JSX.Element
}
```

```ts
export type BannerStatus = 'primary' | 'info' | 'success' | 'warning' | 'error'
```

```ts
export type BannerAppearance = 'solid' | 'subtle'
```
