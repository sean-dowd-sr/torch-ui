# TreeView

**Category:** data-display
**Import:** `@torch-ui/solid/data-display`
**Source:** `src/components/data-display/TreeView.tsx`

## Exports

```ts
import {
  TreeView,
  type TreeNode,
  type TreeViewProps
} from "@torch-ui/solid/data-display";
```

## Props

```ts
export interface TreeViewProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> {
	/** Tree data */
	nodes: TreeNode[]
	/** Controlled selected node id */
	selected?: string
	/** Callback when a node is selected */
	onSelect?: (id: string) => void
	/** Default selected node id (uncontrolled) */
	defaultSelected?: string
	/** Controlled expanded node ids */
	expanded?: string[]
	/** Callback when expanded state changes */
	onExpandedChange?: (ids: string[]) => void
	/** Default expanded ids (uncontrolled) */
	defaultExpanded?: string[]
	/** Pixels of indentation per level. Default: 16. */
	indent?: number
	/** Show connecting lines between nodes. Default: true. */
	showLines?: boolean
}
```

```ts
export interface TreeNode {
	/** Unique identifier */
	id: string
	/** Display label */
	label: JSX.Element
	/** Optional icon shown before the label */
	icon?: JSX.Element
	/** Child nodes */
	children?: TreeNode[]
	/** Prevents selection and interaction */
	disabled?: boolean
}
```
