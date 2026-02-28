import { createSignal, createUniqueId, splitProps, Show, type JSX } from 'solid-js'
import { Check, ChevronDown } from 'lucide-solid'
import { Select as KobalteSelect } from '@kobalte/core/select'
import { cn } from '../../utilities/classNames'

export interface SelectOption {
	value: string
	label: string
	/** Optional icon shown before the label. */
	icon?: JSX.Element
	/** Optional hex or CSS color for a status dot (e.g. #22c55e). When set, a small colored dot is shown before the label; useful for status/state fields. */
	color?: string | null
}

function statusColorStyle(color: string | null | undefined): string | undefined {
	if (color == null || color === '') return undefined
	const t = color.trim()
	if (t.startsWith('#') || t.startsWith('rgb') || /^[a-z]+$/i.test(t)) return t
	return undefined
}

function StatusDot(props: { color?: string | null }) {
	const style = () => {
		const c = statusColorStyle(props.color)
		return c ? { 'background-color': c } : undefined
	}
	return (
		<span
			class="size-2.5 shrink-0 rounded-full border border-ink-200/80 dark:border-ink-600/80"
			classList={{ 'bg-ink-400 dark:bg-ink-500': !statusColorStyle(props.color) }}
			style={style()}
			aria-hidden
		/>
	)
}

export interface SelectProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	label?: string
	error?: string
	helperText?: string
	/** When true, never render label row or error/helper text (control only). */
	bare?: boolean
	required?: boolean
	/** When true, show "optional" on the label row when not required. Default false. */
	optional?: boolean
	options: SelectOption[]
	placeholder?: string
	value?: string
	onValueChange?: (value: string) => void
	onErrorClear?: () => void
	disabled?: boolean
	/** Applied to the root wrapper (label + control + helper/error). Use for layout (e.g. max-w-sm). */
	class?: string
	/** Applied to the trigger element for height/sizing (e.g. min-h-[50px] h-[50px]). */
	triggerClass?: string
	/** When true, use compact trigger height (36px). Default is standard (40px). Aligns with Input, Autocomplete, MultiSelect. */
	compact?: boolean
	/** When true, show a search input in the dropdown to filter options by label. Default false. */
	searchable?: boolean
	/** Ref forwarded to the root wrapper div. */
	ref?: (el: HTMLDivElement) => void
	/** Id for the root wrapper (e.g. for aria-labelledby / label for). */
	id?: string
}

export const Select = (props: SelectProps) => {
	const [local, others] = splitProps(props, [
		'label',
		'error',
		'helperText',
		'bare',
		'required',
		'optional',
		'options',
		'placeholder',
		'value',
		'onValueChange',
		'onErrorClear',
		'disabled',
		'class',
		'triggerClass',
		'compact',
		'searchable',
		'ref',
		'id',
	])
	const [searchQuery, setSearchQuery] = createSignal('')

	const hasError = () => !!local.error
	const uid = createUniqueId()
	const helperId = () => (!local.bare && local.helperText ? `select-${uid}-help` : undefined)
	const errorId = () => (!local.bare && local.error ? `select-${uid}-error` : undefined)
	const describedBy = () => [helperId(), errorId()].filter(Boolean).join(' ') || undefined
	const selectedOption = () =>
		local.value != null && local.value !== ''
			? local.options.find((opt) => opt.value === local.value)
			: undefined

	const filteredOptions = (): SelectOption[] => {
		if (!local.searchable) return local.options
		const q = searchQuery().trim().toLowerCase()
		if (!q) return local.options
		const selected = selectedOption()
		const filtered = local.options.filter((o) => o.label.toLowerCase().includes(q))
		if (selected && !filtered.some((o) => o.value === selected.value))
			return [selected, ...filtered]
		return filtered
	}

	const handleChange = (option: SelectOption | null) => {
		if (local.error && local.onErrorClear) {
			local.onErrorClear()
		}
		local.onValueChange?.(option ? option.value : '')
	}

	let searchInputRef: HTMLInputElement | undefined
	const handleOpenChange = (open: boolean) => {
		if (!open) setSearchQuery('')
		else if (local.searchable) {
			requestAnimationFrame(() => searchInputRef?.focus())
		}
	}

	return (
		<div ref={local.ref} id={local.id} class={cn('w-full', local.class)} {...others}>
			<KobalteSelect<SelectOption>
				value={selectedOption() ?? undefined}
				onChange={handleChange}
				options={filteredOptions()}
				onOpenChange={handleOpenChange}
				optionValue="value"
				optionTextValue="label"
				placeholder={local.placeholder || 'Select an option'}
				disabled={local.disabled}
				validationState={hasError() ? 'invalid' : undefined}
				closeOnSelection={true}
				itemComponent={(itemProps) => (
					<KobalteSelect.Item
						item={itemProps.item}
						class="relative flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer outline-none text-ink-900 dark:text-ink-100 data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-900 dark:data-[highlighted]:bg-primary-500/20 dark:data-[highlighted]:text-primary-200 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
					>
						<KobalteSelect.ItemLabel class="flex-1">
							<span class="flex min-w-0 items-center gap-2">
								<Show when={statusColorStyle(itemProps.item.rawValue.color)}>
									<StatusDot color={itemProps.item.rawValue.color} />
								</Show>
								<Show when={itemProps.item.rawValue.icon}>
									<span class="flex-shrink-0 text-ink-500">{itemProps.item.rawValue.icon}</span>
								</Show>
								<span class="min-w-0 truncate">{itemProps.item.rawValue.label}</span>
							</span>
						</KobalteSelect.ItemLabel>
						<KobalteSelect.ItemIndicator class="inline-flex items-center">
							<Check class="w-4 h-4 text-primary-500" />
						</KobalteSelect.ItemIndicator>
					</KobalteSelect.Item>
				)}
			>
				<Show when={!local.bare && local.label}>
					<div class="flex items-center justify-between mb-2">
						<KobalteSelect.Label class="block text-md font-medium text-ink-700 dark:text-ink-300">
							{local.label}
							<Show when={local.required}>
								<span class="ml-0.5 text-danger-500 dark:text-danger-400" aria-hidden="true">*</span>
							</Show>
						</KobalteSelect.Label>
						<Show when={local.label && !local.required && local.optional}>
							<span class="text-xs text-ink-500 dark:text-ink-400">optional</span>
						</Show>
					</div>
				</Show>

				<div
					class={cn(
						'w-full flex flex-col min-h-0 rounded-lg border transition-all overflow-hidden',
						local.compact ? 'h-[36px]' : 'h-[40px]',
						hasError()
							? 'border-danger-500 focus-within:ring-2 focus-within:ring-danger-500 focus-within:border-transparent'
							: 'border-ink-300 dark:border-ink-800 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent',
						'bg-surface-raised'
					)}
					style="box-sizing: border-box;"
				>
					<KobalteSelect.Trigger
						aria-invalid={hasError() ? 'true' : undefined}
						aria-describedby={describedBy()}
						aria-errormessage={hasError() ? errorId() : undefined}
						class={cn(
							'w-full h-full min-h-0 min-w-0 flex items-center gap-1 rounded-lg transition-all outline-none bg-transparent text-ink-900 dark:text-ink-100 text-left border-0 py-2 focus:ring-0',
							local.compact ? 'px-3 text-sm' : 'px-4 text-base',
							hasError()
								? 'focus:border-transparent'
								: '',
							'disabled:bg-surface-base disabled:text-ink-500 dark:disabled:text-ink-500 disabled:cursor-not-allowed',
							'data-[placeholder-shown]:text-ink-400 dark:data-[placeholder-shown]:text-ink-500',
							local.triggerClass
						)}
					>
						<KobalteSelect.Value<SelectOption> class="min-w-0 flex-1 truncate text-left basis-0">
							{(state) => {
								const opt = state.selectedOption()
								if (!opt) return <span class="truncate">{local.placeholder || 'Select an option'}</span>
								return (
									<span class="min-w-0 flex-1 truncate text-left flex items-center gap-2">
										<Show when={statusColorStyle(opt.color)}>
											<StatusDot color={opt.color} />
										</Show>
										<Show when={opt.icon}>
											<span class="shrink-0 text-ink-500">{opt.icon}</span>
										</Show>
										<span class="min-w-0 truncate">{opt.label}</span>
									</span>
								)
							}}
						</KobalteSelect.Value>
						<KobalteSelect.Icon class="inline-flex shrink-0 w-4 items-center justify-center text-ink-400 dark:text-ink-500">
							<ChevronDown class="h-3.5 w-3.5" aria-hidden="true" />
						</KobalteSelect.Icon>
					</KobalteSelect.Trigger>
				</div>

				<Show when={!local.bare && !hasError() && local.helperText}>
					<KobalteSelect.Description id={helperId()} class="mt-2 text-sm text-ink-500 dark:text-ink-400">
						{local.helperText}
					</KobalteSelect.Description>
				</Show>

				<Show when={!local.bare && hasError()}>
					<KobalteSelect.ErrorMessage id={errorId()} class="mt-2 text-sm text-danger-600">
						{local.error}
					</KobalteSelect.ErrorMessage>
				</Show>

				<KobalteSelect.Portal>
					<KobalteSelect.Content
						class={cn(
							'bg-surface-raised rounded-lg border border-surface-border shadow-lg mt-2 z-[100] flex flex-col max-h-60',
							local.searchable ? 'py-0 overflow-hidden' : 'py-1 overflow-auto',
						)}
					>
						<Show when={local.searchable}>
							<div
								class="shrink-0 border-b border-surface-border p-2"
								onKeyDown={(e) => e.stopPropagation()}
								onPointerDown={(e) => e.stopPropagation()}
								onMouseDown={(e) => e.stopPropagation()}
							>
								<input
									ref={(el) => (searchInputRef = el)}
									type="text"
									value={searchQuery()}
									onInput={(e) => setSearchQuery(e.currentTarget.value)}
									placeholder="Search..."
									class="h-9 w-full rounded-md border border-surface-border bg-surface-raised px-3 py-1.5 text-sm text-ink-900 dark:text-ink-100 placeholder:text-ink-400 dark:placeholder:text-ink-500 outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
								/>
							</div>
						</Show>
						<div class={cn('outline-none min-h-0', local.searchable && 'flex-1 overflow-auto py-1')}>
							<KobalteSelect.Listbox class="outline-none" />
						</div>
					</KobalteSelect.Content>
				</KobalteSelect.Portal>
			</KobalteSelect>
		</div>
	)
}
