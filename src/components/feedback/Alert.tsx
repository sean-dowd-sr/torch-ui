import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cn } from '../../utilities/classNames'

export type AlertStatus = 'error' | 'success' | 'warning' | 'info'

export type AlertAppearance = 'subtle' | 'solid' | 'outline' | 'transparent'

export interface AlertProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
	/** Semantic status: error, success, warning, or info. Ignored when colorClass is set. */
	status?: AlertStatus
	/** Visual style: subtle (default), solid, outline, or transparent. */
	appearance?: AlertAppearance
	/** Optional icon shown at the start. */
	icon?: JSX.Element
	/** When true, shows a close button and calls onClose when clicked. */
	closeable?: boolean
	/** Called when the close button is clicked. Required when closeable is true. */
	onClose?: () => void
	/** Override default status colors. Provide Tailwind classes for border, background, and text (include dark: variants). */
	colorClass?: string
	/** Controls the ARIA live region behavior. 'assertive' → role="alert" (interrupts SR), 'polite' → role="status" (queued), 'off' → no role. Default 'polite'. */
	ariaLive?: 'polite' | 'assertive' | 'off'
	/** Optional CTAs (e.g. Resend, Upgrade) rendered at the end of the alert. */
	actions?: JSX.Element
	/** Optional heading (e.g. "Error" or "Session expired") shown above the message. */
	title?: JSX.Element
	class?: string
	children?: JSX.Element
}

type StatusAppearanceMap = Record<AlertStatus, Record<AlertAppearance, string>>

const statusAppearanceClasses: StatusAppearanceMap = {
	error: {
		subtle:
			'border-danger-500 bg-danger-50 text-danger-700 dark:border-danger-800 dark:bg-danger-950 dark:text-danger-100',
		solid:
			'border-danger-500 bg-danger-500 text-white dark:border-danger-600 dark:bg-danger-600',
		outline:
			'border-danger-500 bg-transparent text-danger-700 dark:border-danger-500 dark:bg-transparent dark:text-danger-300',
		transparent:
			'border-transparent bg-danger-50 text-danger-800 dark:border-transparent dark:bg-danger-950 dark:text-danger-200',
	},
	success: {
		subtle:
			'border-success-500 bg-success-50 text-success-700 dark:border-success-800 dark:bg-success-950 dark:text-success-100',
		solid:
			'border-success-500 bg-success-500 text-white dark:border-success-600 dark:bg-success-600',
		outline:
			'border-success-500 bg-transparent text-success-700 dark:border-success-500 dark:bg-transparent dark:text-success-300',
		transparent:
			'border-transparent bg-success-50 text-success-800 dark:border-transparent dark:bg-success-950 dark:text-success-200',
	},
	warning: {
		subtle:
			'border-warning-500 bg-warning-50 text-warning-700 dark:border-warning-800 dark:bg-warning-950 dark:text-warning-100',
		solid:
			'border-warning-500 bg-warning-400 text-ink-900 dark:border-warning-500 dark:bg-warning-500',
		outline:
			'border-warning-500 bg-transparent text-warning-700 dark:border-warning-500 dark:bg-transparent dark:text-warning-300',
		transparent:
			'border-transparent bg-warning-50 text-warning-800 dark:border-transparent dark:bg-warning-950 dark:text-warning-200',
	},
	info: {
		subtle:
			'border-info-500 bg-info-50 text-info-700 dark:border-info-800 dark:bg-info-950 dark:text-info-100',
		solid:
			'border-info-500 bg-info-500 text-white dark:border-info-600 dark:bg-info-600',
		outline:
			'border-info-500 bg-transparent text-info-700 dark:border-info-500 dark:bg-transparent dark:text-info-300',
		transparent:
			'border-transparent bg-info-50 text-info-800 dark:border-transparent dark:bg-info-950 dark:text-info-200',
	},
}

/** Inline alert banner with status, appearance, optional icon, close, and CTAs. */
export function Alert(props: AlertProps): JSX.Element {
	const [local, others] = splitProps(props, [
		'status',
		'appearance',
		'icon',
		'closeable',
		'onClose',
		'ariaLive',
		'role',
		'colorClass',
		'actions',
		'title',
		'class',
		'children',
		'ref',
	])
	const status = () => local.status ?? 'error'
	const appearance = () => local.appearance ?? 'subtle'
	const colorClasses = () =>
		local.colorClass ?? statusAppearanceClasses[status()][appearance()]

	if (import.meta.env.DEV && local.closeable && !local.onClose) {
		console.warn('Alert: closeable is true but onClose is not provided.')
	}

	const liveMode = () => local.ariaLive ?? 'polite'
	const roleAttr = () => {
		const m = liveMode()
		return m === 'assertive' ? 'alert' : m === 'polite' ? 'status' : undefined
	}
	const role = () => local.role ?? roleAttr()
	const ariaLiveAttr = () => liveMode() === 'off' ? undefined : liveMode()
	const showClose = () => local.closeable === true && local.onClose != null
	const hasActions = () => showClose() || local.actions != null

	return (
		<div
			ref={local.ref}
			class={cn(
				'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm',
				colorClasses(),
				local.class,
			)}
			{...others}
			role={role()}
			aria-live={ariaLiveAttr()}
		>
			{local.icon != null && (
				<span class="shrink-0 [&>svg]:size-4" aria-hidden="true">
					{local.icon}
				</span>
			)}
			<div class="min-w-0 flex-1">
				{local.title != null && (
					<div class="font-semibold">{local.title}</div>
				)}
				{local.title != null && local.children != null && <div class="mt-0.5" />}
				{local.children}
			</div>
			{hasActions() && (
				<div class="flex shrink-0 items-center gap-2">
					{local.actions}
					{showClose() && (
						<button
							type="button"
							onClick={local.onClose}
							class="rounded p-1 opacity-70 hover:opacity-100 outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-inset"
							aria-label="Close"
						>
							<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					)}
				</div>
			)}
		</div>
	)
}
