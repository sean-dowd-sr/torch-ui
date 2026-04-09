# Image

**Category:** data-display
**Import:** `@torch-ui/solid/data-display`
**Source:** `src/components/data-display/Image.tsx`

## Exports

```ts
import {
  Image,
  type ImageProps
} from "@torch-ui/solid/data-display";
```

## Props

```ts
export interface ImageProps extends Omit<JSX.ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
	/** Image source URL */
	src: string
	/** Alternative text for accessibility */
	alt: string
	/** Fallback source to try if main src fails */
	fallbackSrc?: string
	/** Show loading skeleton while image loads */
	showSkeleton?: boolean
	/** Custom fallback content (overrides skeleton) */
	fallback?: JSX.Element
	/** Delay before showing fallback to avoid flash */
	fallbackDelay?: number
	/** Aspect ratio class (e.g. 'aspect-square', 'aspect-video') */
	aspectRatio?: string
	/** Object fit class */
	objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
	/** Intuitive scaling aliases - easier to remember than objectFit */
	scale?: 'contain' | 'cover' | 'stretch' | 'none' | 'scale-down' | 'portrait' | 'landscape' | 'square'
	/** Smart scaling constraints */
	scalingConstraints?: {
		/** Maximum width the image should scale to */
		maxWidth?: string
		/** Maximum height the image should scale to */
		maxHeight?: string
	}
	/** Object position class */
	objectPosition?: string
	/** Border radius class */
	rounded?: string
	/** Whether to lazy load the image */
	lazy?: boolean
	/** Content to overlay on top of the image */
	overlay?: JSX.Element
	/** Overlay position class */
	overlayPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'full'
	/** Show overlay on hover only */
	overlayOnHover?: boolean
	/** Callback when image loads successfully */
	onLoad?: () => void
	/** Callback when image fails to load */
	onError?: () => void
}
```
