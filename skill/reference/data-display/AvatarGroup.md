# AvatarGroup

**Category:** data-display
**Import:** `@torch-ui/solid/data-display`
**Source:** `src/components/data-display/AvatarGroup.tsx`

## Exports

```ts
import {
  AvatarGroup,
  type AvatarGroupItem,
  type AvatarStacking,
  type AvatarGroupProps
} from "@torch-ui/solid/data-display";
```

## Props

```ts
export interface AvatarGroupProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** List of avatars to show. When max is set, only this many are shown plus a "+N" overflow. */
	avatars: AvatarGroupItem[]
	/** Max avatars to show before showing "+N". Omit to show all. */
	max?: number
	/** Size passed to each Avatar. */
	size?: SizeKey
	/** Shape passed to each Avatar. */
	shape?: AvatarShape
	/** Overlap amount: sm = tighter stack, md = default, lg = more overlap. */
	overlap?: 'sm' | 'md' | 'lg'
	/** Z-index stacking order for overlapping avatars. Default: last-on-top (DOM-natural). */
	stacking?: AvatarStacking
}
```

```ts
export type AvatarStacking = 'first-on-top' | 'last-on-top'
```

```ts
export interface AvatarGroupItem {
	name: string
	imageUrl?: string | null
}
```
