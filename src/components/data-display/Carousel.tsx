import { type JSX, createSignal, createEffect, onMount, onCleanup, splitProps, For, Show } from 'solid-js'
import { ChevronLeft, ChevronRight } from 'lucide-solid'
import { cn } from '../../utilities/classNames'

export interface CarouselSlide {
	id: string
	content: JSX.Element
}

export interface CarouselProps extends JSX.HTMLAttributes<HTMLDivElement> {
	slides: CarouselSlide[]
	/** Auto-advance interval in ms (cycle time); 0 to disable */
	autoPlayInterval?: number
	/** Show dot indicators below the carousel. Default true; set false to hide. */
	showDots?: boolean
	/** Show prev/next arrow buttons. Default false; set showArrows or showArrows={true} to enable. */
	showArrows?: boolean
	/** Dot indicators alignment: start, center, or end. Default start. */
	dotsPosition?: 'start' | 'center' | 'end'
	/** Accessible label for the carousel region. */
	'aria-label'?: string
}

export function Carousel(props: CarouselProps) {
	const [local, others] = splitProps(props, [
		'slides',
		'autoPlayInterval',
		'showDots',
		'showArrows',
		'dotsPosition',
		'aria-label',
		'class',
	])

	const [currentSlide, setCurrentSlide] = createSignal(0)
	const [progressBarReady, setProgressBarReady] = createSignal(false)
	const autoPlayInterval = () => local.autoPlayInterval ?? 5000

	let intervalId: ReturnType<typeof setInterval> | undefined

	// Clamp currentSlide when slides array shrinks
	createEffect(() => {
		const max = Math.max(local.slides.length - 1, 0)
		setCurrentSlide(i => Math.min(i, max))
	})

	// Reactive autoplay: restart timer when interval or slides change
	createEffect(() => {
		const interval = autoPlayInterval()
		const len = local.slides.length
		if (intervalId) clearInterval(intervalId)
		intervalId = undefined
		if (interval > 0 && len > 1) {
			intervalId = setInterval(nextSlide, interval)
		}
		restartProgressBar()
	})

	function nextSlide() {
		const len = local.slides.length
		if (len === 0) return
		setCurrentSlide((prev) => (prev + 1) % len)
		restartProgressBar()
	}

	function restartProgressBar() {
		setProgressBarReady(false)
		requestAnimationFrame(() => setProgressBarReady(true))
	}

	function goToSlide(index: number) {
		const len = local.slides.length
		if (len === 0) return
		const i = ((index % len) + len) % len
		setCurrentSlide(i)
		restartProgressBar()
		if (intervalId) clearInterval(intervalId)
		const interval = autoPlayInterval()
		if (interval > 0 && len > 1) {
			intervalId = setInterval(nextSlide, interval)
		}
	}

	function goPrev() { goToSlide(currentSlide() - 1) }
	function goNext() { goToSlide(currentSlide() + 1) }

	onMount(() => {
		// Defer progress bar animation by one frame so it runs on initial load (browser quirk)
		const raf = requestAnimationFrame(() => setProgressBarReady(true))
		onCleanup(() => cancelAnimationFrame(raf))
	})

	onCleanup(() => {
		if (intervalId) clearInterval(intervalId)
	})

	return (
		<div
			role="region"
			aria-roledescription="carousel"
			aria-label={local['aria-label'] ?? 'Carousel'}
			{...others}
			class={cn('relative w-full', local.class)}
		>
			{/* Track: inline styles so overflow/position always apply regardless of Tailwind scan */}
			<div
				class="min-h-0 transition-opacity duration-500"
				style={{ position: 'relative', width: '100%', overflow: 'hidden' }}
			>
				<For each={local.slides}>
					{(slide, index) => {
						const isActive = () => index() === currentSlide()
						return (
							<div
								aria-hidden={!isActive()}
								class={cn('transition-opacity duration-500', isActive() ? 'pointer-events-auto' : 'pointer-events-none')}
								style={
									isActive()
										? {
												position: 'relative' as const,
												opacity: 1,
												visibility: 'visible' as const,
												'z-index': 2,
										  }
										: {
												position: 'absolute' as const,
												inset: 0,
												width: '100%',
												height: '100%',
												opacity: 0,
												visibility: 'hidden' as const,
												'z-index': 1,
										  }
								}
							>
								{slide.content}
							</div>
						)
					}}
				</For>
			</div>

			<Show when={local.showArrows === true && local.slides.length > 1}>
				<button
					type="button"
					onClick={goPrev}
					aria-label="Previous slide"
					class="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50"
				>
					<ChevronLeft class="h-5 w-5" />
				</button>
				<button
					type="button"
					onClick={goNext}
					aria-label="Next slide"
					class="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50"
				>
					<ChevronRight class="h-5 w-5" />
				</button>
			</Show>

			<Show when={local.showDots !== false && local.slides.length > 1}>
				<div
					class={cn(
						'flex gap-2 mt-8',
						(local.dotsPosition ?? 'start') === 'end' && 'justify-end',
						(local.dotsPosition ?? 'start') === 'center' && 'justify-center',
						(local.dotsPosition ?? 'start') === 'start' && 'justify-start'
					)}
				>
					<For each={local.slides}>
						{(_, index) => (
							<button
								type="button"
								onClick={() => goToSlide(index())}
								class={cn(
									'h-2 rounded-full transition-all duration-300',
									index() === currentSlide()
										? 'w-8 bg-white/40 relative overflow-hidden'
										: 'w-2 bg-white/40 hover:bg-white/60'
								)}
								aria-label={`Go to slide ${index() + 1}`}
								aria-current={index() === currentSlide() ? 'page' : undefined}
							>
								<Show when={index() === currentSlide() && autoPlayInterval() > 0}>
									<div
										class="absolute top-0 left-0 h-full bg-white rounded-full"
										style={
											progressBarReady()
												? {
														animation: `carouselProgressBar ${autoPlayInterval()}ms linear forwards`,
														'animation-fill-mode': 'forwards',
													}
												: { width: '0%' }
										}
									/>
								</Show>
							</button>
						)}
					</For>
				</div>
			</Show>

			<style>
				{`
					@keyframes carouselProgressBar {
						from { width: 0%; }
						to { width: 100%; }
					}
				`}
			</style>
		</div>
	)
}
