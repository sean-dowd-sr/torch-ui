# ContextMenu

**Category:** overlays
**Import:** `@torch-ui/solid/overlays`
**Source:** `src/components/overlays/ContextMenu.tsx`
**Pattern:** Compound component (use `ContextMenu.SubComponent`)

## Exports

```ts
import {
  ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenu,
  type ContextMenuContentProps,
  type ContextMenuItemProps,
  type ContextMenuSeparatorProps
} from "@torch-ui/solid/overlays";
```

## Props

```ts
export interface ContextMenuContentProps extends KobalteContextMenuContentProps {
	class?: string
	children?: JSX.Element
}
```

```ts
export interface ContextMenuItemProps extends KobalteContextMenuItemProps {
	class?: string
	children: JSX.Element
}
```

```ts
export interface ContextMenuSeparatorProps extends KobalteContextMenuSeparatorProps {
	class?: string
}
```
