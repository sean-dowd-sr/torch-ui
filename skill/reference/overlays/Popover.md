# Popover

**Category:** overlays
**Import:** `@torch-ui/solid/overlays`
**Source:** `src/components/overlays/Popover.tsx`
**Pattern:** Compound component (use `Popover.SubComponent`)

## Exports

```ts
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverAnchor,
  PopoverPortal,
  PopoverContentPrimitive,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  Popover,
  type PopoverSide,
  type PopoverAlign,
  type PopoverPlacement,
  type PopoverRootProps,
  type PopoverContentProps
} from "@torch-ui/solid/overlays";
```

## Props

```ts
export interface PopoverRootProps extends Omit<KobaltePopoverRootProps, 'placement'> {
	/** Horizontal alignment relative to trigger. Use 'end' to right-align panel to trigger. Ignored if placement is set. */
	align?: PopoverAlign
	/** Side of the trigger the panel appears on. Ignored if placement is set. Default 'bottom'. */
	side?: PopoverSide
	/** Override placement. If not provided, derived from side + align. */
	placement?: PopoverPlacement
}
```

```ts
export interface PopoverContentProps extends KobaltePopoverContentProps {
	class?: string
	children?: JSX.Element
}
```

```ts
export type PopoverSide = (typeof SIDES)[number]
```

```ts
export type PopoverAlign = (typeof ALIGNMENTS)[number]
type NonCenterAlign = Exclude<PopoverAlign, 'center'>
type DerivedPlacement = PopoverSide | `${PopoverSide}-${NonCenterAlign}`
```

```ts
export type PopoverPlacement = DerivedPlacement
```
