# BlockQuote

**Category:** layout
**Import:** `@torch-ui/solid/layout`
**Source:** `src/components/layout/BlockQuote.tsx`

## Exports

```ts
import {
  BlockQuote,
  type BlockQuoteJustify,
  type BlockQuoteProps
} from "@torch-ui/solid/layout";
```

## Props

```ts
export interface BlockQuoteProps {
	/** Quote content (paragraph(s) or text). */
	children: JSX.Element | string
	/** Optional attribution (e.g. "— Author Name"). Rendered in a footer. */
	citation?: string | JSX.Element
	/** Optional cite URL for the blockquote source. Maps to the cite attribute on <blockquote>. */
	cite?: string
	/** Optional icon shown at the start of the quote. */
	icon?: JSX.Element
	/** Optional avatar (e.g. Avatar or img) shown to the left of the quote. */
	avatar?: JSX.Element
	/** Text alignment: start (left), center, or end (right). Default: start. */
	justify?: BlockQuoteJustify
	/** When true, omit the left border. Default: false. */
	noBorder?: boolean
	/** Optional class for the blockquote root. */
	class?: string
}
```

```ts
export type BlockQuoteJustify = 'start' | 'center' | 'end'
```
