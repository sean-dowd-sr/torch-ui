# ReorderableList

**Category:** forms
**Import:** `@torch-ui/solid/forms`
**Source:** `src/components/forms/ReorderableList.tsx`

## Exports

```ts
import {
  ReorderableList,
  type ReorderableListItem,
  type ReorderableListProps
} from "@torch-ui/solid/forms";
```

## Props

```ts
export interface ReorderableListProps extends JSX.HTMLAttributes<HTMLDivElement> {

  items: ReorderableListItem[]

  onReorder: (ids: string[]) => void

  showMoveButtons?: boolean

  onRemove?: (id: string) => void

  class?: string

}
```

```ts
export interface ReorderableListItem {

  id: string

  label: string

}
```
