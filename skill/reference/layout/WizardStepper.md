# WizardStepper

**Category:** layout
**Import:** `@torch-ui/solid/layout`
**Source:** `src/components/layout/WizardStepper.tsx`

## Exports

```ts
import {
  WizardStepper,
  Wizard,
  type WizardStepperVariant,
  type WizardStepperProps
} from "@torch-ui/solid/layout";
```

## Props

```ts
export interface WizardStepperProps {
	/** Current step (1-based) */
	step: number
	/** Total number of steps */
	totalSteps: number
	/** Step labels (e.g. ['About you', 'Your company']) */
	stepLabels: string[]
	/** 'horizontal' | 'vertical' */
	orientation?: 'horizontal' | 'vertical'
	/** Visual style: default (circles + line), compact (smaller), or chevrons (chevron separators). Default: default. */
	variant?: WizardStepperVariant
	/** Optional class for the root */
	class?: string
}
```

```ts
export type WizardStepperVariant = 'default' | 'compact' | 'chevrons'
```
