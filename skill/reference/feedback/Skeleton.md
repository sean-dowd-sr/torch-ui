# Skeleton

**Category:** feedback
**Import:** `@torch-ui/solid/feedback`
**Source:** `src/components/feedback/Skeleton.tsx`

## Exports

```ts
import {
  Skeleton,
  type SkeletonProps
} from "@torch-ui/solid/feedback";
```

## Props

```ts
export interface SkeletonProps {
	/** Extra class for the wrapper (or the standalone block). */
	class?: string
	/** Use "full" for circular (e.g. avatar), "lg" for large radius, or omit for default. Matches the wrapped child's shape when you pass the same as the child (e.g. round="full" for rounded-full). */
	round?: 'full' | 'lg' | 'md' | 'sm' | 'none'
	/** Use block layout instead of inline-block. Needed when wrapping children that depend on parent width (w-full, flex-1, %-based). Default: false. */
	block?: boolean
	/** When true, children are revealed directly (loading complete). When false/undefined, shimmer is shown over the children's shape.
	 * Pair with children to wrap real content: <Skeleton loaded={isLoaded} round="full"><Avatar /></Skeleton> */
	loaded?: boolean
	/** Wrap content to take its shape; omit for a standalone block you size with class.
	 * Note: wrap mode works best with intrinsic-size children. For layout-dependent children
	 * (w-full, flex-1, %-widths), set block={true} so the wrapper participates in flow layout.
	 * Skeleton is always aria-hidden — pair with a Loading status region for screen reader announcements. */
	children?: JSX.Element
}
```
