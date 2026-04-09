# WizardStep

**Category:** layout
**Import:** `@torch-ui/solid/layout`
**Source:** `src/components/layout/WizardStep.tsx`

## Exports

```ts
import {
  WizardStep,
  type WizardStepProps
} from "@torch-ui/solid/layout";
```

## Props

```ts
export interface WizardStepProps {
	/** Step number (1-based) for display */
	stepNumber?: number
	/** Step title */
	title: string
	/** Optional description below title */
	description?: string
	/** Optional class for the wrapper */
	class?: string
	children: JSX.Element
}
```
