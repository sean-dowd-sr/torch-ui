import {
	createSignal,
	createMemo,
	Show,
	For,
	splitProps,
	createUniqueId,
} from 'solid-js'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-solid'
import { Popover as KobaltePopover } from '@kobalte/core/popover'
import { cn } from '../../utilities/classNames'

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
	return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function getCalendarDays(year: number, month: number): Date[][] {
	const first = new Date(year, month, 1)
	const last = new Date(year, month + 1, 0)
	const startPad = first.getDay()
	const flat: Date[] = []
	for (let i = 0; i < startPad; i++) flat.push(new Date(year, month, 1 - (startPad - i)))
	for (let d = 1; d <= last.getDate(); d++) flat.push(new Date(year, month, d))
	for (let n = 1; flat.length < 42; n++) flat.push(new Date(year, month + 1, n))
	const grid: Date[][] = []
	for (let r = 0; r < 6; r++) grid.push(flat.slice(r * 7, (r + 1) * 7))
	return grid
}

export function DatePicker(props: DatePickerProps) {
	const [local] = splitProps(props, [
		'value', 'onValueChange', 'placeholder', 'disabled',
		'min', 'max', 'label', 'error', 'helperText', 'bare',
		'required', 'optional', 'class', 'id',
	])

	const generatedId = createUniqueId()
	const inputId = () => local.id || `datepicker-${generatedId}`
	const [open, setOpen] = createSignal(false)

	const valueDate = () => parseDate(local.value ?? '')
	const viewDate = () => valueDate() ?? new Date()

	const [viewMonthYear, setViewMonthYear] = createSignal<{ year: number; month: number } | null>(null)
	const effectiveViewYear = () => viewMonthYear()?.year ?? viewDate().getFullYear()
	const effectiveViewMonth = () => viewMonthYear()?.month ?? viewDate().getMonth()
	const calendarDays = createMemo(() => getCalendarDays(effectiveViewYear(), effectiveViewMonth()))

	type ViewMode = 'calendar' | 'months' | 'years'
	const [viewMode, setViewMode] = createSignal<ViewMode>('calendar')

	const minDate = () => (local.min ? parseDate(local.min) : null)
	const maxDate = () => (local.max ? parseDate(local.max) : null)

	const yearsList = () => {
		const current = effectiveViewYear()
		const minY = minDate()?.getFullYear() ?? current - 20
		const maxY = maxDate()?.getFullYear() ?? current + 5
		return Array.from({ length: maxY - minY + 1 }, (_, i) => minY + i)
	}

	function isDisabled(d: Date): boolean {
		const t = d.getTime()
		if (minDate() && t < minDate()!.getTime()) return true
		if (maxDate() && t > maxDate()!.getTime()) return true
		return false
	}

	function isCurrentMonth(d: Date): boolean {
		return d.getMonth() === effectiveViewMonth() && d.getFullYear() === effectiveViewYear()
	}

	function isSelected(d: Date): boolean {
		return !!local.value && toISODate(d) === local.value
	}

	function selectDate(d: Date) {
		if (isDisabled(d)) return
		local.onValueChange?.(toISODate(d))
		setOpen(false)
	}

	const todayISO = () => toISODate(new Date())
	const todayDisabled = () => isDisabled(new Date())

	function selectToday() {
		if (todayDisabled()) return
		local.onValueChange?.(todayISO())
		setOpen(false)
	}

	function goPrevMonth() {
		const d = new Date(effectiveViewYear(), effectiveViewMonth() - 1, 1)
		setViewMonthYear({ year: d.getFullYear(), month: d.getMonth() })
	}
	function goNextMonth() {
		const d = new Date(effectiveViewYear(), effectiveViewMonth() + 1, 1)
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
		return new Date(effectiveViewYear(), effectiveViewMonth(), 0).getTime() >= mn.getTime()
	}
	const canGoNextMonth = () => {
		const mx = maxDate()
		if (!mx) return true
		return new Date(effectiveViewYear(), effectiveViewMonth() + 1, 1).getTime() <= mx.getTime()
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
		if (mn && new Date(y, m + 1, 0).getTime() < mn.getTime()) return true
		if (mx && new Date(y, m, 1).getTime() > mx.getTime()) return true
		return false
	}

	const displayValue = () => (local.value ? formatDisplay(local.value) : '')
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
					if (next) {
						const d = valueDate() ?? new Date()
						setViewMonthYear({ year: d.getFullYear(), month: d.getMonth() })
					}
					setViewMode('calendar')
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
							displayValue() && !local.disabled && 'pr-8',
						)}
					>
						<CalendarIcon class="h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
						<span class={cn('truncate', displayValue() ? 'text-ink-900' : 'text-ink-400')}>
							{displayValue() || (local.placeholder ?? 'Select date')}
						</span>
					</KobaltePopover.Trigger>
					<Show when={displayValue() && !local.disabled}>
						<button
							type="button"
							onClick={(e) => { e.stopPropagation(); local.onValueChange?.('') }}
							class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-400 hover:text-ink-700 transition-colors"
							aria-label="Clear date"
						>
							<X class="h-3.5 w-3.5" />
						</button>
					</Show>
				</div>

				<KobaltePopover.Portal>
					<KobaltePopover.Content
						role="dialog"
						aria-label="Choose date"
						class={cn(
							'z-50 rounded-xl border border-surface-border bg-surface-raised shadow-xl outline-none',
							'origin-top data-[expanded]:animate-in data-[expanded]:fade-in-0 data-[expanded]:zoom-in-95',
							'data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95',
						)}
					>
						<div class="p-3">
							{/* Header */}
							<div class="flex items-center justify-between gap-2 mb-3">
								{viewMode() !== 'calendar' ? (
									<button
										type="button"
										onClick={() => setViewMode('calendar')}
										class="flex h-7 w-7 items-center justify-center rounded-md text-ink-500 hover:bg-surface-overlay transition-colors"
										aria-label="Back to calendar"
									>
										<ChevronLeft class="h-4 w-4" />
									</button>
								) : (
									<button
										type="button"
										onClick={goPrevMonth}
										disabled={!canGoPrevMonth()}
										class={cn(
											'flex h-7 w-7 items-center justify-center rounded-md text-ink-500 hover:bg-surface-overlay transition-colors',
											!canGoPrevMonth() && 'opacity-30 pointer-events-none',
										)}
										aria-label="Previous month"
									>
										<ChevronLeft class="h-4 w-4" />
									</button>
								)}

								<div class="flex min-w-[140px] items-center justify-center gap-1">
									{viewMode() === 'calendar' && (
										<>
											<button
												type="button"
												onClick={() => setViewMode('months')}
												class="rounded-md px-2 py-1 text-sm font-semibold text-ink-900 hover:bg-surface-overlay transition-colors"
											>
												{MONTH_NAMES[effectiveViewMonth()]}
											</button>
											<button
												type="button"
												onClick={() => setViewMode('years')}
												class="rounded-md px-2 py-1 text-sm font-semibold text-ink-900 hover:bg-surface-overlay transition-colors"
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
													'flex h-7 w-7 items-center justify-center rounded-md text-ink-400 hover:bg-surface-overlay transition-colors',
													!canGoPrevYear() && 'opacity-30 pointer-events-none',
												)}
												aria-label="Previous year"
											>
												<ChevronLeft class="h-4 w-4" />
											</button>
											<button
												type="button"
												onClick={() => setViewMode('years')}
												class="rounded-md px-2 py-1 text-sm font-semibold text-ink-900 hover:bg-surface-overlay transition-colors"
											>
												{effectiveViewYear()}
											</button>
											<button
												type="button"
												onClick={goNextYear}
												disabled={!canGoNextYear()}
												class={cn(
													'flex h-7 w-7 items-center justify-center rounded-md text-ink-400 hover:bg-surface-overlay transition-colors',
													!canGoNextYear() && 'opacity-30 pointer-events-none',
												)}
												aria-label="Next year"
											>
												<ChevronRight class="h-4 w-4" />
											</button>
										</>
									)}
									{viewMode() === 'years' && (
										<span class="text-sm font-semibold text-ink-900">Select year</span>
									)}
								</div>

								{viewMode() !== 'calendar' ? (
									<div class="w-7" aria-hidden />
								) : (
									<button
										type="button"
										onClick={goNextMonth}
										disabled={!canGoNextMonth()}
										class={cn(
											'flex h-7 w-7 items-center justify-center rounded-md text-ink-500 hover:bg-surface-overlay transition-colors',
											!canGoNextMonth() && 'opacity-30 pointer-events-none',
										)}
										aria-label="Next month"
									>
										<ChevronRight class="h-4 w-4" />
									</button>
								)}
							</div>

							{/* Calendar grid */}
							<Show when={viewMode() === 'calendar'}>
								<div>
									<div class="grid grid-cols-7 mb-2">
										<For each={DAY_NAMES}>
											{(name) => (
												<div class="py-1 text-center text-xs font-medium text-ink-400">{name}</div>
											)}
										</For>
									</div>
									<For each={calendarDays()}>
										{(week) => (
											<div class="grid grid-cols-7">
												<For each={week}>
													{(d) => {
														const disabled = isDisabled(d)
														const currentMonth = isCurrentMonth(d)
														const selected = isSelected(d)
														const isToday = toISODate(d) === todayISO()
														return (
															<div class="relative h-8 flex items-center justify-center">
																<button
																	type="button"
																	disabled={disabled}
																	onClick={() => selectDate(d)}
																	aria-label={d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
																	aria-current={selected ? 'date' : undefined}
																	class={cn(
																		'relative z-10 h-7 w-7 rounded-full text-xs transition-colors',
																		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50',
																		selected
																			? 'bg-primary-500 text-white font-semibold hover:bg-primary-600'
																			: !currentMonth
																				? 'text-ink-300 dark:text-ink-600 hover:bg-surface-overlay'
																				: isToday
																					? 'text-primary-600 font-semibold hover:bg-surface-overlay dark:text-primary-400'
																					: 'text-ink-800 dark:text-ink-200 hover:bg-surface-overlay',
																		disabled && 'cursor-not-allowed opacity-30',
																	)}
																>
																	{d.getDate()}
																	{isToday && !selected && (
																		<span class="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-500" />
																	)}
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

							{/* Month picker */}
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
														? 'text-ink-300 opacity-50 cursor-not-allowed'
														: m() === effectiveViewMonth()
															? 'bg-primary-500 text-white'
															: 'text-ink-700 hover:bg-surface-overlay',
												)}
											>
												{name}
											</button>
										)}
									</For>
								</div>
							</Show>

							{/* Year picker */}
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
														: 'text-ink-700 hover:bg-surface-overlay',
												)}
											>
												{y}
											</button>
										)}
									</For>
								</div>
							</Show>

							{/* Footer */}
							<div class="mt-3 flex items-center justify-between border-t border-surface-border pt-3">
								<div class="text-xs text-ink-400">{displayValue() || 'No date selected'}</div>
								<div class="flex gap-2">
									<Show when={displayValue()}>
										<button
											type="button"
											onClick={() => { local.onValueChange?.(''); setOpen(false) }}
											class="rounded-md px-2 py-1 text-xs text-ink-500 hover:bg-surface-overlay hover:text-ink-700 transition-colors"
										>
											Clear
										</button>
									</Show>
									<button
										type="button"
										disabled={todayDisabled()}
										onClick={selectToday}
										class={cn(
											'rounded-md px-2 py-1 text-xs font-medium transition-colors',
											todayDisabled()
												? 'cursor-not-allowed text-ink-300'
												: 'text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-500/10',
										)}
									>
										Today
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
					class={cn('mt-1.5 text-xs', hasError() ? 'text-danger-600 dark:text-danger-400' : 'text-ink-500')}
				>
					{local.error ?? local.helperText}
				</p>
			</Show>
		</div>
	)
}
