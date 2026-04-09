# Kbd

**Category:** data-display
**Import:** `@torch-ui/solid/data-display`
**Source:** `src/components/data-display/Kbd.tsx`

## Exports

```ts
import {
  KEY,
  Kbd,
  KbdShortcut,
  type KbdVariant,
  type KbdSize,
  type KbdProps,
  type KbdShortcutProps
} from "@torch-ui/solid/data-display";
```

## Props

```ts
export interface KbdProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Visual style. default = raised key with bottom border; flat = simple outlined. Default: default. */
	variant?: KbdVariant
	/** Size. Default: md. */
	size?: KbdSize
	children?: JSX.Element
}
```

```ts
export interface KbdShortcutProps {
	/** Ordered list of key labels to display (e.g. [KEY.Cmd, 'K']). */
	keys: string[]
	/** Passed to each Kbd. Default: default. */
	variant?: KbdVariant
	/** Passed to each Kbd. Default: md. */
	size?: KbdSize
	/** Separator rendered between keys. Default: '+'. */
	separator?: string
	class?: string
}
```

```ts
export type KbdVariant = 'default' | 'flat'
```

```ts
export type KbdSize = 'sm' | 'md' | 'lg'
```
