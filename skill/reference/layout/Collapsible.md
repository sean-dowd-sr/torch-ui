# Collapsible

**Category:** layout
**Import:** `@torch-ui/solid/layout`
**Source:** `src/components/layout/Collapsible.tsx`
**Pattern:** Compound component (use `Collapsible.SubComponent`)

## Exports

```ts
import {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleContentStyled,
  CollapsibleTriggerStyled,
  Collapsible,
  type CollapsibleStyledVariant,
  type CollapsibleContentProps,
  type CollapsibleTriggerStyledProps
} from "@torch-ui/solid/layout";
```

## Props

```ts
export interface CollapsibleContentProps extends KobalteCollapsibleContentProps {
	variant?: CollapsibleStyledVariant
	class?: string
	children?: JSX.Element
}
```

```ts
export interface CollapsibleTriggerStyledProps extends KobalteCollapsibleTriggerProps {
	variant?: CollapsibleStyledVariant
	class?: string
	children?: JSX.Element
}
```

```ts
export type CollapsibleStyledVariant = 'default' | 'minimal'
```
