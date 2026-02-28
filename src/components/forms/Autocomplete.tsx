/**
 * Autocomplete: text input with a dropdown of suggested options (combobox).
 * Built on Kobalte Combobox. For "free solo" or creatable, use custom options or a creatable pattern in the app layer.
 */
import { createEffect, createMemo, createSignal, Show, splitProps } from 'solid-js'
import { type JSX } from 'solid-js'
import { ChevronDown, X } from 'lucide-solid'
import { Combobox as KobalteCombobox } from '@kobalte/core/combobox'
import { cn } from '../../utilities/classNames'

const autocompleteStyles = `
.torchui-combobox-content {
	transform-origin: var(--kb-combobox-content-transform-origin);
	opacity: 0;
	animation: torchui-combobox-hide 150ms ease-in forwards;
}
.torchui-combobox-content[data-expanded] {
	opacity: 1;
	animation: torchui-combobox-show 150ms ease-out;
}
@keyframes torchui-combobox-show {
	from { opacity: 0; transform: translateY(-8px); }
	to { opacity: 1; transform: translateY(0); }
}
@keyframes torchui-combobox-hide {
	from { opacity: 1; transform: translateY(0); }
	to { opacity: 0; transform: translateY(-8px); }
}
`

let comboboxStylesInjected = false
/** Injects animation styles once. Note: uses inline <style> which requires 'unsafe-inline' in CSP style-src. */
function ensureComboboxStyles() {
	if (comboboxStylesInjected || typeof document === 'undefined') return
	const style = document.createElement('style')
	style.textContent = autocompleteStyles
	document.head.appendChild(style)
	comboboxStylesInjected = true
}

export interface AutocompleteOption {
	value: string
	label: string
	/** When true, option is not selectable. */
	disabled?: boolean
}

export interface AutocompleteProps {
	label?: string
	/** Error message and invalid styling. */
	error?: string
	/** Hint text below the control. */
	helperText?: string
	/** When true, never render label row or error/helper text (control only). */
	bare?: boolean
	/** When true, show required indicator on label. */
	required?: boolean
	/** When true, show "optional" on the label row when not required. Default false. */
	optional?: boolean
	options: AutocompleteOption[]
	placeholder?: string
	value?: string
	onValueChange?: (value: string) => void
	class?: string
	/** Disable the control and input. */
	disabled?: boolean
	/** When true, hide the clear (X) button. */
	disableClearable?: boolean
	/** When true, use compact height (36px). Default is standard (40px). Aligns with Input, Select, MultiSelect. */
	compact?: boolean
	/** Disable specific options. Overrides option.disabled when provided. */
	getOptionDisabled?: (option: AutocompleteOption) => boolean
	/** Custom filter. Receives full options and current input value; return filtered options. Use (x) => x for async (you manage options). */
	filterOptions?: (options: AutocompleteOption[], inputValue: string) => AutocompleteOption[]
	/** Controlled input value (typed text). When provided with onInputChange, enables controlled input for async/search-as-you-type. */
	inputValue?: string
	/** Called when the user types. Use with filterOptions or for controlled input. */
	onInputChange?: (value: string) => void
	/** Custom render for each option. Receives the option; return JSX (e.g. label + description). */
	renderOption?: (option: AutocompleteOption) => JSX.Element
	/** Ref forwarded to the root wrapper div. */
	ref?: (el: HTMLDivElement) => void
}

/** Option shape passed to Combobox when we add disabled from getOptionDisabled. */
type OptionWithDisabled = AutocompleteOption & { disabled?: boolean }

export const Autocomplete = (props: AutocompleteProps) => {
	const [local] = splitProps(props, [
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
		'class',
		'disabled',
		'disableClearable',
		'compact',
		'getOptionDisabled',
		'filterOptions',
		'inputValue',
		'onInputChange',
		'renderOption',
		'ref',
	])
	const hasError = () => !!local.error

	const [inputValueState, setInputValueState] = createSignal('')
	const [dirty, setDirty] = createSignal(false)

	const inputValue = () => local.inputValue ?? inputValueState()

	createEffect(() => {
		if (local.inputValue !== undefined) return
		if (dirty()) return
		const opt = local.options.find((o) => o.value === local.value) ?? null
		setInputValueState(opt?.label ?? '')
	})

	const optionsWithDisabled = (opts: AutocompleteOption[]): OptionWithDisabled[] =>
		local.getOptionDisabled ? opts.map((o) => ({ ...o, disabled: local.getOptionDisabled!(o) })) : opts

	const optionsForRoot = createMemo<OptionWithDisabled[]>(() => {
		let base = local.filterOptions && dirty()
			? local.filterOptions(local.options, inputValue())
			: local.options
		const selected = local.options.find((o) => o.value === local.value)
		if (selected && !base.some((o) => o.value === selected.value)) {
			base = [selected, ...base]
		}
		return optionsWithDisabled(base)
	})

	const selectedOption = createMemo<OptionWithDisabled | null>(() => {
		if (!local.value) return null
		return optionsForRoot().find((o: OptionWithDisabled) => o.value === local.value) ?? null
	})

	const handleChange = (option: OptionWithDisabled | null) => {
		setDirty(false)
		if (!option) {
			if (local.inputValue === undefined) setInputValueState('')
			if (local.value) local.onValueChange?.('')
			return
		}
		local.onValueChange?.(option.value)
		if (local.inputValue === undefined) setInputValueState(option.label)
	}

	const handleInputChange = (value: string) => {
		setDirty(true)
		if (local.inputValue === undefined) setInputValueState(value)
		local.onInputChange?.(value)
		if (value === '') {
			local.onValueChange?.('')
		}
	}

	const handleClear = (e: MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setDirty(false)
		if (local.inputValue === undefined) setInputValueState('')
		local.onInputChange?.('')
		local.onValueChange?.('')
	}

	ensureComboboxStyles()

	const controlSizeClass = () =>
		local.compact === true ? 'h-9 min-h-9 py-2 px-3 text-sm' : 'h-10 min-h-10 py-2 px-4 text-base'

	return (
		<div ref={local.ref} class={cn('w-full', local.class)}>
			<KobalteCombobox<OptionWithDisabled>
				options={optionsForRoot()}
				optionValue="value"
				optionTextValue="label"
				optionLabel="label"
				optionDisabled="disabled"
				value={selectedOption()}
				defaultFilter={local.filterOptions ? undefined : 'contains'}
				triggerMode="input"
				disabled={local.disabled}
				onChange={handleChange}
				onInputChange={handleInputChange}
				itemComponent={(itemProps) => (
					<KobalteCombobox.Item
						item={itemProps.item}
						class="relative flex items-center justify-between px-3 py-2 text-sm text-ink-900 dark:text-ink-100 cursor-pointer outline-none data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-900 dark:data-[highlighted]:bg-primary-500/20 dark:data-[highlighted]:text-primary-200 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
					>
						{local.renderOption ? (
							local.renderOption(itemProps.item.rawValue)
						) : (
							<span>{itemProps.item.rawValue.label}</span>
						)}
					</KobalteCombobox.Item>
				)}
			>
				<KobalteCombobox.HiddenSelect />
				<Show when={!local.bare && local.label}>
					<div class="flex items-center justify-between mb-2">
						<KobalteCombobox.Label class="block text-md font-medium text-ink-700 dark:text-ink-300">
							{local.label}
							<Show when={local.required}>
								<span class="text-danger-500 ml-0.5" aria-hidden="true">*</span>
							</Show>
						</KobalteCombobox.Label>
						<Show when={local.label && !local.required && local.optional}>
							<span class="text-xs text-ink-500 dark:text-ink-400">optional</span>
						</Show>
					</div>
				</Show>
				<KobalteCombobox.Control
					class={cn(
						'w-full flex cursor-pointer items-center justify-between gap-2 rounded-lg transition-colors outline-none text-ink-900 dark:text-ink-100 bg-surface-raised border',
						hasError() ? 'border-danger-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-danger-500' : 'border-ink-300 dark:border-ink-800 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 focus-within:border-transparent',
						controlSizeClass(),
						local.disabled &&
							'cursor-not-allowed bg-surface-base text-ink-500 dark:text-ink-500 pointer-events-none'
					)}
				>
					<KobalteCombobox.Input
						class={cn(
							'flex-1 min-w-0 bg-transparent outline-none text-ink-900 dark:text-ink-100 placeholder:text-ink-400 dark:placeholder:text-ink-500 disabled:cursor-not-allowed',
							local.compact ? 'text-sm' : 'text-base'
						)}
						placeholder={local.placeholder || 'Search...'}
						disabled={local.disabled}
					/>
					<Show when={!local.disableClearable}>
						<button
							type="button"
							aria-label="Clear"
							class={cn(
								'shrink-0 rounded p-0.5 text-ink-400 dark:text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-900 hover:text-ink-600 dark:hover:text-ink-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset',
								!local.value && inputValue().length === 0 && 'invisible'
							)}
							tabIndex={!local.value && inputValue().length === 0 ? -1 : 0}
							onClick={handleClear}
						>
							<X class="h-4 w-4" aria-hidden="true" />
						</button>
					</Show>
					<KobalteCombobox.Trigger
						class="shrink-0 rounded p-0.5 text-ink-400 dark:text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-900 hover:text-ink-600 dark:hover:text-ink-300"
						aria-label="Open options"
					>
						<ChevronDown class="h-4 w-4" aria-hidden="true" />
					</KobalteCombobox.Trigger>
				</KobalteCombobox.Control>
				<Show when={!local.bare && !hasError() && local.helperText}>
					<p class="mt-2 text-sm text-ink-500 dark:text-ink-400">{local.helperText}</p>
				</Show>
				<Show when={!local.bare && hasError()}>
					<p class="mt-2 text-sm text-danger-600">{local.error}</p>
				</Show>

				<KobalteCombobox.Portal>
					<KobalteCombobox.Content class="torchui-combobox-content bg-surface-raised rounded-lg border border-surface-border shadow-lg mt-2 py-1 max-h-60 overflow-auto z-50">
						<KobalteCombobox.Listbox class="outline-none" />
					</KobalteCombobox.Content>
				</KobalteCombobox.Portal>
			</KobalteCombobox>
		</div>
	)
}
