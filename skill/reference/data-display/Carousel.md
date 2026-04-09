# Carousel

**Category:** data-display
**Import:** `@torch-ui/solid/data-display`
**Source:** `src/components/data-display/Carousel.tsx`

## Exports

```ts
import {
  Carousel,
  type CarouselSlide,
  type CarouselProps
} from "@torch-ui/solid/data-display";
```

## Props

```ts
export interface CarouselProps extends JSX.HTMLAttributes<HTMLDivElement> {
	slides: CarouselSlide[]
	/** Auto-advance interval in ms (cycle time); 0 to disable */
	autoPlayInterval?: number
	/** Show dot indicators below the carousel. Default true; set false to hide. */
	showDots?: boolean
	/** Show prev/next arrow buttons. Default false; set showArrows or showArrows={true} to enable. */
	showArrows?: boolean
	/** Dot indicators alignment: start, center, or end. Default start. */
	dotsPosition?: 'start' | 'center' | 'end'
	/** Dot color scheme: 'light' (white dots, for dark/colored backgrounds) or 'dark' (ink dots, for light backgrounds). Default 'light'. */
	dotsVariant?: 'light' | 'dark'
	/** Optional Tailwind class(es) applied as a background strip behind the dots row (e.g. 'bg-primary-500'). Forces white dots when set. */
	dotsBgClass?: string
	/** When true, renders dots absolutely positioned over the bottom of the slide (instead of below it). Slide content should add bottom padding to avoid overlap. */
	dotsOverlay?: boolean
	/** Custom color for the progress bar (e.g. '#3b82f6', 'var(--color-primary-500)', or 'bg-primary-500'). When set, overrides the default progress bar color. */
	progressBarColor?: string
	/** Accessible label for the carousel region. */
	'aria-label'?: string
}
```

```ts
export interface CarouselSlide {
	id: string
	content: JSX.Element
}
```
