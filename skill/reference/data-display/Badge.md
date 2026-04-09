# Badge

**Category:** data-display
**Import:** `@torch-ui/solid/data-display`
**Source:** `src/components/data-display/Badge.tsx`

## Exports

```ts
import {
  Badge,
  type BadgeVariant,
  type BadgeSize,
  type BadgeProps
} from "@torch-ui/solid/data-display";
```

## Props

```ts
export interface BadgeProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'children'> {
	/** Color variant. Default: neutral. */
	variant?: BadgeVariant
	/** Badge size; scales dot and pill. Default: md. */
	size?: BadgeSize
	/** Optional icon shown inside the badge. Use for icon-only badge. */
	icon?: JSX.Element
	/** Optional count or label shown inside the badge (e.g. "3"). When omitted and no icon, renders as a dot only. */
	children?: JSX.Element
	/** When true (default), badge is hidden from assistive tech. Set false for meaningful status/count badges. */
	decorative?: boolean
}
```

```ts
export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
```

```ts
export type BadgeSize = 'sm' | 'md' | 'lg'
```
