# Sidebar

**Category:** navigation
**Import:** `@torch-ui/solid/navigation`
**Source:** `src/components/navigation/Sidebar.tsx`

## Exports

```ts
import {
  Sidebar,
  type SidebarItem,
  type SidebarGroup,
  type SidebarFooter,
  type SidebarProps
} from "@torch-ui/solid/navigation";
```

## Props

```ts
export interface SidebarProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {

	/** Optional JSX rendered at the very top of the sidebar, above the title and nav. */

	header?: JSX.Element

	/** Flat navigation items. Use `items` or `groups`, not both. */

	items?: SidebarItem[]

	/** Grouped navigation. Groups are static section headers by default; set collapsible on a group to make it togglable. */

	groups?: SidebarGroup[]

	/** Router-aware link component (e.g. `A` from @solidjs/router). Falls back to `<a>`. */

	linkComponent?: Component<any>

	title?: string

	showTitle?: boolean

	collapsible?: boolean

	collapsed?: boolean

	onCollapseChange?: (collapsed: boolean) => void

	showIcons?: boolean

	showBadges?: boolean

	footer?: JSX.Element | SidebarFooter

	variant?: 'default' | 'minimal' | 'padded'

}
```
