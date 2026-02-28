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
	/** Optional icon (e.g. from lucide-solid) shown at the start. */
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
			'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-500/15 dark:text-red-200',
		solid:
			'border-red-200 bg-red-100 text-red-900 dark:border-red-800 dark:bg-red-600 dark:text-white',
		outline:
			'border-red-300 bg-transparent text-red-700 dark:border-red-600 dark:bg-transparent dark:text-red-300',
		transparent:
			'border-transparent bg-red-50/80 text-red-800 dark:border-transparent dark:bg-red-500/10 dark:text-red-200',
	},
	success: {
		subtle:
			'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-500/15 dark:text-green-200',
		solid:
			'border-green-200 bg-green-100 text-green-900 dark:border-green-800 dark:bg-green-600 dark:text-white',
		outline:
			'border-green-300 bg-transparent text-green-700 dark:border-green-600 dark:bg-transparent dark:text-green-300',
		transparent:
			'border-transparent bg-green-50/80 text-green-800 dark:border-transparent dark:bg-green-500/10 dark:text-green-200',
	},
	warning: {
		subtle:
			'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-500/15 dark:text-amber-200',
		solid:
			'border-amber-200 bg-amber-100 text-amber-900 dark:border-amber-800 dark:bg-amber-600 dark:text-white',
		outline:
			'border-amber-300 bg-transparent text-amber-700 dark:border-amber-600 dark:bg-transparent dark:text-amber-300',
		transparent:
			'border-transparent bg-amber-50/80 text-amber-800 dark:border-transparent dark:bg-amber-500/10 dark:text-amber-200',
	},
	info: {
		subtle:
			'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-500/15 dark:text-sky-200',
		solid:
			'border-sky-200 bg-sky-100 text-sky-900 dark:border-sky-800 dark:bg-sky-600 dark:text-white',
		outline:
			'border-sky-300 bg-transparent text-sky-700 dark:border-sky-600 dark:bg-transparent dark:text-sky-300',
		transparent:
			'border-transparent bg-sky-50/80 text-sky-800 dark:border-transparent dark:bg-sky-500/10 dark:text-sky-200',
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
							class="rounded p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-1 focus:ring-offset-transparent"
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
