import { type JSX, children, createEffect, splitProps } from 'solid-js'
import { Button as KobalteButton } from '@kobalte/core/button'
import { ToggleButton as KobalteToggleButton } from '@kobalte/core/toggle-button'
import { LoaderCircle } from 'lucide-solid'
import { cn } from '../../utilities/classNames'

export type ButtonVariant =
	| 'primary'
	| 'primary-outline'
	| 'secondary'
	| 'outlined'
	| 'ghost'
	| 'link'
	| 'danger'
	| 'danger-outline'
	| 'danger-link'
	| 'success'
	| 'success-outline'
	| 'warning'
	| 'warning-outline'
	| 'info'
	| 'info-outline'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export interface ButtonProps
	extends Omit<
		JSX.ButtonHTMLAttributes<HTMLButtonElement> & JSX.AnchorHTMLAttributes<HTMLAnchorElement>,
		'children' | 'onChange' | 'shape'
	> {
	/** Visual style of the button. Default: "primary" */
	variant?: ButtonVariant
	/** Button size. Default: "md" */
	size?: ButtonSize
	/** Stretch to fill the parent width. */
	fullWidth?: boolean
	/** Show a spinner and disable interaction. */
	loading?: boolean
	/** Remove the subtle box-shadow on filled variants. */
	disableElevation?: boolean
	/** Render as a square icon-only button (uses `icon` or `startIcon`). */
	iconOnly?: boolean
	/** Corner radius. Default: "rounded" (or "circle" when iconOnly). */
	radius?: 'circle' | 'rounded' | 'square'
	/** Icon element for icon-only mode. Falls back to `startIcon`. */
	icon?: JSX.Element
	/** Icon placed before the label. */
	startIcon?: JSX.Element
	/** Icon placed after the label. */
	endIcon?: JSX.Element
	/** Text label. When set, takes priority over `children`. */
	label?: string
	/** When set, renders as an anchor (`<a>`) with button styling. */
	href?: string
	/** Controlled pressed state for toggle mode (requires `onChange`). */
	pressed?: boolean
	/** Toggle callback. Setting both `pressed` and `onChange` enables toggle mode. */
	onChange?: (pressed: boolean) => void
	children?: JSX.Element
}

const filledVariants: ButtonVariant[] = ['primary', 'danger', 'success', 'warning', 'info']

const buttonVariants: Record<ButtonVariant, string> = {
	primary:
		'border-2 border-transparent bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus:ring-primary-500/50',
	'primary-outline':
		'bg-transparent text-primary-500 border-2 border-primary-500 hover:bg-primary-500/10 active:bg-primary-500/20 focus:ring-primary-500/50',
	secondary:
		'border-2 border-surface-border bg-surface-raised text-ink-700 hover:bg-surface-overlay active:bg-surface-dim focus:ring-ink-500/30 dark:text-ink-200',
	outlined:
		'bg-transparent text-ink-700 border-2 border-ink-300 hover:bg-surface-overlay active:bg-surface-dim focus:ring-ink-500/30 dark:border-ink-600 dark:text-ink-300',
	link: 'text-primary-500 hover:text-primary-600 hover:underline underline-offset-4 focus:ring-primary-500/50',
	ghost:
		'bg-transparent text-primary-500 border-2 border-transparent hover:bg-primary-500/10 active:bg-primary-500/20 focus:ring-primary-500/50',
	danger:
		'border-2 border-transparent bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 focus:ring-danger-500/50',
	'danger-outline':
		'bg-transparent text-danger-500 border-2 border-danger-500 hover:bg-danger-500/10 active:bg-danger-500/20 focus:ring-danger-500/50',
	'danger-link':
		'text-danger-500 hover:text-danger-600 hover:underline underline-offset-4 focus:ring-danger-500/50',
	success:
		'border-2 border-transparent bg-success-500 text-white hover:bg-success-600 active:bg-success-700 focus:ring-success-500/50',
	'success-outline':
		'bg-transparent text-success-500 border-2 border-success-500 hover:bg-success-500/10 active:bg-success-500/20 focus:ring-success-500/50',
	warning:
		'border-2 border-transparent bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700 focus:ring-warning-500/50',
	'warning-outline':
		'bg-transparent text-warning-500 border-2 border-warning-500 hover:bg-warning-500/10 active:bg-warning-500/20 focus:ring-warning-500/50',
	info:
		'border-2 border-transparent bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800 focus:ring-sky-500/50 dark:bg-sky-500 dark:hover:bg-sky-600 dark:active:bg-sky-700',
	'info-outline':
		'bg-transparent text-sky-700 border-2 border-sky-500 hover:bg-sky-500/10 active:bg-sky-500/20 focus:ring-sky-500/50 dark:text-sky-300 dark:border-sky-400 dark:hover:bg-sky-400/10 dark:active:bg-sky-400/20',
}

/* Fixed height per size so all variants align. Total height includes border-2 (4px), so content area is 40px for md. sm (36px content) matches compact form fields. */
const buttonSizes: Record<ButtonSize, string> = {
	xs: 'h-8 min-h-8 px-2 text-xs',       // 32px total, 28px content with border-2
	sm: 'h-10 min-h-10 px-3 text-sm',     // 40px total, 36px content with border-2
	md: 'h-11 min-h-11 px-4 text-base',   // 44px total, 40px content with border-2
	lg: 'h-14 min-h-14 px-6 text-lg',     // 56px total, 52px content with border-2
}

/* Square dimensions for icon-only buttons so radius="circle" renders as a circle. */
const iconOnlySizes: Record<ButtonSize, string> = {
	xs: 'h-8 w-8 p-0',
	sm: 'h-10 w-10 p-0',
	md: 'h-11 w-11 p-0',
	lg: 'h-14 w-14 p-0',
}

/* Corner radius for radius prop: applied to all buttons (text and icon-only). */
const radiusClasses: Record<'circle' | 'rounded' | 'square', string> = {
	circle: 'rounded-full',
	rounded: 'rounded-lg',
	square: 'rounded-none',
}

const sharedButtonClass =
	'box-border inline-flex items-center justify-center gap-2 font-medium transition-all shrink-0 focus-visible:outline-none focus-visible:ring-4'

/* Toggle mode: variant styles (outlined/ghost) with data-[pressed] state. Used when pressed + onChange are set. */
const toggleModeVariants: Record<'outlined' | 'ghost', string> = {
	outlined:
		'border-2 bg-surface-raised text-ink-700 dark:text-ink-300 border-surface-border hover:bg-surface-overlay ' +
		'data-[pressed]:bg-primary-500 data-[pressed]:text-white data-[pressed]:border-primary-500 ' +
		'data-[pressed]:hover:bg-primary-600 data-[pressed]:hover:border-primary-600',
	ghost:
		'border-2 border-transparent text-ink-700 dark:text-ink-300 hover:bg-surface-overlay ' +
		'data-[pressed]:bg-primary-100 data-[pressed]:text-primary-800 ' +
		'dark:data-[pressed]:bg-primary-500/20 dark:data-[pressed]:text-primary-200 ' +
		'data-[pressed]:hover:bg-primary-200 dark:data-[pressed]:hover:bg-primary-500/30',
}

/**
 * Polymorphic button: renders as a standard button, anchor link, or toggle
 * depending on props. Supports loading spinners, icons, and multiple variants.
 */
export function Button(props: ButtonProps) {
	const [local, others] = splitProps(props, [
		'variant',
		'size',
		'fullWidth',
		'loading',
		'disabled',
		'disableElevation',
		'iconOnly',
		'radius',
		'icon',
		'startIcon',
		'endIcon',
		'class',
		'style',
		'children',
		'label',
		'onClick',
		'href',
		'pressed',
		'onChange',
		'ref',
		'type',
	])

	const resolvedChildren = children(() => local.children)
	const variant = () => local.variant ?? 'primary'
	const size = () => local.size ?? 'md'
	const isDisabled = () => local.disabled || local.loading

	// Mode determined once at creation. Switching after mount is not supported.
	const mode: 'toggle' | 'link' | 'button' =
		local.pressed !== undefined && local.onChange != null ? 'toggle'
		: local.href != null && local.href !== '' ? 'link'
		: 'button'

	/* In toggle mode, only outlined and ghost are supported; default outlined. */
	const toggleVariant = (): 'outlined' | 'ghost' =>
		local.variant === 'ghost' ? 'ghost' : 'outlined'
	if (import.meta.env.DEV) {
		if (local.iconOnly) {
			const a = others as Record<string, unknown>
			if (local.label == null && a['aria-label'] == null && a['aria-labelledby'] == null && a['title'] == null) {
				console.warn('Button: iconOnly requires label, aria-label, aria-labelledby, or title for accessibility.')
			}
		}
		createEffect(() => {
			const currentMode =
				local.pressed !== undefined && local.onChange != null ? 'toggle'
				: local.href != null && local.href !== '' ? 'link'
				: 'button'
			if (currentMode !== mode) {
				console.warn(`Button: mode changed from "${mode}" to "${currentMode}" after mount. This is not supported.`)
			}
			if (mode === 'toggle' && local.variant != null && !['outlined', 'ghost'].includes(local.variant)) {
				console.warn('Button: toggle mode only supports outlined and ghost variants.')
			}
		})
	}
	const resolvedRadius = (): 'circle' | 'rounded' | 'square' =>
		local.radius ?? (local.iconOnly ? 'circle' : 'rounded')

	const hasElevation = () =>
		!local.disableElevation && filledVariants.includes(variant())

	const baseClass = () =>
		cn(
			sharedButtonClass,
			buttonVariants[variant()],
			local.iconOnly ? iconOnlySizes[size()] : buttonSizes[size()],
			radiusClasses[resolvedRadius()],
			local.fullWidth && 'w-full',
			hasElevation() && 'shadow-sm hover:shadow',
			isDisabled() && 'opacity-50 cursor-not-allowed pointer-events-none',
			local.class
		)

	const toggleClass = () =>
		cn(
			sharedButtonClass,
			'focus-visible:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed',
			toggleModeVariants[toggleVariant()],
			local.iconOnly ? iconOnlySizes[size()] : buttonSizes[size()],
			radiusClasses[resolvedRadius()],
			local.fullWidth && 'w-full',
			isDisabled() && 'opacity-50 cursor-not-allowed pointer-events-none',
			local.class
		)

	// Icon props are pre-evaluated JSX at the call site — <Show> gates DOM
	// insertion but cannot prevent element creation. This is a Solid design
	// reality for JSX-typed props. Gating creation would require an API change
	// to accept icon factories (() => JSX.Element) instead of JSX.Element.
	const content = () => {
		if (local.iconOnly) {
			return (
				<>
					{local.loading && <LoaderCircle class="h-4 w-4 shrink-0 animate-spin" />}
					{!local.loading && (local.icon ?? local.startIcon)}
				</>
			)
		}
		return (
			<>
				{local.loading && <LoaderCircle class="h-4 w-4 shrink-0 animate-spin" />}
				{!local.loading && local.startIcon}
				{local.label != null ? local.label : resolvedChildren()}
				{local.endIcon}
			</>
		)
	}

	if (mode === 'toggle') {
		return (
			<KobalteToggleButton
				ref={local.ref}
				pressed={local.pressed}
				onChange={local.onChange!}
				disabled={isDisabled()}
				class={toggleClass()}
				style={local.style}
				{...others}
			>
				{content()}
			</KobalteToggleButton>
		)
	}

	if (mode === 'link') {
		return (
			<KobalteButton
				ref={local.ref}
				as="a"
				href={local.href}
				aria-disabled={isDisabled()}
				tabIndex={isDisabled() ? -1 : undefined}
				class={baseClass()}
				style={local.style}
				onClick={(e: MouseEvent) => {
					if (isDisabled()) e.preventDefault()
					;(local.onClick as ((e: MouseEvent) => void) | undefined)?.(e)
				}}
				{...others}
			>
				{content()}
			</KobalteButton>
		)
	}

	return (
		<KobalteButton
			ref={local.ref}
			as="button"
			type={local.type ?? 'button'}
			disabled={isDisabled()}
			class={baseClass()}
			style={local.style}
			onClick={(e: MouseEvent) =>
				(local.onClick as ((e: MouseEvent) => void) | undefined)?.(e)
			}
			{...others}
		>
			{content()}
		</KobalteButton>
	)
}
