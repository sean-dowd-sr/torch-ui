import type { JSX } from 'solid-js'
import { splitProps, Show } from 'solid-js'
import { Switch as KobalteSwitch } from '@kobalte/core/switch'
import { cn } from '../lib/cn'

export interface SwitchProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
	/** Label text. */
	label?: string
	/** Optional description below the label. */
	description?: string
	/** Error message and invalid styling. */
	error?: string
	/** When true, show required indicator on label. */
	required?: boolean
	/** Controlled checked state. */
	checked?: boolean
	/** Default checked (uncontrolled). */
	defaultChecked?: boolean
	/** Called when checked state changes. */
	onChange?: (checked: boolean) => void
	/** Disables the switch. */
	disabled?: boolean
	/** For form submission when checked (e.g. "on"). */
	value?: string
	/** Form name. */
	name?: string
	/** Additional class for the root wrapper. */
	class?: string
	/** Additional class for the control (track). */
	controlClass?: string
	/** Ref forwarded to the root wrapper div. */
	ref?: (el: HTMLDivElement) => void
}

export function Switch(props: SwitchProps) {
	const [local, others] = splitProps(props, [
		'label',
		'description',
		'error',
		'required',
		'checked',
		'defaultChecked',
		'onChange',
		'disabled',
		'value',
		'name',
		'class',
		'controlClass',
		'ref',
	])

	const hasError = () => !!local.error

	// If there's no visible label, the switch still needs a name.
	const a11yNameOk = () =>
		local.label != null ||
		(others['aria-label'] as string | undefined) != null ||
		(others['aria-labelledby'] as string | undefined) != null ||
		(others['title'] as string | undefined) != null

	if (import.meta.env.DEV && !a11yNameOk()) {
		console.warn('Switch: when label is omitted, provide aria-label, aria-labelledby, or title for accessibility.')
	}

	// Forward "naming" attributes to the actual switch root (not just the wrapper div).
	const switchA11yProps = () => ({
		'aria-label': local.label ? undefined : (others['aria-label'] as string | undefined),
		'aria-labelledby': local.label ? undefined : (others['aria-labelledby'] as string | undefined),
		title: local.label ? undefined : (others['title'] as string | undefined),
	})

	return (
		<div ref={local.ref} class={cn('w-full', local.class)} {...others}>
			<KobalteSwitch
				{...switchA11yProps()}
				checked={local.checked}
				defaultChecked={local.defaultChecked}
				onChange={local.onChange}
				disabled={local.disabled}
				validationState={hasError() ? 'invalid' : undefined}
				name={local.name}
				value={local.value ?? 'on'}
			>
				<div class={cn(local.label ? 'flex items-center justify-between gap-3 mb-1.5' : 'inline-flex items-center gap-2')}>
					<Show when={local.label}>
						<KobalteSwitch.Label
							class={cn(
								'text-sm font-medium cursor-pointer select-none',
								hasError() ? 'text-danger-600' : 'text-ink-700 dark:text-ink-300',
								local.disabled && 'opacity-50 cursor-not-allowed'
							)}
						>
							{local.label}
							<Show when={local.required}>
								<span class="text-danger-500 ml-0.5" aria-hidden="true">*</span>
							</Show>
						</KobalteSwitch.Label>
					</Show>

					<KobalteSwitch.Input class="sr-only" />

					<KobalteSwitch.Control
						class={cn(
							'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
							'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-base',
							'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
							'bg-ink-200 dark:bg-ink-700 data-[checked]:bg-primary-500',
							hasError() && 'border-danger-500 focus:ring-danger-500',
							local.controlClass
						)}
					>
						<KobalteSwitch.Thumb
							class={cn(
								'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform',
								'translate-x-0.5 data-[checked]:translate-x-5'
							)}
						/>
					</KobalteSwitch.Control>
				</div>

				<Show when={local.description && !hasError()}>
					<KobalteSwitch.Description class="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
						{local.description}
					</KobalteSwitch.Description>
				</Show>

				<Show when={hasError()}>
					<KobalteSwitch.ErrorMessage class="mt-1.5 text-sm text-danger-600">
						{local.error}
					</KobalteSwitch.ErrorMessage>
				</Show>
			</KobalteSwitch>
		</div>
	)
}