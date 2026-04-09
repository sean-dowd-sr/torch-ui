# DropdownMenu

**Category:** navigation
**Import:** `@torch-ui/solid/navigation`
**Source:** `src/components/navigation/DropdownMenu.tsx`
**Pattern:** Compound component (use `DropdownMenu.SubComponent`)

## Exports

```ts
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenu,
  type DropdownMenuContentProps,
  type DropdownMenuItemProps,
  type DropdownMenuSeparatorProps,
  type DropdownMenuTriggerProps
} from "@torch-ui/solid/navigation";
```

## Props

```ts
export interface DropdownMenuContentProps extends KobalteDropdownMenuContentProps {
	class?: string
	children: JSX.Element
}
```

```ts
export interface DropdownMenuItemProps extends KobalteDropdownMenuItemProps {
	class?: string
	children: JSX.Element
}
```

```ts
export interface DropdownMenuSeparatorProps extends KobalteDropdownMenuSeparatorProps {
	class?: string
}
```

```ts
export interface DropdownMenuTriggerProps extends Omit<KobalteDropdownMenuTriggerProps, 'class' | 'children'> {
	class?: string
	children: JSX.Element
}
```
