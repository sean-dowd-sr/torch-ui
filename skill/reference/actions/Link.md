# Link

**Category:** actions
**Import:** `@torch-ui/solid/actions`
**Source:** `src/components/actions/Link.tsx`

## Exports

```ts
import {
  Link,
  type LinkVariant,
  type LinkProps
} from "@torch-ui/solid/actions";
```

## Props

```ts
export interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
	/** Visual style. Default: "primary" */
	variant?: LinkVariant
	children?: JSX.Element
	/** Icon rendered before the text. */
	iconStart?: JSX.Element
	/** Icon rendered after the text. */
	iconEnd?: JSX.Element
}
```

```ts
export type LinkVariant = 'primary' | 'muted'
```
