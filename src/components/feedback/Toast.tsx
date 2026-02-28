import { createSignal, createContext, useContext, onCleanup, For, Show, splitProps, onMount, createEffect, type JSX } from 'solid-js'
import { Portal } from 'solid-js/web'
import { X } from 'lucide-solid'
import { cn } from '../lib/cn'

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
	id: string
	title?: string
	description?: string
	/** Legacy: for backward compatibility */
	message?: string
	variant?: ToastVariant
	/** Auto-dismiss duration in ms. Default 5000. Set to 0 to disable auto-dismiss. */
	duration?: number
	/** Show progress bar for countdown. Default true when duration > 0. */
	showProgress?: boolean
	/** Optional action label; when set, onAction is called when clicked. */
	actionLabel?: string
	onAction?: () => void
}

export interface ToastContextValue {
	toasts: () => ToastItem[]
	show: (title: string, description?: string, options?: { variant?: ToastVariant; duration?: number; showProgress?: boolean; actionLabel?: string; onAction?: () => void }) => string
	dismiss: (id: string) => void
}

let toastSeq = 0
const newToastId = () => `toast-${++toastSeq}`

const MAX_TOASTS = 5

interface TimerEntry {
	timer: ReturnType<typeof setTimeout> | null
	remaining: number
	startedAt: number
	paused: boolean
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
	const ctx = useContext(ToastContext)
	if (!ctx) throw new Error('useToast must be used within ToastProvider')
	return ctx
}

export interface ToastProviderProps {
	children: JSX.Element
	/** Position of the toast container. Default bottom-right. */
	position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
	/** Hotkey to jump to toast region. Default Alt+T. */
	hotkey?: string
}

export function ToastProvider(props: ToastProviderProps) {
	const [local] = splitProps(props, ['children', 'position', 'hotkey'])

	const [toasts, setToasts] = createSignal<ToastItem[]>([])
	const timers = new Map<string, TimerEntry>()
	const [regionRef, setRegionRef] = createSignal<HTMLDivElement | null>(null)
	const position = () => local.position ?? 'bottom-right'
	const hotkey = () => local.hotkey ?? 'Alt+T'

	const startTimer = (id: string, duration: number) => {
		const existing = timers.get(id)
		if (existing?.timer != null) clearTimeout(existing.timer)
		const timer = setTimeout(() => {
			if (!timers.has(id)) return
			timers.delete(id)
			setToasts((prev) => prev.filter((t) => t.id !== id))
		}, duration)
		if (existing) {
			existing.timer = timer
			existing.remaining = duration
			existing.startedAt = Date.now()
			existing.paused = false
		} else {
			timers.set(id, { timer, remaining: duration, startedAt: Date.now(), paused: false })
		}
	}

	const clearTimer = (id: string) => {
		const entry = timers.get(id)
		if (entry != null) {
			if (entry.timer != null) clearTimeout(entry.timer)
			timers.delete(id)
		}
	}

	const pauseTimer = (id: string) => {
		const entry = timers.get(id)
		if (entry == null || entry.paused) return
		if (entry.timer != null) clearTimeout(entry.timer)
		entry.timer = null
		entry.remaining = Math.max(0, entry.remaining - (Date.now() - entry.startedAt))
		entry.paused = true
	}

	const resumeTimer = (id: string) => {
		const entry = timers.get(id)
		if (entry == null || !entry.paused) return
		if (entry.remaining <= 0) {
			timers.delete(id)
			setToasts((prev) => prev.filter((t) => t.id !== id))
			return
		}
		startTimer(id, entry.remaining)
	}

	const show: ToastContextValue['show'] = (title, description, options) => {
		const id = newToastId()
		// Backward compatibility: if only title is provided and no description, treat as message
		const isLegacyMessage = title && !description && !options?.variant
		const item: ToastItem = {
			id,
			title: isLegacyMessage ? undefined : title,
			description: isLegacyMessage ? undefined : description,
			message: isLegacyMessage ? title : undefined,
			variant: options?.variant ?? 'default',
			duration: options?.duration ?? 5000,
			showProgress: options?.showProgress,
			actionLabel: options?.actionLabel,
			onAction: options?.onAction,
		}
		const prev = toasts()
		const next = [...prev, item].slice(-MAX_TOASTS)
		if (prev.length >= MAX_TOASTS) {
			const nextIds = new Set(next.map((t) => t.id))
			for (const t of prev) {
				if (!nextIds.has(t.id)) clearTimer(t.id)
			}
		}
		setToasts(next)
		if (item.duration && item.duration > 0) {
			startTimer(id, item.duration)
		}
		return id
	}

	const dismiss = (id: string) => {
		clearTimer(id)
		setToasts((prev) => prev.filter((t) => t.id !== id))
	}

	// Hotkey handler to jump to toast region
	onMount(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const keys = hotkey().split('+').map(k => k.toLowerCase())
			const alt = keys.includes('alt') && e.altKey
			const ctrl = keys.includes('ctrl') && e.ctrlKey
			const shift = keys.includes('shift') && e.shiftKey
			const meta = keys.includes('meta') && e.metaKey
			const key = keys.find(k => !['alt', 'ctrl', 'shift', 'meta'].includes(k))
			
			if (key && e.key.toLowerCase() === key && alt && !ctrl && !shift && !meta) {
				e.preventDefault()
				regionRef()?.focus()
			}
		}
		document.addEventListener('keydown', handleKeyDown)
		onCleanup(() => document.removeEventListener('keydown', handleKeyDown))
	})

	onCleanup(() => {
		for (const entry of timers.values()) { if (entry.timer != null) clearTimeout(entry.timer) }
		timers.clear()
	})

	const value: ToastContextValue = { toasts, show, dismiss }

	return (
		<ToastContext.Provider value={value}>
			{local.children}
			<Portal>
				<div
					ref={setRegionRef}
					tabIndex={-1}
					class={cn(
						'pointer-events-none fixed z-[100] flex gap-2 p-4',
						position().startsWith('bottom') ? 'flex-col-reverse' : 'flex-col',
						position() === 'top-left' && 'left-4 top-4',
						position() === 'top-right' && 'right-4 top-4',
						position() === 'bottom-left' && 'left-4 bottom-4',
						position() === 'bottom-right' && 'right-4 bottom-4'
					)}
					role="region"
					aria-label="Notifications"
				>
				<For each={toasts()}>
					{(t) => (
						<ToastItemView
							toast={t}
							timers={timers}
							onDismiss={() => dismiss(t.id)}
							onPause={() => pauseTimer(t.id)}
							onResume={() => resumeTimer(t.id)}
						/>
					)}
				</For>
				</div>
			</Portal>
		</ToastContext.Provider>
	)
}

const variantClasses: Record<ToastVariant, string> = {
	default: 'bg-ink-800 text-white dark:bg-ink-200 dark:text-ink-900',
	success: 'bg-success-600 text-white dark:bg-success-500',
	error: 'bg-danger-600 text-white dark:bg-danger-500',
	warning: 'bg-warning-600 text-white dark:bg-warning-500',
	info: 'bg-primary-600 text-white dark:bg-primary-500',
}

function ToastItemView(props: { toast: ToastItem; onDismiss: () => void; onPause: () => void; onResume: () => void; timers: Map<string, TimerEntry> }) {
	const [local, rest] = splitProps(props, ['toast', 'onDismiss', 'onPause', 'onResume'])

	const t = () => local.toast
	const variant = () => t().variant ?? 'default'
	const isAlert = () => variant() === 'error' || variant() === 'warning'
	const [progress, setProgress] = createSignal(100)
	
	// Update progress based on timer - always running interval that checks pause state
	createEffect(() => {
		const id = t().id
		const interval = setInterval(() => {
			const timer = rest.timers.get(id)
			if (!timer) {
				setProgress(100)
				return
			}
			
			if (timer.paused) {
				return // Don't update progress when paused
			}
			
			const totalDuration = timer.remaining + (Date.now() - timer.startedAt)
			if (totalDuration <= 0) {
				setProgress(100)
				return
			}
			
			const elapsed = Date.now() - timer.startedAt
			const remaining = Math.max(0, timer.remaining - elapsed)
			const percentage = (remaining / totalDuration) * 100
			setProgress(percentage)
		}, 50)
		
		onCleanup(() => clearInterval(interval))
	})
	return (
		<div
			role={isAlert() ? 'alert' : 'status'}
			aria-atomic="true"
			tabIndex={0}
			class={cn(
				'relative pointer-events-auto flex min-w-[280px] max-w-md items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm shadow-lg',
				variantClasses[variant()]
			)}
			onMouseEnter={local.onPause}
			onMouseLeave={local.onResume}
			onFocusIn={local.onPause}
			onFocusOut={(e: FocusEvent) => {
				const next = e.relatedTarget as Node | null
				if (next && (e.currentTarget as Node).contains(next)) return
				local.onResume()
			}}
			onKeyDown={(e: KeyboardEvent) => {
				if (e.key === 'Escape') local.onDismiss()
			}}
		>
			<div class="flex flex-1 flex-col gap-1">
				<Show when={t().title}>
					<div class="font-medium" role="heading" aria-level={3}>
						{t().title}
					</div>
				</Show>
				<Show when={t().description}>
					<div class="text-sm opacity-90">
						{t().description}
					</div>
				</Show>
				<Show when={!t().title && !t().description}>
					{/* Fallback for legacy single message */}
					<div>{t().message}</div>
				</Show>
			</div>
			<div class="flex shrink-0 items-center gap-2">
				<Show when={t().actionLabel && t().onAction}>
					<button
						type="button"
						onClick={() => { t().onAction?.(); local.onDismiss() }}
						class="rounded font-medium underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
					>
						{t().actionLabel}
					</button>
				</Show>
				<button
					type="button"
					onClick={local.onDismiss}
					class="rounded p-1 opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
					aria-label="Dismiss"
				>
					<X class="h-4 w-4" aria-hidden="true" />
				</button>
			</div>
			<Show when={t().showProgress !== false && t().duration && t().duration! > 0}>
				<div class="absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-lg">
					<div 
						class="h-full bg-white/20 transition-all duration-75 ease-linear"
						style={{ width: `${progress()}%` }}
						role="progressbar"
						aria-valuenow={progress()}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-label="Time remaining"
					/>
				</div>
			</Show>
		</div>
	)
}
