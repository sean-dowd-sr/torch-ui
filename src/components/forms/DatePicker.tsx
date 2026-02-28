import {
	createSignal,
	Show,
	For,
	splitProps,
	createUniqueId,
} from 'solid-js'
import { Calendar as CalendarIcon } from 'lucide-solid'
import * as Popover from '@kobalte/core/popover'
import { cn } from '../lib/cn'

/** Value is ISO date string YYYY-MM-DD or empty string. */
export interface DatePickerProps {
	value?: string
	onValueChange?: (value: string) => void
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
	/** When true, show "optional" on the label row when not required. Default false. */
	optional?: boolean
	class?: string
	id?: string
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
	return d.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})
}

/** Returns 6 rows × 7 days. Days before the first of the month are prev month; after last are next month. */
function getCalendarDays(year: number, month: number): Date[][] {
	const first = new Date(year, month, 1)
	const last = new Date(year, month + 1, 0)
	const startPad = first.getDay()
	const endDay = last.getDate()
	const flat: Date[] = []
	// Prev month padding
	for (let i = 0; i < startPad; i++) {
		flat.push(new Date(year, month, 1 - (startPad - i)))
	}
	// This month
	for (let d = 1; d <= endDay; d++) {
		flat.push(new Date(year, month, d))
	}
	// Next month padding to fill 6×7 = 42
	for (let n = 1; flat.length < 42; n++) {
		flat.push(new Date(year, month + 1, n))
	}
	const grid: Date[][] = []
	for (let r = 0; r < 6; r++) {
		grid.push(flat.slice(r * 7, (r + 1) * 7))
	}
	return grid
}

export function DatePicker(props: DatePickerProps) {
	const [local, others] = splitProps(props, [
		'value',
		'onValueChange',
		'placeholder',
		'disabled',
		'min',
		'max',
		'label',
		'error',
		'helperText',
		'bare',
		'required',
		'optional',
		'class',
		'id',
	])

	const generatedId = createUniqueId()
	const inputId = () => local.id || `datepicker-${generatedId}`
	const [open, setOpen] = createSignal(false)

	const valueDate = () => parseDate(local.value ?? '')
	const viewDate = () => valueDate() ?? new Date()

	const [viewMonthYear, setViewMonthYear] = createSignal<{ year: number; month: number } | null>(null)
	const effectiveViewYear = () => viewMonthYear()?.year ?? viewDate().getFullYear()
	const effectiveViewMonth = () => viewMonthYear()?.month ?? viewDate().getMonth()
	const calendarDaysEffective = () => getCalendarDays(effectiveViewYear(), effectiveViewMonth())

	type ViewMode = 'calendar' | 'months' | 'years'
	const [viewMode, setViewMode] = createSignal<ViewMode>('calendar')

	const minDate = () => (local.min ? parseDate(local.min) : null)
	const maxDate = () => (local.max ? parseDate(local.max) : null)

	// Year range for year picker (respect min/max if set)
	const yearRange = () => {
		const current = effectiveViewYear()
		const minY = minDate()?.getFullYear() ?? current - 20
		const maxY = maxDate()?.getFullYear() ?? current + 5
		return { min: minY, max: maxY }
	}
	const yearsList = () => {
		const { min, max } = yearRange()
		return Array.from({ length: max - min + 1 }, (_, i) => min + i)
	}

	function isDisabled(d: Date): boolean {
		const time = d.getTime()
		if (minDate() && time < minDate()!.getTime()) return true
		if (maxDate() && time > maxDate()!.getTime()) return true
		return false
	}

	function isCurrentMonth(d: Date): boolean {
		return d.getMonth() === effectiveViewMonth() && d.getFullYear() === effectiveViewYear()
	}

	function isSelected(d: Date): boolean {
		if (!local.value) return false
		return toISODate(d) === local.value
	}

	function selectDate(d: Date) {
		if (isDisabled(d)) return
		local.onValueChange?.(toISODate(d))
		setOpen(false)
	}

	const today = () => new Date()
	const todayDisabled = () => isDisabled(today())
	function selectToday() {
		if (todayDisabled()) return
		local.onValueChange?.(toISODate(today()))
		setOpen(false)
	}

	function goPrevMonthEffective() {
		const y = effectiveViewYear()
		const m = effectiveViewMonth()
		const d = new Date(y, m - 1, 1)
		setViewMonthYear({ year: d.getFullYear(), month: d.getMonth() })
	}
	function goNextMonthEffective() {
		const y = effectiveViewYear()
		const m = effectiveViewMonth()
		const d = new Date(y, m + 1, 1)
		setViewMonthYear({ year: d.getFullYear(), month: d.getMonth() })
	}
	function goPrevYear() {
		setViewMonthYear({ year: effectiveViewYear() - 1, month: effectiveViewMonth() })
	}
	function goNextYear() {
		setViewMonthYear({ year: effectiveViewYear() + 1, month: effectiveViewMonth() })
	}
	function setMonth(m: number) {
		setViewMonthYear({ year: effectiveViewYear(), month: m })
		setViewMode('calendar')
	}
	function setYear(y: number) {
		setViewMonthYear({ year: y, month: effectiveViewMonth() })
		setViewMode('calendar')
	}

	const canGoPrevMonth = () => {
		const mn = minDate()
		if (!mn) return true
		// Last day of prev month must be >= min
		const lastOfPrev = new Date(effectiveViewYear(), effectiveViewMonth(), 0)
		return lastOfPrev.getTime() >= mn.getTime()
	}
	const canGoNextMonth = () => {
		const mx = maxDate()
		if (!mx) return true
		// First day of next month must be <= max
		const firstOfNext = new Date(effectiveViewYear(), effectiveViewMonth() + 1, 1)
		return firstOfNext.getTime() <= mx.getTime()
	}
	const canGoPrevYear = () => {
		const mn = minDate()
		if (!mn) return true
		return effectiveViewYear() > mn.getFullYear()
	}
	const canGoNextYear = () => {
		const mx = maxDate()
		if (!mx) return true
		return effectiveViewYear() < mx.getFullYear()
	}

	const isMonthDisabled = (m: number) => {
		const y = effectiveViewYear()
		const mn = minDate()
		const mx = maxDate()
		if (mn) {
			// Last day of this month must be >= min
			const lastDay = new Date(y, m + 1, 0)
			if (lastDay.getTime() < mn.getTime()) return true
		}
		if (mx) {
			// First day of this month must be <= max
			const firstDay = new Date(y, m, 1)
			if (firstDay.getTime() > mx.getTime()) return true
		}
		return false
	}

	const displayValue = () => (local.value ? formatDisplay(local.value) : '')

	const hasError = () => !!local.error
	const contentId = `${inputId()}-calendar`
	const msgId = () => (local.error || local.helperText) ? `${inputId()}-msg` : undefined
	const describedBy = () => {
		const user = (others as Record<string, unknown>)['aria-describedby'] as string | undefined
		const own = msgId()
		return user && own ? `${user} ${own}` : (user ?? own)
	}

	return (
		<div class={cn('w-full', local.class)}>
			<Show when={!local.bare && local.label}>
				<div class="flex items-center justify-between mb-2">
					<label
						for={inputId()}
						class={cn(
							'block text-md font-medium',
							hasError() ? 'text-danger-600 dark:text-danger-400' : 'text-ink-700 dark:text-ink-300'
						)}
					>
						{local.label}
					</label>
					<Show when={!local.required && local.optional}>
						<span class="text-xs text-ink-500 dark:text-ink-400">optional</span>
					</Show>
				</div>
			</Show>

			<Popover.Root
				open={open()}
				onOpenChange={(next) => {
					setOpen(next)
					if (next) {
						const d = valueDate() ?? new Date()
						setViewMonthYear({ year: d.getFullYear(), month: d.getMonth() })
					}
					setViewMode('calendar')
				}}
				gutter={8}
				sameWidth
			>
				<Popover.Trigger
					as="button"
					type="button"
					aria-haspopup="dialog"
					aria-expanded={open()}
					aria-controls={contentId}
					aria-invalid={hasError() ? 'true' : undefined}
					aria-describedby={describedBy()}
					aria-label={local.label ?? 'Select date'}
					disabled={local.disabled}
					class={cn(
						'w-full flex flex-col min-h-0 rounded-lg border transition-all overflow-hidden cursor-pointer',
						'h-[40px]',
						hasError()
							? 'border-danger-500'
							: 'border-ink-300 dark:border-ink-800',
						'bg-surface-raised',
						'focus:outline-none focus:ring-2 focus:ring-inset',
						hasError() ? 'focus:ring-danger-500' : 'focus:ring-primary-500',
						local.disabled && 'cursor-not-allowed opacity-50',
					)}
				>
					<div class="relative flex h-full w-full items-center">
						<input
							id={inputId()}
							type="text"
							readOnly
							tabIndex={-1}
							aria-hidden="true"
							value={displayValue()}
							placeholder={local.placeholder ?? 'Select date'}
							disabled={local.disabled}
							class={cn(
								'w-full h-full min-h-0 min-w-0 rounded-lg border-0 bg-transparent py-2 pl-4 pr-10 text-base text-left outline-none transition-all pointer-events-none',
								'text-ink-900 dark:text-ink-100 placeholder:text-ink-400 dark:placeholder:text-ink-500',
							)}
						/>
						<div
							class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-400 dark:text-ink-500"
							aria-hidden="true"
						>
							<CalendarIcon class="h-5 w-5" />
						</div>
					</div>
				</Popover.Trigger>

				<Popover.Portal>
					<Popover.Content
						id={contentId}
						role="dialog"
						aria-modal="true"
						aria-label="Choose date"
						class="z-[100] mt-2 min-w-0 rounded-xl border border-surface-border bg-surface-raised p-4 shadow-lg outline-none"
					>
						{/* Header: back (when in month/year picker), prev/next, and clickable month/year */}
						<div class="flex items-center justify-between gap-2 mb-3">
							{viewMode() !== 'calendar' ? (
								<button
									type="button"
									onClick={() => setViewMode('calendar')}
									class="p-2 rounded-lg text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-200 hover:text-ink-700 dark:hover:text-ink-200"
									aria-label="Back to calendar"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
									</svg>
								</button>
							) : (
								<button
									type="button"
									onClick={goPrevMonthEffective}
									disabled={!canGoPrevMonth()}
									class={cn(
										'p-2 rounded-lg text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-200 hover:text-ink-700 dark:hover:text-ink-200',
										!canGoPrevMonth() && 'opacity-30 pointer-events-none'
									)}
									aria-label="Previous month"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
									</svg>
								</button>
							)}
							<div class="flex min-w-[140px] items-center justify-center gap-1">
								{viewMode() === 'calendar' && (
									<>
										<button
											type="button"
											onClick={() => setViewMode('months')}
											class="rounded-lg px-2 py-1 text-sm font-semibold text-ink-900 dark:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-200"
										>
											{MONTH_NAMES[effectiveViewMonth()]}
										</button>
										<button
											type="button"
											onClick={() => setViewMode('years')}
											class="rounded-lg px-2 py-1 text-sm font-semibold text-ink-900 dark:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-200"
										>
											{effectiveViewYear()}
										</button>
									</>
								)}
								{viewMode() === 'months' && (
									<>
										<button
											type="button"
											onClick={goPrevYear}
											disabled={!canGoPrevYear()}
											class={cn(
												'p-1 rounded text-ink-400 dark:text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-200 hover:text-ink-600 dark:hover:text-ink-300',
												!canGoPrevYear() && 'opacity-30 pointer-events-none'
											)}
											aria-label="Previous year"
										>
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
											</svg>
										</button>
										<button
											type="button"
											onClick={() => setViewMode('years')}
											class="rounded-lg px-2 py-1 text-sm font-semibold text-ink-900 dark:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-200"
										>
											{effectiveViewYear()}
										</button>
										<button
											type="button"
											onClick={goNextYear}
											disabled={!canGoNextYear()}
											class={cn(
												'p-1 rounded text-ink-400 dark:text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-200 hover:text-ink-600 dark:hover:text-ink-300',
												!canGoNextYear() && 'opacity-30 pointer-events-none'
											)}
											aria-label="Next year"
										>
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
											</svg>
										</button>
									</>
								)}
								{viewMode() === 'years' && (
									<span class="text-sm font-semibold text-ink-900 dark:text-ink-100">Select year</span>
								)}
							</div>
							{viewMode() !== 'calendar' ? (
								<div class="w-9" aria-hidden />
							) : (
								<button
									type="button"
									onClick={goNextMonthEffective}
									disabled={!canGoNextMonth()}
									class={cn(
										'p-2 rounded-lg text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-200 hover:text-ink-700 dark:hover:text-ink-200',
										!canGoNextMonth() && 'opacity-30 pointer-events-none'
									)}
									aria-label="Next month"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
									</svg>
								</button>
							)}
						</div>

						<Show when={viewMode() === 'calendar'} fallback={null}>
							<div role="grid" aria-label={`${MONTH_NAMES[effectiveViewMonth()]} ${effectiveViewYear()}`}>
								<div role="row" class="grid grid-cols-7 gap-0.5 mb-2">
									<For each={DAY_NAMES}>
										{(name) => (
											<div role="columnheader" class="py-1.5 text-center text-xs font-medium text-ink-500 dark:text-ink-400">
												{name}
											</div>
										)}
									</For>
								</div>
								<For each={calendarDaysEffective()}>
									{(week) => (
										<div role="row" class="grid grid-cols-7 gap-0.5">
											<For each={week}>
												{(d) => {
													const disabled = isDisabled(d)
													const currentMonth = isCurrentMonth(d)
													const selected = isSelected(d)
													return (
														<div role="gridcell">
															<button
																type="button"
																disabled={disabled}
																onClick={() => selectDate(d)}
																aria-label={d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
																aria-current={selected ? 'date' : undefined}
																class={cn(
																	'h-9 w-9 rounded-lg text-sm transition-colors',
																	!currentMonth && 'text-ink-400 dark:text-ink-500',
																	currentMonth && 'text-ink-900 dark:text-ink-100',
																	disabled && 'cursor-not-allowed opacity-40',
																	!disabled && currentMonth && 'hover:bg-ink-100 dark:hover:bg-ink-200',
																	selected && 'bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600'
																)}
															>
																{d.getDate()}
															</button>
														</div>
													)
												}}
											</For>
										</div>
									)}
								</For>
							</div>
						</Show>

						<Show when={viewMode() === 'months'}>
							<div class="grid grid-cols-3 gap-1">
								<For each={MONTH_NAMES}>
									{(name, m) => (
										<button
											type="button"
											onClick={() => setMonth(m())}
											disabled={isMonthDisabled(m())}
											class={cn(
												'rounded-lg py-2 text-sm font-medium transition-colors',
												isMonthDisabled(m())
													? 'text-ink-300 dark:text-ink-600 opacity-50 cursor-not-allowed'
													: m() === effectiveViewMonth()
														? 'bg-primary-500 text-white'
														: 'text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-200',
											)}
										>
											{name}
										</button>
									)}
								</For>
							</div>
						</Show>

						<Show when={viewMode() === 'years'}>
							<div class="grid max-h-48 grid-cols-4 gap-1 overflow-y-auto">
								<For each={yearsList()}>
									{(y) => (
										<button
											type="button"
											onClick={() => setYear(y)}
											class={cn(
												'rounded-lg py-2 text-sm font-medium transition-colors',
												y === effectiveViewYear()
													? 'bg-primary-500 text-white'
													: 'text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-200',
											)}
										>
											{y}
										</button>
									)}
								</For>
							</div>
						</Show>

						<div class="mt-3 pt-3 border-t border-surface-border">
							<button
								type="button"
								disabled={todayDisabled()}
								onClick={selectToday}
								class={cn(
									'w-full rounded-lg py-2 text-sm font-medium transition-colors',
									todayDisabled()
										? 'cursor-not-allowed bg-ink-100 dark:bg-ink-800 text-ink-400 dark:text-ink-500'
										: 'bg-transparent text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/20',
								)}
							>
								Today
							</button>
						</div>
					</Popover.Content>
				</Popover.Portal>
			</Popover.Root>

			<Show when={!local.bare && (local.error || local.helperText)}>
				<p
					id={msgId()}
					role={local.error ? 'alert' : undefined}
					class={cn('mt-2 text-sm', hasError() ? 'text-danger-600 dark:text-danger-400' : 'text-ink-500 dark:text-ink-400')}
				>
					{local.error || local.helperText}
				</p>
			</Show>
		</div>
	)
}
