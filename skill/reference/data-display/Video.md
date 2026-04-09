# Video

**Category:** data-display
**Import:** `@torch-ui/solid/data-display`
**Source:** `src/components/data-display/Video.tsx`

## Exports

```ts
import {
  Video,
  type VideoProps
} from "@torch-ui/solid/data-display";
```

## Props

```ts
export interface VideoProps {
	/** Video source URL */
	src: string
	/** Poster image URL shown before playback */
	poster?: string
	/** Show native browser controls. Default: true */
	controls?: boolean
	/** Autoplay the video. Default: false. Note: forces muted=true to satisfy browser autoplay policy. */
	autoplay?: boolean
	/** Mute the video. Default: false */
	muted?: boolean
	/** Loop the video. Default: false */
	loop?: boolean
	/** CSS aspect-ratio value e.g. '16/9', '4/3', '1/1', '9/16'. Default: '16/9' */
	aspectRatio?: string
	/** Max width of the container (CSS value). Default: '100%' */
	width?: string
	/** Max height of the container (CSS value). Rarely needed with aspect-ratio. */
	height?: string
	/** Fallback content to render when the video fails to load */
	fallback?: JSX.Element
	/** Preload strategy. Default: 'metadata' */
	preload?: 'none' | 'metadata' | 'auto'
	/** Whether the video fills its container. Default: true */
	fluid?: boolean
	class?: string
	/** Forwarded to the <video> element */
	videoClass?: string
}
```
