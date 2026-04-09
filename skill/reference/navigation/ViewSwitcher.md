# ViewSwitcher

**Category:** navigation
**Import:** `@torch-ui/solid/navigation`
**Source:** `src/components/navigation/ViewSwitcher.tsx`

## Exports

```ts
import {
  ViewSwitcher,
  type ViewScope,
  type ViewSwitcherItem,
  type ViewSwitcherProps
} from "@torch-ui/solid/navigation";
```

## Props

```ts
export interface ViewSwitcherProps {
	views: ViewSwitcherItem[]
	activeId: string
	onValueChange: (id: string) => void
	onAdd?: () => void
	addIcon?: JSX.Element
	maxVisible?: number
	moreLabel?: string
	variant?: 'standalone' | 'embedded'
	/** Accessible label for the view switcher group. Default: "Views". */
	ariaLabel?: string
	class?: string
}
```

```ts
export type ViewScope = 'user' | 'tenant'
```

```ts
export interface ViewSwitcherItem {
	id: string
	label: string
	count?: number
	scope?: ViewScope
	pinned?: boolean
}
```
