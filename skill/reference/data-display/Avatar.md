# Avatar

**Category:** data-display
**Import:** `@torch-ui/solid/data-display`
**Source:** `src/components/data-display/Avatar.tsx`

## Exports

```ts
import {
  Avatar,
  type AvatarRing,
  type AvatarBadgePlacement,
  type AvatarProps
} from "@torch-ui/solid/data-display";
```

## Props

```ts
export interface AvatarProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'children'> {
	/** Display name: used for title and for initials. Initials = first letter of first name + first letter of last name (last word = last name, rest = first name). Single word → one letter. */
	name: string
	/** Optional image URL; when set, shows image instead of initials. */
	imageUrl?: string | null
	/** Size: sm = 32px, md = 40px, lg = 48px. */
	size?: SizeKey
	/** Shape: circle (default), rounded (rounded-lg), or square. */
	shape?: AvatarShape
	/** Ring outline around the avatar. true = default ring with offset; or { color?, offset?: boolean } for custom or no-offset (e.g. ring={{ offset: false }} for stack cutout). */
	ring?: AvatarRing
	/** Background and text color when showing initials. Ignored when imageUrl is set. */
	color?: AvatarColor
	/** Optional badge (e.g. Badge) overlaid on a corner. Use badgePlacement to choose which corner (default bottom-right). */
	badge?: JSX.Element
	/** When true, badge receives pointer events (e.g. for clickable status menus). Default false (decorative). */
	badgeInteractive?: boolean
	/** Pass the same size as your Badge so placement is correct. Default: same as avatar size. */
	badgeSize?: SizeKey
	/** Dot = status dot only; content = icon or count badge (larger dimensions). Content uses a larger base offset for proper placement. Default: dot. */
	badgeKind?: 'dot' | 'content'
	/** Where the badge sits on the avatar. Default: bottom-right. */
	badgePlacement?: AvatarBadgePlacement
	/** When true, avatar is purely decorative: aria-hidden, no role/label. Use when visible name text is adjacent (e.g. inside Persona). */
	decorative?: boolean
}
```

```ts
export type AvatarRing = true | { color?: string; /** When false, ring sits on the avatar edge (no gap). Use for stacks. Default true. */ offset?: boolean }
```

```ts
export type AvatarBadgePlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
```
