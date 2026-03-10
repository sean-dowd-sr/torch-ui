import type { JSX } from 'solid-js'
import { splitProps, Show, createSignal } from 'solid-js'
import { cn } from '../../utilities/classNames'

export type BannerStatus = 'primary' | 'info' | 'success' | 'warning' | 'error'
export type BannerAppearance = 'solid' | 'subtle'

export interface BannerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Semantic status. Default: info. */
	status?: BannerStatus
	/** Visual style: solid (default) or subtle. */
	appearance?: BannerAppearance
	/** Optional icon shown at the start. */
	icon?: JSX.Element
	/** Optional call-to-action (e.g. a link or small Button) rendered after the message. */
	action?: JSX.Element
	/** When true, shows a dismiss button and calls onClose on click. */
	closeable?: boolean
	/** Called when the dismiss button is clicked. Required when closeable is true. */
	onClose?: () => void
	/** Make the banner sticky to the top or bottom of its scroll container. */
	sticky?: 'top' | 'bottom'
	/** Override default status colors with custom Tailwind classes. */
	colorClass?: string
	class?: string
	children?: JSX.Element
}

type StatusMap = Record<BannerStatus, Record<BannerAppearance, string>>

const statusClasses: StatusMap = {
	primary: {
		solid: 'bg-primary-500 text-white dark:bg-primary-700 dark:text-white',
		subtle: 'bg-primary-100 border-y border-primary-500 text-primary-800 dark:bg-primary-950 dark:border-primary-800 dark:text-primary-100',
	},
	info: {
		solid: 'bg-info-500 text-white dark:bg-info-700 dark:text-white',
		subtle: 'bg-info-100 border-y border-info-500 text-info-800 dark:bg-info-950 dark:border-info-800 dark:text-info-100',
	},
	success: {
		solid: 'bg-success-500 text-white dark:bg-success-700 dark:text-white',
		subtle: 'bg-success-100 border-y border-success-500 text-success-800 dark:bg-success-950 dark:border-success-800 dark:text-success-100',
	},
	warning: {
		solid: 'bg-warning-500 text-ink-900 dark:bg-warning-600 dark:text-ink-900',
		subtle: 'bg-warning-100 border-y border-warning-500 text-warning-800 dark:bg-warning-950 dark:border-warning-800 dark:text-warning-100',
	},
	error: {
		solid: 'bg-danger-500 text-white dark:bg-danger-700 dark:text-white',
		subtle: 'bg-danger-100 border-y border-danger-500 text-danger-850 dark:bg-danger-950 dark:border-danger-800 dark:text-danger-100',
	},
}

/** Full-width notification strip. Use for site-wide announcements, maintenance notices, or top-of-page alerts. For inline feedback use Alert. */
export function Banner(props: BannerProps): JSX.Element {
	const [local, others] = splitProps(props, [
		'status',
		'appearance',
		'icon',
		'action',
		'closeable',
		'onClose',
		'sticky',
		'colorClass',
		'class',
		'children',
	])

	const status = () => local.status ?? 'primary'
	const appearance = () => local.appearance ?? 'solid'
	const colorCls = () => local.colorClass ?? statusClasses[status()][appearance()]

	const [closing, setClosing] = createSignal(false)

	const handleClose = () => {
		setClosing(true)
		setTimeout(() => local.onClose?.(), 180)
	}

	return (
		<div
			class={cn(
				'flex w-full items-center gap-3 px-4 py-2.5 text-sm overflow-hidden',
				colorCls(),
				local.sticky === 'top' && 'sticky top-0 z-40',
				local.sticky === 'bottom' && 'sticky bottom-0 z-40',
				closing() ? 'animate-banner-out' : 'animate-banner-in',
				local.class,
			)}
			{...others}
		>
			<div class="mx-auto flex w-full max-w-6xl items-center gap-3">
				<Show when={local.icon}>
					<span class="shrink-0 [&>svg]:size-4" aria-hidden="true">{local.icon}</span>
				</Show>
				<span class="flex-1">{local.children}</span>
				<Show when={local.action}>
					<span class="shrink-0">{local.action}</span>
				</Show>
				<Show when={local.closeable && local.onClose}>
					<button
						type="button"
						onClick={handleClose}
						class="ml-auto shrink-0 rounded p-1 opacity-70 hover:opacity-100 outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-inset"
						aria-label="Dismiss"
					>
						<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</Show>
			</div>
		</div>
	)
}
