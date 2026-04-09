# SearchPalette

**Category:** overlays
**Import:** `@torch-ui/solid/overlays`
**Source:** `src/components/overlays/SearchPalette.tsx`

## Exports

```ts
import {
  SearchPalette,
  type SearchPaletteCategory,
  type SearchPaletteItem,
  type SearchPaletteGroup,
  type SearchPaletteProps
} from "@torch-ui/solid/overlays";
```

## Props

```ts
export interface SearchPaletteProps {
	/** Whether the palette is open. */
	open: boolean
	/** Called when the open state changes. */
	onOpenChange: (open: boolean) => void
	/** Current search query (controlled). */
	query: string
	/** Called when the query changes. */
	onQueryChange: (query: string) => void
	/** Optional category chips for filtering. */
	categories?: SearchPaletteCategory[]
	/** Currently selected category keys. */
	selectedCategories?: string[]
	/** Called when category selection changes. */
	onCategoryChange?: (categories: string[]) => void
	/** Grouped result items to display. */
	groups: SearchPaletteGroup[]
	/** Called when the user selects an item. */
	onSelect: (item: SearchPaletteItem) => void
	/** Input placeholder text. Default: "Search…" */
	placeholder?: string
	/** Text shown when no results match. Default: "No results found." */
	emptyMessage?: string
	/** Category chips label. Default: "I'm Searching…" */
	categoriesLabel?: string
	/** Show keyboard hint bar at the bottom. Default: true. */
	showKeyboardHints?: boolean
	class?: string
}
```

```ts
export interface SearchPaletteCategory {
	key: string
	label: string
	icon?: JSX.Element | (() => JSX.Element)
}
```

```ts
export interface SearchPaletteItem {
	key: string
	label: string
	description?: string
	icon?: JSX.Element | (() => JSX.Element)
	category?: string
	trailing?: JSX.Element | (() => JSX.Element)
}
```

```ts
export interface SearchPaletteGroup {
	title: string
	items: SearchPaletteItem[]
	/** Optional "See all" link at the bottom of the group. */
	seeAll?: { label: string; onClick: () => void }
}
```
