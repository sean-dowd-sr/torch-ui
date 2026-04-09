# Section

**Category:** layout
**Import:** `@torch-ui/solid/layout`
**Source:** `src/components/layout/Section.tsx`

## Exports

```ts
import {
  Section,
  type SectionProps
} from "@torch-ui/solid/layout";
```

## Props

```ts
export interface SectionProps extends Omit<JSX.HTMLAttributes<HTMLElement>, 'children'> {
	/** Section title (e.g. h2) */
	title?: string
	/** Optional description below title */
	description?: string
	/** Optional description as JSX */
	descriptionContent?: JSX.Element
	/** Optional id for the section element (for anchor links / "On this page" TOC). */
	id?: string
	/** Optional class for the section wrapper */
	class?: string
	/** Optional class for the title */
	titleClass?: string
	/** Optional class for the description paragraph */
	descriptionClass?: string
	children: JSX.Element
}
```
