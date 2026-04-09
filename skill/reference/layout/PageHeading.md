# PageHeading

**Category:** layout
**Import:** `@torch-ui/solid/layout`
**Source:** `src/components/layout/PageHeading.tsx`

## Exports

```ts
import {
  PageHeading,
  type PageHeadingProps
} from "@torch-ui/solid/layout";
```

## Props

```ts
export interface PageHeadingProps {
	/** Main heading text */
	title: string
	/** Optional description (plain string) */
	description?: string
	/** Optional description as JSX (e.g. with links or emphasis). Takes precedence over description. */
	descriptionContent?: JSX.Element
	/** Optional class for the description paragraph */
	descriptionClass?: string
	/** Optional class for the wrapper */
	class?: string
	/** Optional class for the heading element */
	titleClass?: string
	/** Heading level: 1 or 2. Default 1. */
	level?: 1 | 2
	/** Semantic heading element to render. Defaults to h1/h2 based on level. */
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}
```
