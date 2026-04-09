# Form

**Category:** layout
**Import:** `@torch-ui/solid/layout`
**Source:** `src/components/layout/Form.tsx`

## Exports

```ts
import {
  Form,
  type FormProps
} from "@torch-ui/solid/layout";
```

## Props

```ts
export interface FormProps extends Omit<JSX.FormHTMLAttributes<HTMLFormElement>, 'class'> {
	/** Optional class for the form element */
	class?: string
	/** Default size for supported field components inside this form. Individual fields can override with their own size prop. */
	size?: ComponentSize
	/** Form content (fields, sections, actions) */
	children: JSX.Element
	/** Optional form-level validation summary. When set, rendered at the top. Alert component provides alert semantics. Use for listing all field errors. */
	errorSummary?: string[] | JSX.Element
}
```
