# CodeBlock

**Category:** layout
**Import:** `@torch-ui/solid/layout`
**Source:** `src/components/layout/CodeBlock.tsx`

## Exports

```ts
import {
  CodeBlock,
  type CodeBlockLanguage,
  type CodeBlockProps
} from "@torch-ui/solid/layout";
```

## Props

```ts
export interface CodeBlockProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Code content (single block). When used, language applies. */
	content?: string
	/** Alternate content (e.g. component-only snippet). When set, a toggle in the header switches between content and alternateContent. */
	alternateContent?: string
	/** Language identifier passed to the highlighter (e.g. "tsx", "bash"). No-op when no highlighter is provided. */
	language?: string
	/** Multiple language variants with a tab switcher. When set, content/language are ignored for initial display. */
	languages?: CodeBlockLanguage[]
	/** Optional filename or title shown in the header (e.g. "Table.jsx"). */
	filename?: string
	/** Optional label in the header (e.g. "Embed Code"). Shown with or instead of filename. */
	label?: string
	/** Optional icon or image (e.g. SVG) shown to the left of the filename/label in the header. */
	headerIcon?: JSX.Element
	/** Show line numbers. */
	showLineNumbers?: boolean
	/** Line numbers to highlight (e.g. [2, 3, 5]). */
	highlightLines?: number[]
	/** When true, force dark appearance regardless of app theme. When undefined, follow app light/dark (e.g. .dark on root). */
	dark?: boolean
	/** Use primary (brand) background. Overrides dark. */
	primary?: boolean
	/** Minimum height (e.g. "min-h-[120px]"). Default none (min-h-0) so short snippets don't reserve extra space. */
	minHeight?: string
	/** When true, code is in a collapsible section with a "Show code" / "Hide code" trigger. */
	collapsible?: boolean
	/** When collapsible, whether the code is open by default. Default false. */
	defaultCodeOpen?: boolean
	/**
	 * Embedded mode for placing the CodeBlock inside another surface (e.g. Card).
	 * Removes the outer border/radius and uses a flat trigger.
	 */
	embedded?: boolean
	/** Label for the trigger when code is hidden. Default "Show code". */
	collapsibleLabelShow?: string
	/** Label for the trigger when code is visible. Default "Hide code". */
	collapsibleLabelHide?: string
	/**
	 * Optional syntax highlighter. Called with `(code, language)`, must return highlighted HTML or a Promise.
	 * When omitted, code is rendered as plain text.
	 * Example (Prism): `(code, lang) => highlightCode(code, lang)` where highlightCode loads grammars on demand.
	 */
	highlighter?: (code: string, language: string) => string | Promise<string>
	class?: string
	preProps?: JSX.HTMLAttributes<HTMLPreElement>
}
```

```ts
export interface CodeBlockLanguage {
	/** Unique id for the tab (e.g. "js", "ts"). */
	id: string
	/** Tab label (e.g. "JavaScript", "TypeScript"). */
	label: string
	/** Code content for this variant. */
	content: string
	/** Language identifier passed to the highlighter. Defaults to id. */
	language?: string
	/** Optional icon (e.g. SVG). Pass a function to show the icon in both the trigger and the list (e.g. `() => <Icon name="JS" />`); a static element can only appear in one place. */
	icon?: JSX.Element | (() => JSX.Element)
}
```
