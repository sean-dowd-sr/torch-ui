# ViewCustomizer

**Category:** navigation
**Import:** `@torch-ui/solid/navigation`
**Source:** `src/components/navigation/ViewCustomizer.tsx`

## Exports

```ts
import {
  ViewCustomizer,
  type ViewCustomizerColumn,
  type ViewCustomizerProps
} from "@torch-ui/solid/navigation";
```

## Props

```ts
export interface ViewCustomizerProps {
	viewName: string
	onViewNameChange: (name: string) => void
	columns: ViewCustomizerColumn[]
	onColumnsChange: (columns: ViewCustomizerColumn[]) => void
	/** Full pool of available columns — enables the Add column picker. */
	allColumns?: ViewCustomizerColumn[]
	onSave: () => void
	onCancel: () => void
	saveLabel?: string
	cancelLabel?: string
}
```

```ts
export interface ViewCustomizerColumn {
	id: string
	label: string
	visible: boolean
	required?: boolean
}
```
