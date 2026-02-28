import type { JSX } from 'solid-js'
import { splitProps, Show } from 'solid-js'
import { NumberField as KobalteNumberField } from '@kobalte/core/number-field'
import { ChevronDown, ChevronUp } from 'lucide-solid'
import { cn } from '../lib/cn'

export interface NumberFieldProps {
	/** Label above the input. */
	label?: string
	/** Error message and invalid styling. */
	error?: string
	/** Hint text below the input. */
	helperText?: string
	/** When true, never render label row or error/helper text (control only). */
	bare?: boolean
	/** When true, show required indicator on label. */
	required?: boolean
	/** When true, show "optional" on the label row when not required. Default false. */
	optional?: boolean
	/** Controlled value (number). */
	value?: number
	/** Called when value changes. */
	onChange?: (value: number | undefined) => void
	/** Minimum value. */
	minValue?: number
	/** Maximum value. */
	maxValue?: number
	/** Step for increment/decrement. */
	step?: number
	/** Disables the input and steppers. */
	disabled?: boolean
	/** Placeholder when empty. */
	placeholder?: string
	/** When true, use compact height (36px). Default 40px. */
	compact?: boolean
	/** When true, show increment/decrement buttons. */
	showStepper?: boolean
	/** Additional class for the root. */
	class?: string
	/** Ref forwarded to the number input element. */
	ref?: (el: HTMLInputElement) => void
}

export function NumberField(props: NumberFieldProps) {
	const [local, others] = splitProps(props, [
		'label',
		'error',
		'helperText',
		'bare',
		'required',
		'optional',
		'value',
		'onChange',
		'minValue',
		'maxValue',
		'step',
		'disabled',
		'placeholder',
		'compact',
		'showStepper',
		'class',
		'ref',
	])

	const hasError = () => !!local.error
	const sizeClass = () =>
		local.compact === true
			? 'h-9 min-h-9 py-2 text-sm'
			: 'h-10 min-h-10 py-2 text-base'

	const handleRawValueChange = (v: number | undefined) => {
		local.onChange?.(v)
	}

	return (
		<div class={cn('w-full', local.class)}>
			<KobalteNumberField
				rawValue={local.value}
				onRawValueChange={handleRawValueChange}
				minValue={local.minValue}
				maxValue={local.maxValue}
				step={local.step}
				disabled={local.disabled}
				validationState={hasError() ? 'invalid' : undefined}
				{...others}
			>
				<Show when={!local.bare && local.label}>
					<div class="flex items-center justify-between mb-1.5">
						<KobalteNumberField.Label
							class={cn(
								'block text-md font-medium',
								hasError() ? 'text-danger-600' : 'text-ink-700 dark:text-ink-300'
							)}
						>
							{local.label}
							<Show when={local.required}>
								<span class="text-danger-500 ml-0.5" aria-hidden="true">*</span>
							</Show>
						</KobalteNumberField.Label>
						<Show when={local.label && !local.required && local.optional}>
							<span class="text-xs text-ink-500 dark:text-ink-400">optional</span>
						</Show>
					</div>
				</Show>
				<div class="relative flex items-stretch">
					<KobalteNumberField.Input
						ref={local.ref}
						placeholder={local.placeholder}
						class={cn(
							'w-full rounded-lg transition-all outline-none border text-ink-900 dark:text-ink-100 placeholder:text-ink-400 dark:placeholder:text-ink-500 bg-surface-raised',
							sizeClass(),
							local.showStepper ? 'pl-4 pr-10' : 'px-4',
							hasError()
								? 'border-danger-500 focus:ring-2 focus:ring-inset focus:ring-danger-500 focus:border-transparent'
								: 'border-ink-300 dark:border-ink-800 focus:ring-2 focus:ring-inset focus:ring-primary-500 focus:border-transparent',
							'disabled:bg-surface-base disabled:text-ink-500 dark:disabled:text-ink-500 disabled:cursor-not-allowed'
						)}
					/>
					<Show when={local.showStepper}>
						<div class="absolute right-0 top-0 bottom-0 flex flex-col border-l border-ink-300 dark:border-ink-800 rounded-r-lg overflow-hidden">
							<KobalteNumberField.IncrementTrigger
								class="flex-1 flex items-center justify-center min-h-0 px-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
							>
								<ChevronUp class="h-4 w-4" />
							</KobalteNumberField.IncrementTrigger>
							<KobalteNumberField.DecrementTrigger
								class="flex-1 flex items-center justify-center min-h-0 px-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
							>
								<ChevronDown class="h-4 w-4" />
							</KobalteNumberField.DecrementTrigger>
						</div>
					</Show>
				</div>
				<Show when={!local.bare && !hasError() && local.helperText}>
					<KobalteNumberField.Description class="mt-2 text-sm text-ink-500 dark:text-ink-400">
						{local.helperText}
					</KobalteNumberField.Description>
				</Show>
				<Show when={!local.bare && hasError()}>
					<KobalteNumberField.ErrorMessage class="mt-2 text-sm text-danger-600">
						{local.error}
					</KobalteNumberField.ErrorMessage>
				</Show>
			</KobalteNumberField>
		</div>
	)
}
