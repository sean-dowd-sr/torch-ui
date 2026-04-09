# Icon

**Category:** typography
**Import:** `@torch-ui/solid/typography`
**Source:** `src/components/typography/Icon.tsx`

## Exports

```ts
import {
  Icon,
  type IconProps
} from "@torch-ui/solid/typography";
```

## Props

```ts
export interface IconProps extends Omit<JSX.ImgHTMLAttributes<HTMLImageElement>, 'children' | 'width' | 'height'> {
	/** Image URL (local path or CDN). */
	src: string
	/** Size in pixels (sets both width and height). Default: 16. */
	size?: number
}
```
