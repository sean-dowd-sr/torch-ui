# PromptWithAction

**Category:** layout
**Import:** `@torch-ui/solid/layout`
**Source:** `src/components/layout/PromptWithAction.tsx`

## Exports

```ts
import {
  PromptWithAction,
  type PromptWithActionProps,
  type PromptWithActionLinkProps,
  type PromptWithActionButtonProps,
  type PromptWithActionAllProps
} from "@torch-ui/solid/layout";
```

## Props

```ts
export interface PromptWithActionProps {
	/** Leading text (e.g. "Don't have an account?") */
	prompt: string
	/** Link or button label (e.g. "Sign up") */
	actionLabel: JSX.Element
	/** Optional class for the wrapper */
	class?: string
	/** Optional class for the action link/button (e.g. primary link styling) */
	actionClass?: string
}
```

```ts
export interface PromptWithActionLinkProps extends PromptWithActionProps {
	/** Render as link with href */
	href: string
	onClick?: never
}
```

```ts
export interface PromptWithActionButtonProps extends PromptWithActionProps {
	/** Render as button with click handler */
	onClick: () => void
	href?: never
}
```

```ts
export type PromptWithActionAllProps = PromptWithActionLinkProps | PromptWithActionButtonProps
```
