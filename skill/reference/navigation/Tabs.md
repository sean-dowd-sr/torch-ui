# Tabs

**Category:** navigation
**Import:** `@torch-ui/solid/navigation`
**Source:** `src/components/navigation/Tabs.tsx`

## Exports

```ts
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  type TabItem,
  type TabsProps,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentProps
} from "@torch-ui/solid/navigation";
```

## Props

```ts
export interface TabsProps
	extends Omit<KobalteTabsRootProps, 'value' | 'defaultValue' | 'onChange'> {
	tabs: TabItem[]
	/** Current tab id (controlled), or omit and use defaultValue for uncontrolled. */
	value?: string | Accessor<string>
	/** Initial tab id when uncontrolled. */
	defaultValue?: string
	/** Called when selected tab changes. Optional for uncontrolled usage. */
	onValueChange?: (tabId: string) => void
	/** Accessible label for the tab list. Default: "Tabs". */
	ariaLabel?: string
	class?: string
}
```

```ts
export interface TabsListProps extends KobalteTabsListProps {
	class?: string
}
```

```ts
export interface TabsTriggerProps extends KobalteTabsTriggerProps {
	class?: string
}
```

```ts
export interface TabsContentProps extends KobalteTabsContentProps {
	class?: string
}
```

```ts
export interface TabItem {
	id: string
	label: string
}
```
