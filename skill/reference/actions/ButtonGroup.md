# ButtonGroup

**Category:** actions
**Import:** `@torch-ui/solid/actions`
**Source:** `src/components/actions/ButtonGroup.tsx`
**Pattern:** Compound component (use `ButtonGroup.SubComponent`)

## Exports

```ts
import {
  ButtonGroupRoot,
  ButtonGroupMain,
  ButtonGroupMenu,
  ButtonGroup,
  type ToggleGroupOption,
  type ButtonGroupProps,
  type ButtonGroupMenuSlot,
  type ButtonGroupMainProps,
  type ButtonGroupMenuProps
} from "@torch-ui/solid/actions";
```

## Props

```ts
export type ButtonGroupProps =
	| (ButtonGroupPropsBase & { multiple?: false; value?: string; onValueChange?: (value: string) => void })
	| (ButtonGroupPropsBase & { multiple: true; value?: string[]; onValueChange?: (value: string[]) => void })
```

```ts
export interface ButtonGroupMainProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Override the variant inherited from ButtonGroup. */
	variant?: ButtonVariant
	/** Override the size inherited from ButtonGroup. */
	size?: ComponentSize
	class?: string
	children?: JSX.Element
}
```

```ts
export interface ButtonGroupMenuProps {
	/** Dropdown content rendered when the split trigger is clicked. Accepts JSX or a render function. */
	children?: JSX.Element | (() => JSX.Element)
}
```

```ts
export interface ToggleGroupOption {
	/** Value passed to `onChange` when this option is selected. */
	value: string
	/** Display text rendered inside the toggle item. */
	label: string
}
```

```ts
export interface ButtonGroupMenuSlot {
	[BUTTON_GROUP_MENU_SYMBOL]: true
	render: () => JSX.Element
}
```
