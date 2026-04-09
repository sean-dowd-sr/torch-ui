# Card

**Category:** layout
**Import:** `@torch-ui/solid/layout`
**Source:** `src/components/layout/Card.tsx`
**Pattern:** Compound component (use `Card.SubComponent`)

## Exports

```ts
import {
  CardHeader,
  CardImage,
  CardAvatarTitle,
  CardContent,
  CardBody,
  Card,
  type CardVariant,
  type CardProps,
  type CardComponent,
  type CardHeaderProps,
  type CardImageProps,
  type CardAvatarTitleProps,
  type CardContentProps,
  type CardBodyProps
} from "@torch-ui/solid/layout";
```

## Props

```ts
export interface CardProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	children: JSX.Element
	/** Horizontal layout: image (or first block) on the left, content on the right. Use with Card.Image (horizontal) + Card.Content. */
	horizontal?: boolean
	/** Visual style: default (border + bg + shadow), or flat (border + bg, no shadow). */
	variant?: CardVariant
}
```

```ts
export interface CardHeaderProps {
	title: string
	/** Optional action (e.g. button) on the right. */
	action?: JSX.Element
	/** Heading element to render. Default 'h3'. Use to maintain proper document outline in different contexts. */
	as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
	class?: string
}
```

```ts
export interface CardImageProps {
	src: string
	alt: string
	/** Use for horizontal cards so the image has a fixed width and doesn't stretch. */
	horizontal?: boolean
	class?: string
	imgClass?: string
}
```

```ts
export interface CardAvatarTitleProps {
	/** Display name shown next to the avatar. */
	name: string
	/** Optional image URL for the avatar. */
	imageUrl?: string | null
	/** Avatar size. */
	avatarSize?: 'sm' | 'md'
	/** Show skeleton shimmer instead of avatar and name. */
	loading?: boolean
	class?: string
}
```

```ts
export interface CardContentProps {
	children: JSX.Element
	/** Use when card is horizontal so this block fills the remaining space. */
	class?: string
}
```

```ts
export interface CardBodyProps {
	children: JSX.Element
	class?: string
}
```

```ts
export type CardVariant = 'default' | 'flat'
```
