# SkeletonBlocks

**Category:** feedback
**Import:** `@torch-ui/solid/feedback`
**Source:** `src/components/feedback/SkeletonBlocks.tsx`

## Exports

```ts
import {
  SkeletonCard,
  SkeletonTable,
  SkeletonSection,
  SkeletonHeading,
  SkeletonForm,
  SkeletonNavBlock,
  type SkeletonCardProps,
  type SkeletonTableProps,
  type SkeletonSectionProps,
  type SkeletonHeadingProps,
  type SkeletonFormProps,
  type SkeletonNavBlockProps
} from "@torch-ui/solid/feedback";
```

## Props

```ts
export interface SkeletonCardProps {
	/** Show a header bar (like Card.Header). Default true. */
	header?: boolean
	/** Number of body lines. Default 2. */
	bodyLines?: number
	/** Horizontal layout: image/avatar placeholder on left (like Card horizontal). */
	horizontal?: boolean
	class?: string
}
```

```ts
export interface SkeletonTableProps {
	/** Number of body rows. Default 5. */
	rows?: number
	/** Number of columns (header + each row). Default 4. */
	columns?: number
	class?: string
}
```

```ts
export interface SkeletonSectionProps {
	/** Show a description line under the title. Default true. */
	description?: boolean
	/** Show a content block below (e.g. form or card placeholder). Default true. */
	content?: boolean
	/** Content block lines. Default 3. */
	contentLines?: number
	class?: string
}
```

```ts
export interface SkeletonHeadingProps {
	/** Show description line. Default true. */
	description?: boolean
	class?: string
}
```

```ts
export interface SkeletonFormProps {
	fields?: number
	buttons?: number
	class?: string
}
```

```ts
export interface SkeletonNavBlockProps {
	items?: number
	class?: string
}
```
