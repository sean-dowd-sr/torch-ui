import { For, splitProps, Show } from 'solid-js'
import { RadioGroup as KobalteRadioGroup } from '@kobalte/core/radio-group'
import { cn } from '../lib/cn'

export interface RadioGroupOption {
	value: string
	label: string
	/** Optional description for the option. */
	description?: string
}

export interface RadioGroupProps {
	/** Group label (e.g. "Choose one"). */
	label?: string
	/** Optional description below the label. */
	description?: string
	/** Error message and invalid styling. */
	error?: string
	/** When true, show required indicator on label. */
	required?: boolean
	/** Options to display (value + label, optional description). */
	options: RadioGroupOption[]
	/** Selected value (controlled). */
	value?: string
	/** Called when selection changes. */
	onChange?: (value: string) => void
	/** Disables all options. */
	disabled?: boolean
	/** Form name. */
	name?: string
	/** Layout: vertical list (default) or horizontal. */
	orientation?: 'vertical' | 'horizontal'
	/** Additional class for the root. */
	class?: string
}

export function RadioGroup(props: RadioGroupProps) {
	const [local, others] = splitProps(props, [
		'label',
		'description',
		'error',
		'required',
		'options',
		'value',
		'onChange',
		'disabled',
		'name',
		'orientation',
		'class',
	])

	const hasError = () => !!local.error

	return (
		<div class={cn('w-full', local.class)}>
			<KobalteRadioGroup
				value={local.value}
				onChange={local.onChange}
				disabled={local.disabled}
				validationState={hasError() ? 'invalid' : undefined}
				name={local.name}
				orientation={local.orientation ?? 'vertical'}
				{...others}
			>
				<Show when={local.label}>
					<KobalteRadioGroup.Label
						class={cn(
							'block text-md font-medium mb-2',
							hasError() ? 'text-danger-600' : 'text-ink-700 dark:text-ink-300',
							local.disabled && 'opacity-50'
						)}
					>
						{local.label}
						{local.required && <span class="text-danger-500 ml-0.5" aria-hidden="true">*</span>}
					</KobalteRadioGroup.Label>
				</Show>
				<div
					role="presentation"
					class={cn(
						'flex gap-3',
						local.orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'
					)}
				>
					<For each={local.options}>
						{(opt) => (
							<KobalteRadioGroup.Item
								value={opt.value}
								class={cn(
									'inline-flex items-start gap-3 cursor-pointer select-none rounded-lg border border-transparent p-3 transition-colors outline-none',
									'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
									'data-[highlighted]:bg-ink-50 dark:data-[highlighted]:bg-ink-800/50',
									'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'
								)}
							>
								<KobalteRadioGroup.ItemInput class="sr-only" />
								<KobalteRadioGroup.ItemControl
									class={cn(
										'mt-0.5 h-4 w-4 shrink-0 rounded-full flex items-center justify-center transition-colors box-border',
										// Unselected: gray ring, transparent interior
										'border-2 border-ink-400 dark:border-ink-500 bg-transparent',
										// Selected: primary ring, transparent interior; dot is the ItemIndicator
										'data-[checked]:border-primary-500 data-[checked]:bg-transparent',
										'data-[disabled]:opacity-50'
									)}
								>
									<KobalteRadioGroup.ItemIndicator class="h-2 w-2 rounded-full bg-primary-500 shrink-0 pointer-events-none" />
								</KobalteRadioGroup.ItemControl>
								<span class="flex flex-col gap-0.5">
									<KobalteRadioGroup.ItemLabel class="text-sm font-medium text-ink-900 dark:text-ink-100">
										{opt.label}
									</KobalteRadioGroup.ItemLabel>
									<Show when={opt.description}>
										<KobalteRadioGroup.ItemDescription class="text-xs text-ink-500 dark:text-ink-400">
											{opt.description}
										</KobalteRadioGroup.ItemDescription>
									</Show>
								</span>
							</KobalteRadioGroup.Item>
						)}
					</For>
				</div>
				<Show when={local.description && !hasError()}>
					<KobalteRadioGroup.Description class="mt-2 text-sm text-ink-500 dark:text-ink-400">
						{local.description}
					</KobalteRadioGroup.Description>
				</Show>
				<Show when={hasError()}>
					<KobalteRadioGroup.ErrorMessage class="mt-2 text-sm text-danger-600">
						{local.error}
					</KobalteRadioGroup.ErrorMessage>
				</Show>
			</KobalteRadioGroup>
		</div>
	)
}
