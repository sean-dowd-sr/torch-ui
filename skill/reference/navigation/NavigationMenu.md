# NavigationMenu

**Category:** navigation
**Import:** `@torch-ui/solid/navigation`
**Source:** `src/components/navigation/NavigationMenu.tsx`
**Pattern:** Compound component (use `MenuBar.SubComponent`)

## Exports

```ts
import {
  MenuBarTrigger,
  MenuBarContent,
  MenuBarItem,
  MenuBarLabel,
  MenuBarDivider,
  MenuBarLink,
  MenuBarMenu,
  MenuBarNavLink,
  MenuBar,
  type MenuBarTriggerProps,
  type MenuBarContentProps,
  type MenuBarItemProps,
  type MenuBarLinkProps,
  type MenuBarProps
} from "@torch-ui/solid/navigation";
```

## Props

```ts
export interface MenuBarTriggerProps {
	class?: string
	children?: JSX.Element
	/** Hide the default chevron icon */
	noChevron?: boolean
	/** Visual style variant */
	variant?: 'default' | 'underline' | 'ghost'
	/** Optional icon element */
	icon?: JSX.Element
	/** Icon placement relative to label */
	iconPosition?: 'start' | 'end' | 'top' | 'bottom'
}
```

```ts
export interface MenuBarContentProps {
	class?: string
	children?: JSX.Element
}
```

```ts
export interface MenuBarItemProps {
	class?: string
	children?: JSX.Element
	/** Leading icon */
	icon?: JSX.Element
	/** Short description text below the label */
	description?: string
	/** Icon placement relative to text */
	iconPosition?: 'start' | 'end' | 'top' | 'bottom'
}
```

```ts
export interface MenuBarLinkProps {
	href: string
	class?: string
	children?: JSX.Element
	icon?: JSX.Element
	description?: string
	active?: boolean
	/** Visual style variant */
	variant?: 'default' | 'underline' | 'ghost'
	/** Icon placement relative to text */
	iconPosition?: 'start' | 'end' | 'top' | 'bottom'
	/**
	 * Disabled state. Sets aria-disabled + tabIndex=-1 and prevents navigation.
	 * Note: plain anchors don't participate in Menubar roving focus — if full
	 * keyboard nav is needed, render via KobalteMenuBar.Item with asChild.
	 */
	disabled?: boolean
}
```

```ts
export interface MenuBarProps {
	class?: string
	children?: JSX.Element
	/** Horizontal alignment of the nav items */
	justify?: 'start' | 'center' | 'end'
}
```
