# FilterBuilder

**Category:** forms
**Import:** `@torch-ui/solid/forms`
**Source:** `src/components/forms/FilterBuilder.tsx`

## Exports

```ts
import {
  newGroup,
  newRule,
  filterGroupToExpression,
  FilterBuilder,
  type FieldType,
  type FilterField,
  type FilterOperator,
  type FilterLogic,
  type FilterRule,
  type FilterGroup,
  type FilterBuilderProps
} from "@torch-ui/solid/forms";
```

## Props

```ts
export interface FilterBuilderProps {
	fields: FilterField[]
	getOperators: (field: FilterField | undefined) => FilterOperator[]
	value: FilterGroup
	onValueChange: (group: FilterGroup) => void
}
```

```ts
export type FilterLogic = 'and' | 'or'
```

```ts
export type FieldType = 'text' | 'select'
```

```ts
export interface FilterField {
	id: string
	label: string
	type: FieldType
	options?: { value: string; label: string }[]
}
```

```ts
export interface FilterOperator {
	value: string
	label: string
}
```

```ts
export interface FilterRule {
	type: 'rule'
	id: string
	fieldId: string
	operator: string
	value: string
}
```

```ts
export interface FilterGroup {
	type: 'group'
	id: string
	logic: FilterLogic
	items: (FilterRule | FilterGroup)[]
}
```
