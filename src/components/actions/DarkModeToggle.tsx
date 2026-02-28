import { createSignal, onMount, Show } from 'solid-js'
import { Sun, Moon } from 'lucide-solid'
import { cn } from '../../utilities/classNames'

export interface DarkModeToggleProps {
	/** Visual style. 'icon' renders a button with sun/moon icon (default). 'switch' renders a pill toggle. */
	variant?: 'icon' | 'switch'
	/** Extra classes on the root element */
	class?: string
	/** Element to toggle the dark class on. Defaults to document.documentElement (the html element) */
	target?: () => HTMLElement
}

export function DarkModeToggle(props: DarkModeToggleProps) {
	const [dark, setDark] = createSignal(false)

	onMount(() => {
		const stored = localStorage.getItem('torch-theme')
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
		const isDark = stored ? stored === 'dark' : prefersDark
		setDark(isDark)
		;(props.target?.() ?? document.documentElement).classList.toggle('dark', isDark)
	})

	function toggle() {
		const next = !dark()
		setDark(next)
		;(props.target?.() ?? document.documentElement).classList.toggle('dark', next)
		localStorage.setItem('torch-theme', next ? 'dark' : 'light')
	}

	const variant = () => props.variant ?? 'icon'

	return (
		<Show
			when={variant() === 'switch'}
			fallback={
				<button
					type="button"
					onClick={toggle}
					aria-label={dark() ? 'Switch to light mode' : 'Switch to dark mode'}
					aria-pressed={dark()}
					class={cn(
						'inline-flex items-center justify-center rounded-lg p-2 text-ink-500 transition-colors',
						'hover:bg-surface-overlay hover:text-ink-700',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50',
						props.class,
					)}
				>
					{dark() ? <Sun class="h-4 w-4" /> : <Moon class="h-4 w-4" />}
				</button>
			}
		>
			<button
				type="button"
				role="switch"
				onClick={toggle}
				aria-checked={dark()}
				aria-label={dark() ? 'Switch to light mode' : 'Switch to dark mode'}
				class={cn(
					'relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2',
					dark() ? 'bg-primary-500' : 'bg-surface-dim',
					props.class,
				)}
			>
				<span
					class={cn(
						'pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm ring-0 transition-transform duration-200',
						dark() ? 'translate-x-7' : 'translate-x-0',
					)}
				>
					{dark()
						? <Moon class="h-3 w-3 text-primary-600" />
						: <Sun class="h-3 w-3 text-ink-400" />}
				</span>
			</button>
		</Show>
	)
}
