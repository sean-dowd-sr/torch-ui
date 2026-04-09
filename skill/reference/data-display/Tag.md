# Tag

**Category:** data-display
**Import:** `@torch-ui/solid/data-display`
**Source:** `src/components/data-display/Tag.tsx`

## Exports

```ts
import {
  Tag,
  type TagVariant,
  type TagStyle,
  type TagSize,
  type TagProps
} from "@torch-ui/solid/data-display";
```

## Props

```ts
export interface TagProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'color'> {
	/** Semantic color variant. Ignored when color is set. Default: neutral. */
	variant?: TagVariant
	/** Tag size. Default: md. */
	size?: TagSize
	/** Visual style: default (light background) or solid (surface background). Default: default. */
	visualStyle?: TagStyle
	/** CSS color for a status indicator dot before children (e.g. "#22c55e"). */
	statusColor?: string
	/** Accessible label for the status dot (e.g. "Active"). Rendered as sr-only text. When omitted, the dot is purely decorative. */
	statusLabel?: string
	/** Arbitrary CSS color for a fully custom tag. Sets bg (10% opacity), border (25% opacity), and text color. Overrides variant. */
	color?: string
	/** Icon rendered before the label. */
	iconStart?: JSX.Element
	/** Icon rendered after the label. */
	iconEnd?: JSX.Element
}
```

```ts
export type TagVariant =
	| 'neutral'
	| 'primary'
	| 'success'
	| 'warning'
	| 'danger'
	| 'info'
```

```ts
export type TagStyle = 'default' | 'solid'
```

```ts
export type TagSize = 'sm' | 'md' | 'lg' | 'xl'
```
