# VerticalWizard

**Category:** layout
**Import:** `@torch-ui/solid/layout`
**Source:** `src/components/layout/VerticalWizard.tsx`

## Exports

```ts
import {
  VerticalWizard,
  type VerticalWizardProps
} from "@torch-ui/solid/layout";
```

## Props

```ts
export interface VerticalWizardProps {
	/** Current step (1-based) */
	step: number
	/** Label for each step */
	stepLabels: string[]
	/** Visual style: default or compact. Default: default. */
	variant?: WizardStepperVariant
	/** Width of the stepper sidebar. Default: md (w-48 / 192 px). */
	sidebarWidth?: 'sm' | 'md' | 'lg'
	/** Gap between sidebar and content. Default: md. */
	gap?: 'sm' | 'md' | 'lg' | 'xl'
	/** Optional class for the root wrapper */
	class?: string
	/** Optional class override for the sidebar panel */
	sidebarClass?: string
	/** Optional class override for the content panel */
	contentClass?: string
	/** Active step content */
	children: JSX.Element
}
```
