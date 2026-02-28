import {
	type JSX,
	children,
	createContext,
	createEffect,
	createSignal,
	splitProps,
	useContext,
	For,
} from 'solid-js'
import * as DropdownMenuPrimitive from '@kobalte/core/dropdown-menu'
import { ToggleGroup as KobalteToggleGroup } from '@kobalte/core/toggle-group'
import { ChevronDown } from 'lucide-solid'
import { cn } from '../../utilities/classNames'
import { Button } from './Button'
import type { ButtonProps, ButtonSize, ButtonVariant } from './Button'

export interface ToggleGroupOption {
	/** Value passed to `onChange` when this option is selected. */
	value: string
	/** Display text rendered inside the toggle item. */
	label: string
}

/* open/onOpenChange are Partial<Pick<...>> rather than declared directly so that
   the types stay in sync with Kobalte's DropdownMenuRootProps if the API changes. */
type ButtonGroupPropsBase = Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> &
	Partial<Pick<DropdownMenuPrimitive.DropdownMenuRootProps, 'open' | 'onOpenChange'>> & {
	class?: string
	children?: JSX.Element
	/** Enable split-button mode (main action + dropdown trigger). */
	split?: boolean
	/** Button size inherited by split-mode children. Default: "md" */
	size?: ButtonSize
	/** Button variant inherited by split-mode children. Default: "primary" */
	variant?: ButtonVariant
	/** Use filled-variant child dividers (white/20 instead of ink borders). */
	filled?: boolean
	/** Toggle-group mode: array of selectable options. Requires `value` and `onChange`. */
	options?: ToggleGroupOption[]
	/** Toggle-group layout direction. Default: "horizontal" */
	orientation?: 'horizontal' | 'vertical'
	/** Disable all buttons in the group. */
	disabled?: boolean
	/** Split mode: aria-label for the role="group" wrapper. Default: "Split button" */
	splitButtonAriaLabel?: string
}

export type ButtonGroupProps =
	| (ButtonGroupPropsBase & { multiple?: false; value?: string; onChange?: (value: string) => void })
	| (ButtonGroupPropsBase & { multiple: true; value?: string[]; onChange?: (value: string[]) => void })

const ButtonGroupSplitContext = createContext<{ size: ButtonSize; variant: ButtonVariant; disabled: boolean }>({
	size: 'md',
	variant: 'primary',
	disabled: false,
})

/* Match Button iconOnlySizes so split trigger is same height as main button. */
const splitTriggerSizes: Record<ButtonSize, string> = {
	xs: 'h-8 w-8 p-0',
	sm: 'h-10 w-10 p-0',
	md: 'h-11 w-11 p-0',
	lg: 'h-14 w-14 p-0',
}

/* Split trigger variant styles. These intentionally mirror buttonVariants in Button.tsx
   for the subset of properties relevant to the dropdown chevron. If a variant's hover/active
   colors change in Button, update the corresponding entry here as well. */
const splitTriggerVariants: Record<ButtonVariant, string> = {
	primary:
		'bg-primary-500 text-white border-white/20 hover:bg-primary-600 active:bg-primary-700',
	'primary-outline':
		'bg-transparent text-primary-500 border-surface-border hover:bg-primary-500/10 active:bg-primary-500/20',
	secondary:
		'bg-ink-200 text-ink-800 border-ink-300 dark:bg-ink-700 dark:text-ink-100 dark:border-ink-600 hover:bg-ink-300 dark:hover:bg-ink-600',
	outlined:
		'bg-transparent text-primary-500 border-surface-border hover:bg-primary-500/10 active:bg-primary-500/20',
	ghost:
		'bg-transparent text-primary-500 border-surface-border hover:bg-primary-500/10 active:bg-primary-500/20',
	link: 'bg-transparent text-primary-500 border-surface-border hover:bg-primary-500/10',
	danger:
		'bg-danger-500 text-white border-white/20 hover:bg-danger-600 active:bg-danger-700',
	'danger-outline':
		'bg-transparent text-danger-500 border-surface-border hover:bg-danger-500/10 active:bg-danger-500/20',
	'danger-link':
		'bg-transparent text-danger-500 border-surface-border hover:bg-danger-500/10',
	success:
		'bg-success-500 text-white border-white/20 hover:bg-success-600 active:bg-success-700',
	'success-outline':
		'bg-transparent text-success-500 border-surface-border hover:bg-success-500/10 active:bg-success-500/20',
	warning:
		'bg-warning-500 text-white border-white/20 hover:bg-warning-600 active:bg-warning-700',
	'warning-outline':
		'bg-transparent text-warning-500 border-surface-border hover:bg-warning-500/10 active:bg-warning-500/20',
	info:
		'bg-sky-600 text-white border-white/20 hover:bg-sky-700 active:bg-sky-800 dark:bg-sky-500 dark:hover:bg-sky-600 dark:active:bg-sky-700',
	'info-outline':
		'bg-transparent text-sky-700 border-surface-border hover:bg-sky-500/10 active:bg-sky-500/20 dark:text-sky-300 dark:hover:bg-sky-400/10 dark:active:bg-sky-400/20',
}

/* Slot pattern for split-button menu content. ButtonGroup.Menu returns a plain
   object (not a component); the root detects it via the symbol and calls
   render() when rendering the dropdown. Opaque to Solid's children() so the
   menu render function isn't invoked during child resolution. */
const BUTTON_GROUP_MENU_SYMBOL = Symbol.for('ButtonGroup.Menu')
export interface ButtonGroupMenuSlot {
	[BUTTON_GROUP_MENU_SYMBOL]: true
	render: () => JSX.Element
}

function isMenuSlot(v: unknown): v is ButtonGroupMenuSlot {
	return typeof v === 'object' && v !== null && BUTTON_GROUP_MENU_SYMBOL in v
}

/** Resolve a menu slot, render function, or plain JSX element. */
function resolveSlot(value: unknown): JSX.Element {
	if (isMenuSlot(value)) return value.render()
	if (typeof value === 'function') return (value as () => JSX.Element)()
	return value as JSX.Element
}

function ButtonGroupMenuRenderer(props: { content: unknown }) {
	return <>{resolveSlot(props.content)}</>
}

const groupBaseClasses =
	'inline-flex rounded-lg border border-surface-border overflow-hidden [&>*]:!shadow-none'

const groupChildClasses =
	'[&>*]:!rounded-none [&>*]:!border-0 [&>*]:!border-r [&>*]:!border-surface-border [&>*:last-child]:!border-r-0 [&>*:first-child]:!rounded-l-lg [&>*:last-child]:!rounded-r-lg'

const groupChildClassesFilled =
	'[&>*]:!rounded-none [&>*]:!border-0 [&>*]:!border-r [&>*]:!border-white/20 [&>*:last-child]:!border-r-0 [&>*:first-child]:!rounded-l-lg [&>*:last-child]:!rounded-r-lg'

const groupChildClassesVertical =
	'flex-col [&>*]:!rounded-none [&>*]:!border-0 [&>*]:!border-b [&>*]:!border-surface-border [&>*:last-child]:!border-b-0 [&>*:first-child]:!rounded-t-lg [&>*:last-child]:!rounded-b-lg'

const toggleItemClass = cn(
	'inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors outline-none',
	'bg-transparent text-ink-700 dark:text-ink-300 hover:bg-surface-overlay',
	'data-[pressed]:bg-primary-500 data-[pressed]:text-white',
	'data-[pressed]:hover:bg-primary-600 data-[pressed]:hover:text-white',
	'data-[pressed]:!border-white/20',
	'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset',
	'disabled:opacity-50 disabled:cursor-not-allowed',
	'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed'
)

/**
 * Groups buttons into a single visual unit. Supports three modes:
 * default (inline group), split (primary action + dropdown), and
 * toggle (single/multi-select option bar via `options`).
 */
export function ButtonGroupRoot(props: ButtonGroupProps) {
	const [local, others] = splitProps(props, [
		'class',
		'children',
		'split',
		'size',
		'variant',
		'filled',
		'options',
		'value',
		'onChange',
		'multiple',
		'orientation',
		'disabled',
		'splitButtonAriaLabel',
		'open',
		'onOpenChange',
	])

	// Mode determined once at creation. Switching after mount is not supported.
	const mode: 'toggle' | 'split' | 'default' =
		local.options != null ? 'toggle'
		: local.split === true ? 'split'
		: 'default'

	// All reactive primitives unconditional — Solid tracks ownership by call
	// order, so conditional creation can cause issues with HMR / Suspense.
	const [internalOpen, setInternalOpen] = createSignal(false)
	const isControlled = () => local.open !== undefined
	const open = () => (isControlled() ? (local.open as boolean) : internalOpen())
	const setOpen = (next: boolean) => {
		if (local.disabled && next) return
		if (!isControlled()) setInternalOpen(next)
		local.onOpenChange?.(next)
	}
	// children() resolves slot objects returned by ButtonGroupMenu. The slot
	// pattern relies on Solid's children() returning raw component return values
	// (including non-DOM objects) — this is documented Solid behavior but worth
	// noting for future Solid version upgrades.
	const resolved = children(() => local.children)
	const list = () => {
		const c = resolved()
		return Array.isArray(c) ? c : c ? [c] : []
	}
	const main = () => list()[0]
	const menuContent = () => list()[1]
	const size = () => (local.size ?? 'md') as ButtonSize
	const variant = () => (local.variant ?? 'primary') as ButtonVariant
	const toggleOrientation = () => local.orientation ?? 'horizontal'
	const toggleRootClass = () =>
		cn(
			groupBaseClasses,
			toggleOrientation() === 'vertical' ? groupChildClassesVertical : groupChildClasses,
			local.class
		)

	if (import.meta.env.DEV) {
		createEffect(() => {
			if (mode === 'split' && list().length < 2) {
				console.warn(
					'ButtonGroup: split mode expects <ButtonGroup.Main> and <ButtonGroup.Menu> as children.'
				)
			}
		})
	}

	if (mode === 'toggle') {
		const toggleChildren = () => (
			<For each={local.options}>
				{(opt) => (
					<KobalteToggleGroup.Item value={opt.value} aria-label={opt.label} class={toggleItemClass}>
						{opt.label}
					</KobalteToggleGroup.Item>
				)}
			</For>
		)
		if (local.multiple) {
			return (
				<KobalteToggleGroup
					value={(local.value as string[] | undefined) ?? []}
					onChange={local.onChange as (v: string[]) => void}
					multiple
					orientation={toggleOrientation()}
					disabled={local.disabled}
					class={toggleRootClass()}
				>
					{toggleChildren()}
				</KobalteToggleGroup>
			)
		}
		return (
			<KobalteToggleGroup
				value={(local.value as string | undefined) ?? null}
				onChange={local.onChange as (v: string | null) => void}
				orientation={toggleOrientation()}
				disabled={local.disabled}
				class={toggleRootClass()}
			>
				{toggleChildren()}
			</KobalteToggleGroup>
		)
	}

	if (mode === 'split') {
		return (
			<ButtonGroupSplitContext.Provider
				value={{ get size() { return size() }, get variant() { return variant() }, get disabled() { return !!local.disabled } }}
			>
				<DropdownMenuPrimitive.Root open={open()} onOpenChange={setOpen}>
					<div
						data-torchui="button-group"
						role="group"
						aria-label={local.splitButtonAriaLabel ?? 'Split button'}
						class={cn(groupBaseClasses, local.class)}
						{...others}
					>
						{main()}
						<DropdownMenuPrimitive.Trigger
							as="button"
							type="button"
							disabled={local.disabled}
							class={cn(
								'inline-flex shrink-0 items-center justify-center rounded-none border-l',
								'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',
								splitTriggerVariants[variant()],
								splitTriggerSizes[size()],
								local.disabled && 'opacity-50 cursor-not-allowed'
							)}
							aria-label="Open menu"
						>
							<ChevronDown class="h-4 w-4" />
						</DropdownMenuPrimitive.Trigger>
					</div>
					<DropdownMenuPrimitive.Portal>
						<DropdownMenuPrimitive.Content
							class={cn(
								'z-50 min-w-[160px] rounded-lg border border-surface-border bg-surface-raised p-1 shadow-lg'
							)}
						>
							<ButtonGroupMenuRenderer content={menuContent()} />
						</DropdownMenuPrimitive.Content>
					</DropdownMenuPrimitive.Portal>
				</DropdownMenuPrimitive.Root>
			</ButtonGroupSplitContext.Provider>
		)
	}

	const childClasses = () =>
		local.filled ? groupChildClassesFilled : groupChildClasses
	return (
		<div
			data-torchui="button-group"
			role="group"
			class={cn(groupBaseClasses, childClasses(), local.class)}
			{...others}
		>
			{local.children}
		</div>
	)
}

export interface ButtonGroupMainProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Override the variant inherited from ButtonGroup. */
	variant?: ButtonVariant
	/** Override the size inherited from ButtonGroup. */
	size?: ButtonSize
	class?: string
	children?: JSX.Element
}

/** Primary action button in split mode. Inherits size/variant from the parent ButtonGroup. */
export function ButtonGroupMain(props: ButtonGroupMainProps) {
	const ctx = useContext(ButtonGroupSplitContext)
	// onChange must be extracted here to prevent it from spreading into Button via
	// {...others}. Button treats the presence of onChange + pressed as a signal to
	// activate toggle mode, so leaking onChange would cause unintended behavior.
	const [local, others] = splitProps(props, ['variant', 'size', 'class', 'children', 'onChange'])
	return (
		<Button
			variant={local.variant ?? ctx.variant}
			size={local.size ?? ctx.size}
			disabled={others.disabled ?? ctx.disabled}
			disableElevation
			class={cn('!rounded-r-none !border-r-0', local.class)}
			{...(others as ButtonProps)}
		>
			{local.children}
		</Button>
	)
}

export interface ButtonGroupMenuProps {
	/** Dropdown content rendered when the split trigger is clicked. Accepts JSX or a render function. */
	children?: JSX.Element | (() => JSX.Element)
}

/** Returns a plain object (slot), not JSX — used as second child of ButtonGroup when split. Cast to JSX.Element so TS accepts <ButtonGroup.Menu> in JSX. */
export function ButtonGroupMenu(props: ButtonGroupMenuProps): JSX.Element {
	const child = props.children
	const render =
		typeof child === 'function'
			? (child as () => JSX.Element)
			: () => (child as JSX.Element) ?? null
	return { [BUTTON_GROUP_MENU_SYMBOL]: true, render } as unknown as JSX.Element
}

export const ButtonGroup = Object.assign(ButtonGroupRoot, {
	Main: ButtonGroupMain,
	Menu: ButtonGroupMenu,
})
