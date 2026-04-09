# HoverCard

**Category:** overlays
**Import:** `@torch-ui/solid/overlays`
**Source:** `src/components/overlays/HoverCard.tsx`
**Pattern:** Compound component (use `HoverCard.SubComponent`)

## Exports

```ts
import {
  HoverCardRoot,
  HoverCardTrigger,
  HoverCardPortal,
  HoverCardArrow,
  HoverCardContent,
  HoverCardHeader,
  HoverCardBody,
  HoverCardFooter,
  HoverCardSeparator,
  HoverCard,
  type HoverCardSide,
  type HoverCardAlign,
  type HoverCardPlacement,
  type HoverCardRootProps,
  type HoverCardContentProps
} from "@torch-ui/solid/overlays";
```

## Props

```ts
export interface HoverCardRootProps extends Omit<KobalteHoverCardRootProps, 'placement'> {
	/** Side of the trigger the card appears on. Default 'bottom'. */
	side?: HoverCardSide
	/** Alignment relative to the trigger. Default 'center'. */
	align?: HoverCardAlign
	/** Override placement directly. If not provided, derived from side + align. */
	placement?: HoverCardPlacement
}
```

```ts
export interface HoverCardContentProps extends KobalteHoverCardContentProps {
	class?: string
	children?: JSX.Element
	/** Show an arrow pointing to the trigger. Default true. */
	showArrow?: boolean
}
```

```ts
export type HoverCardSide = (typeof SIDES)[number]
```

```ts
export type HoverCardAlign = (typeof ALIGNMENTS)[number]
type NonCenterAlign = Exclude<HoverCardAlign, 'center'>
type DerivedPlacement = HoverCardSide | `${HoverCardSide}-${NonCenterAlign}`
```

```ts
export type HoverCardPlacement = DerivedPlacement
```
