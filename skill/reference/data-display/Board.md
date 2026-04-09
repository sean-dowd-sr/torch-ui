# Board

**Category:** data-display
**Import:** `@torch-ui/solid/data-display`
**Source:** `src/components/data-display/Board.tsx`
**Pattern:** Compound component (use `Board.SubComponent`)

## Exports

```ts
import {
  Board,
  type BoardMoveEvent,
  type BoardProps,
  type BoardColumnProps,
  type BoardCardProps
} from "@torch-ui/solid/data-display";
```

## Props

```ts
export interface BoardProps {
	/** Called when a card is dropped (cross-column move or same-column reorder). */
	onCardMove?: (event: BoardMoveEvent) => void
	class?: string
	children?: JSX.Element
}
```

```ts
export interface BoardColumnProps {
	/** Unique identifier for this column — used in `BoardMoveEvent`. */
	id: string
	title: string
	/** Badge count shown in the column header. */
	count?: number
	/** CSS color value for the indicator dot. */
	color?: string
	class?: string
	children?: JSX.Element
}
```

```ts
export interface BoardCardProps {
	/** Unique identifier for this card — used in `BoardMoveEvent`. */
	id: string
	/** Prevents drag interaction when true. */
	disabled?: boolean
	class?: string
	children?: JSX.Element
}
```

```ts
export interface BoardMoveEvent {
	/** ID of the card that was moved. */
	cardId: string
	/** Column the card came from. */
	fromColumnId: string
	/** Column the card was dropped onto. */
	toColumnId: string
	/**
	 * The card the dragged card was dropped near.
	 * Null means dropped at the end of the column with no adjacent card.
	 */
	nearCardId: string | null
	/** Whether the card was dropped before or after `nearCardId`. */
	nearPosition: 'before' | 'after' | null
}
```
