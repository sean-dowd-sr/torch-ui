# FormActions

**Category:** layout
**Import:** `@torch-ui/solid/layout`
**Source:** `src/components/layout/FormActions.tsx`

## Exports

```ts
import {
  FormActions,
  type FormActionsProps,
  type FormActionsSubmitProps,
  type FormActionsButtonProps,
  type FormActionsAllProps
} from "@torch-ui/solid/layout";
```

## Props

```ts
export interface FormActionsProps {
	/** Label for the back/secondary button */
	backLabel: string
	onBack: () => void
	/** Label for the primary button */
	primaryLabel: string
	loading?: boolean
	disabled?: boolean
	class?: string
}
```

```ts
export interface FormActionsSubmitProps extends FormActionsProps {
	/** Primary button type */
	primaryType?: 'submit'
}
```

```ts
export interface FormActionsButtonProps extends FormActionsProps {
	/** Primary button type */
	primaryType: 'button'
	/** Handler for primary button click (required when type='button') */
	onPrimary: () => void
}
```

```ts
export type FormActionsAllProps = FormActionsSubmitProps | FormActionsButtonProps
```
