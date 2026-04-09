# Container

**Category:** layout
**Import:** `@torch-ui/solid/layout`
**Source:** `src/components/layout/Container.tsx`

## Exports

```ts
import {
  Container,
  type ContainerSize,
  type ContainerAlign,
  type ContainerProps
} from "@torch-ui/solid/layout";
```

## Props

```ts
export interface ContainerProps {
	/** Max width of the container; default md. full = no max-width constraint. Ignored when fluid is true. */
	size?: ContainerSize
	/** When true, container stretches to fill the width of its parent (no max-width, no centering). */
	fluid?: boolean
	/** Horizontal alignment within parent when not fluid. Default center. */
	align?: ContainerAlign
	/** Additional class for the wrapper. */
	class?: string
	children?: JSX.Element
}
```

```ts
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
```

```ts
export type ContainerAlign = 'start' | 'center' | 'end'
```
