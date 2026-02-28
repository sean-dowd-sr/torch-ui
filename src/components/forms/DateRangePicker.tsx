import { createSignal, createMemo, Show, For, splitProps, createUniqueId, createEffect } from 'solid-js'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-solid'
import { Popover as KobaltePopover } from '@kobalte/core/popover'
import { cn } from '../../utilities/classNames'

export interface DateRangePickerProps {
	/** ISO date string YYYY-MM-DD for range start */
	start?: string
	/** ISO date string YYYY-MM-DD for range end */
	end?: string
	/** Called when range changes. end may be empty string if only start is selected. */
	onRangeChange?: (start: string, end: string) => void
	placeholder?: string
	disabled?: boolean
	/** Min date YYYY-MM-DD */
	min?: string
	/** Max date YYYY-MM-DD */
	max?: string
	label?: string
	error?: string
	helperText?: string
	bare?: boolean
	required?: boolean
	optional?: boolean
	/** Show two months side by side. Default: true */
	dualMonth?: boolean
	/** Allow clearing the range. Default: true */
	clearable?: boolean
	class?: string
	id?: string
}

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTH_NAMES = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December',
]

function parseDate(s: string): Date | null {
	if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null
	const d = new Date(s + 'T12:00:00')
	return isNaN(d.getTime()) ? null : d
}

function toISODate(d: Date): string {
	const y = d.getFullYear()
	const m = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')
	return `${y}-${m}-${day}`
}

function formatDisplay(s: string): string {
	const d = parseDate(s)
	if (!d) return ''
	return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function sameDay(a: Date, b: Date) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function getCalendarDays(year: number, month: number): Date[] {
	const first = new Date(year, month, 1)
	const last = new Date(year, month + 1, 0)
	const startPad = first.getDay()
	const flat: Date[] = []
	for (let i = 0; i < startPad; i++) {
		flat.push(new Date(year, month, 1 - (startPad - i)))
	}
	for (let d = 1; d <= last.getDate(); d++) {
		flat.push(new Date(year, month, d))
	}
	while (flat.length < 42) {
		flat.push(new Date(year, month + 1, flat.length - last.getDate() - startPad + 1))
	}
	return flat
}

interface MonthGridProps {
	year: number
	month: number
	start: Date | null
	end: Date | null
	hover: Date | null
	min: Date | null
	max: Date | null
	onDayClick: (d: Date) => void
	onDayHover: (d: Date | null) => void
}

function MonthGrid(props: MonthGridProps) {
	const days = createMemo(() => getCalendarDays(props.year, props.month))

	const isCurrentMonth = (d: Date) => d.getMonth() === props.month
	const isDisabled = (d: Date) => {
		if (props.min && d < props.min) return true
		if (props.max && d > props.max) return true
		return false
	}
	const isStart = (d: Date) => !!props.start && sameDay(d, props.start)

	// Effective end: hover preview (when only start is set) or committed end
	const effectiveEndDate = () => (!props.end && props.hover) ? props.hover : props.end

	// Ordered [lo, hi] regardless of click order
	const orderedRange = (): [Date, Date] | null => {
		const s = props.start
		const e = effectiveEndDate()
		if (!s || !e) return null
		return e < s ? [e, s] : [s, e]
	}

	const isInRange = (d: Date) => {
		const range = orderedRange()
		if (!range) return false
		return d > range[0] && d < range[1]
	}

	const isRangeStart = (d: Date) => {
		const range = orderedRange()
		if (!range) return isStart(d)
		return sameDay(d, range[0])
	}

	const isRangeEnd = (d: Date) => {
		const range = orderedRange()
		if (!range) return false
		return sameDay(d, range[1])
	}

	const isToday = (d: Date) => sameDay(d, new Date())

	return (
		<div>
			<div class="grid grid-cols-7 mb-2">
				<For each={DAY_NAMES}>
					{(name) => (
						<div class="py-1 text-center text-xs font-medium text-ink-400">{name}</div>
					)}
				</For>
			</div>
			<div class="grid grid-cols-7">
				<For each={days()}>
					{(day) => {
						const rangeStart = () => isRangeStart(day)
						const rangeEnd = () => isRangeEnd(day)
						const inRange = () => isInRange(day)
						const disabled = () => isDisabled(day)
						const otherMonth = () => !isCurrentMonth(day)
						const today = () => isToday(day)
						const selected = () => rangeStart() || rangeEnd()

						return (
							<div
								class={cn(
									'relative h-8 flex items-center justify-center',
									inRange() && 'bg-primary-50 dark:bg-primary-500/10',
									rangeStart() && 'rounded-l-full',
									rangeEnd() && 'rounded-r-full',
								)}
							>
								<button
									type="button"
									disabled={disabled()}
									onClick={() => !disabled() && props.onDayClick(day)}
									onMouseEnter={() => !disabled() && props.onDayHover(day)}
									onMouseLeave={() => props.onDayHover(null)}
									class={cn(
										'relative z-10 h-7 w-7 rounded-full text-xs transition-colors',
										'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50',
										selected()
											? 'bg-primary-500 text-white font-semibold hover:bg-primary-600'
											: inRange()
												? 'text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-500/20'
												: otherMonth()
													? 'text-ink-300 dark:text-ink-600 hover:bg-surface-overlay'
													: today()
														? 'text-primary-600 font-semibold hover:bg-surface-overlay dark:text-primary-400'
														: 'text-ink-800 dark:text-ink-200 hover:bg-surface-overlay',
										disabled() && 'cursor-not-allowed opacity-30',
									)}
								>
									{day.getDate()}
									{today() && !selected() && (
										<span class="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-500" />
									)}
								</button>
							</div>
						)
					}}
				</For>
			</div>
		</div>
	)
}

export function DateRangePicker(props: DateRangePickerProps) {
	const [local] = splitProps(props, [
		'start', 'end', 'onRangeChange', 'placeholder', 'disabled',
		'min', 'max', 'label', 'error', 'helperText', 'bare',
		'required', 'optional', 'dualMonth', 'clearable', 'class', 'id',
	])

	const generatedId = createUniqueId()
	const inputId = () => local.id || `drp-${generatedId}`
	const [open, setOpen] = createSignal(false)
	const [hover, setHover] = createSignal<Date | null>(null)

	// Picking state: null = picking start, 'start' = start picked, waiting for end
	const [pickingEnd, setPickingEnd] = createSignal(false)

	const startDate = () => parseDate(local.start ?? '')
	const endDate = () => parseDate(local.end ?? '')

	// View month: left calendar
	const initView = () => {
		const s = startDate()
		return s ? { year: s.getFullYear(), month: s.getMonth() } : { year: new Date().getFullYear(), month: new Date().getMonth() }
	}
	const [viewLeft, setViewLeft] = createSignal(initView())

	// Right calendar is always next month from left
	const viewRight = () => {
		const { year, month } = viewLeft()
		const next = new Date(year, month + 1, 1)
		return { year: next.getFullYear(), month: next.getMonth() }
	}

	createEffect(() => {
		if (!open()) {
			setPickingEnd(false)
			setHover(null)
		}
	})

	const dual = () => local.dualMonth !== false
	const clearable = () => local.clearable !== false
	const minDate = () => parseDate(local.min ?? '')
	const maxDate = () => parseDate(local.max ?? '')

	function handleDayClick(d: Date) {
		if (!pickingEnd()) {
			// First click: set start, clear end
			local.onRangeChange?.(toISODate(d), '')
			setPickingEnd(true)
		} else {
			// Second click: set end (or swap if before start)
			const s = startDate()
			if (s && d < s) {
				local.onRangeChange?.(toISODate(d), toISODate(s))
			} else {
				local.onRangeChange?.(local.start ?? toISODate(d), toISODate(d))
			}
			setPickingEnd(false)
			setOpen(false)
		}
	}

	function clearRange() {
		local.onRangeChange?.('', '')
		setPickingEnd(false)
	}

	function prevMonth() {
		const { year, month } = viewLeft()
		const d = new Date(year, month - 1, 1)
		setViewLeft({ year: d.getFullYear(), month: d.getMonth() })
	}
	function nextMonth() {
		const { year, month } = dual() ? viewRight() : viewLeft()
		const d = new Date(year, month + 1, 1)
		const newLeft = dual()
			? new Date(viewLeft().year, viewLeft().month + 1, 1)
			: d
		setViewLeft({ year: newLeft.getFullYear(), month: newLeft.getMonth() })
	}

	const displayValue = () => {
		const s = local.start ? formatDisplay(local.start) : ''
		const e = local.end ? formatDisplay(local.end) : ''
		if (s && e) return `${s} – ${e}`
		if (s) return `${s} – …`
		return ''
	}

	const hasError = () => !!local.error
	const msgId = () => (local.error || local.helperText) ? `${inputId()}-msg` : undefined

	return (
		<div class={cn('w-full', local.class)}>
			<Show when={!local.bare && local.label}>
				<div class="mb-2 flex items-center justify-between">
					<label
						for={inputId()}
						class={cn(
							'block text-sm font-medium',
							hasError() ? 'text-danger-600 dark:text-danger-400' : 'text-ink-700',
						)}
					>
						{local.label}
					</label>
					<Show when={!local.required && local.optional}>
						<span class="text-xs text-ink-400">optional</span>
					</Show>
				</div>
			</Show>

			<KobaltePopover
				open={open()}
				onOpenChange={(next) => {
					setOpen(next)
					if (next) setViewLeft(initView())
				}}
				gutter={8}
			>
				<div class="relative">
					<KobaltePopover.Trigger
						as="button"
						type="button"
						id={inputId()}
						disabled={local.disabled}
						aria-describedby={msgId()}
						aria-invalid={hasError() ? true : undefined}
						class={cn(
							'inline-flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50',
							hasError()
								? 'border-danger-500 bg-surface-raised text-ink-900 hover:border-danger-600'
								: 'border-surface-border bg-surface-raised text-ink-900 hover:border-ink-400 dark:hover:border-ink-500',
							local.disabled && 'cursor-not-allowed opacity-50',
							clearable() && (local.start || local.end) && !local.disabled && 'pr-8',
						)}
					>
						<CalendarIcon class="h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
						<span class={cn('truncate', displayValue() ? 'text-ink-900' : 'text-ink-400')}>
							{displayValue() || (local.placeholder ?? 'Pick a date range')}
						</span>
					</KobaltePopover.Trigger>
					<Show when={clearable() && (local.start || local.end) && !local.disabled}>
						<button
							type="button"
							onClick={(e) => { e.stopPropagation(); clearRange() }}
							class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-400 hover:text-ink-700 transition-colors"
							aria-label="Clear date range"
						>
							<X class="h-3.5 w-3.5" />
						</button>
					</Show>
				</div>

				<KobaltePopover.Portal>
					<KobaltePopover.Content
						class={cn(
							'z-50 rounded-xl border border-surface-border bg-surface-raised shadow-xl',
							'origin-top data-[expanded]:animate-in data-[expanded]:fade-in-0 data-[expanded]:zoom-in-95',
							'data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95',
						)}
					>
						<div class={cn('p-3', dual() ? 'w-[580px]' : 'w-[268px]')}>
							{/* Header */}
							<div class={cn('flex items-center justify-between', dual() ? 'mb-3' : 'mb-2')}>
								<button
									type="button"
									onClick={prevMonth}
									class="flex h-7 w-7 items-center justify-center rounded-md text-ink-500 hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
									aria-label="Previous month"
								>
									<ChevronLeft class="h-4 w-4" />
								</button>
								<div class={cn('flex', dual() ? 'gap-8' : '')}>
									<div class="text-sm font-semibold text-ink-900 min-w-[140px] text-center">
										{MONTH_NAMES[viewLeft().month]} {viewLeft().year}
									</div>
									<Show when={dual()}>
										<div class="text-sm font-semibold text-ink-900 min-w-[140px] text-center">
											{MONTH_NAMES[viewRight().month]} {viewRight().year}
										</div>
									</Show>
								</div>
								<button
									type="button"
									onClick={nextMonth}
									class="flex h-7 w-7 items-center justify-center rounded-md text-ink-500 hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
									aria-label="Next month"
								>
									<ChevronRight class="h-4 w-4" />
								</button>
							</div>

							{/* Calendars */}
							<div class={cn('flex gap-6', !dual() && 'flex-col')}>
								<MonthGrid
									year={viewLeft().year}
									month={viewLeft().month}
									start={startDate()}
									end={endDate()}
									hover={hover()}
									min={minDate()}
									max={maxDate()}
									onDayClick={handleDayClick}
									onDayHover={setHover}
								/>
								<Show when={dual()}>
									<MonthGrid
										year={viewRight().year}
										month={viewRight().month}
										start={startDate()}
										end={endDate()}
										hover={hover()}
										min={minDate()}
										max={maxDate()}
										onDayClick={handleDayClick}
										onDayHover={setHover}
									/>
								</Show>
							</div>

							{/* Footer */}
							<div class="mt-3 flex items-center justify-between border-t border-surface-border pt-3">
								<div class="text-xs text-ink-400">
									{pickingEnd()
										? 'Now select an end date'
										: (local.start && local.end)
											? displayValue()
											: 'Select a start date'}
								</div>
								<div class="flex gap-2">
									<Show when={clearable() && (local.start || local.end)}>
										<button
											type="button"
											onClick={clearRange}
											class="rounded-md px-2 py-1 text-xs text-ink-500 hover:bg-surface-overlay hover:text-ink-700 transition-colors"
										>
											Clear
										</button>
									</Show>
									<button
										type="button"
										onClick={() => setOpen(false)}
										class="rounded-md px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-500/10 transition-colors"
									>
										Done
									</button>
								</div>
							</div>
						</div>
					</KobaltePopover.Content>
				</KobaltePopover.Portal>
			</KobaltePopover>

			<Show when={local.error || local.helperText}>
				<p
					id={msgId()}
					class={cn(
						'mt-1.5 text-xs',
						hasError() ? 'text-danger-600 dark:text-danger-400' : 'text-ink-500',
					)}
				>
					{local.error ?? local.helperText}
				</p>
			</Show>
		</div>
	)
}
