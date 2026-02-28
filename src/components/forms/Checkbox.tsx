import { type JSX, splitProps, Show } from 'solid-js'
import { Checkbox as KobalteCheckbox } from '@kobalte/core/checkbox'
import { cn } from '../lib/cn'

export type CheckboxSize = 'sm' | 'md'

export interface CheckboxProps extends Omit<JSX.HTMLAttributes<HTMLInputElement>, 'onChange'> {
	/** Label text (or use children). */
	label?: string
	/** Error message shown below the checkbox. */
	error?: string
	/** Hint text below the checkbox. */
	helperText?: string
	/** When true, never render label row or error/helper text (checkbox only). */
	bare?: boolean
	/** When true, show as required (e.g. asterisk). */
	required?: boolean
	/** When true, show "optional" on the label row when not required. Default false. */
	optional?: boolean
	/** When true, use smaller label text and optional tighter spacing. */
	compact?: boolean
	/** Controlled checked state. */
	checked?: boolean
	/** Controlled change handler. Receives the new checked boolean. */
	onChange?: (checked: boolean) => void
	/** Visual size. */
	size?: CheckboxSize
	/** Indeterminate state (e.g. parent when some children selected). */
	indeterminate?: boolean
	/** Disable the checkbox. */
	disabled?: boolean
	class?: string
	id?: string
	/** Form field name. */
	name?: string
	/** Form field value. */
	value?: string
	children?: JSX.Element
}

const sizeClasses: Record<CheckboxSize, string> = {
	sm: 'h-3.5 w-3.5',
	md: 'h-4 w-4',
}

export function Checkbox(props: CheckboxProps) {
	const [local, others] = splitProps(props, [
		'label',
		'error',
		'helperText',
		'bare',
		'required',
		'optional',
		'compact',
		'checked',
		'onChange',
		'size',
		'indeterminate',
		'class',
		'id',
		'disabled',
		'children',
		'name',
		'value',
	])

	if (import.meta.env.DEV && local.bare) {
		if (
			others['aria-label'] == null &&
			others['aria-labelledby'] == null &&
			others['title'] == null
		) {
			console.warn('Checkbox: bare mode requires aria-label, aria-labelledby, or title for accessibility.')
		}
	}

	const hasError = () => !!local.error
	const size = () => local.size ?? 'md'
	const iconSize = () => size() === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'

	return (
		<KobalteCheckbox
			checked={local.checked}
			onChange={(v) => local.onChange?.(v === true)}
			indeterminate={local.indeterminate}
			validationState={hasError() ? 'invalid' : undefined}
			required={local.required}
			disabled={local.disabled}
			name={local.name}
			value={local.value}
			id={local.id}
			class={cn('w-full', local.class)}
		>
			<div
				class={cn(
					'inline-flex items-center select-none',
					local.compact ? 'gap-1.5' : 'gap-2',
					local.disabled && 'opacity-50',
					hasError() && 'text-danger-600',
				)}
			>
				<KobalteCheckbox.Input {...others} />
				<KobalteCheckbox.Control
					class={cn(
						'relative inline-flex shrink-0 items-center justify-center rounded border cursor-pointer',
						sizeClasses[size()],
						'bg-surface-raised border-ink-300 dark:border-ink-500',
						'data-[checked]:border-primary-500 data-[checked]:bg-primary-500 dark:data-[checked]:border-primary-400 dark:data-[checked]:bg-primary-500',
						'data-[indeterminate]:border-primary-500 data-[indeterminate]:bg-primary-500 dark:data-[indeterminate]:border-primary-400 dark:data-[indeterminate]:bg-primary-500',
						hasError() && 'border-danger-500 dark:border-danger-500',
						local.disabled && 'cursor-not-allowed',
					)}
				>
					<KobalteCheckbox.Indicator class="absolute inset-0 flex items-center justify-center text-white">
						<Show
							when={!local.indeterminate}
							fallback={
								<svg class={iconSize()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<line x1="4" y1="12" x2="20" y2="12" />
								</svg>
							}
						>
							<svg class={iconSize()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<polyline points="20 6 9 17 4 12" />
							</svg>
						</Show>
					</KobalteCheckbox.Indicator>
				</KobalteCheckbox.Control>
				<Show when={!local.bare && (local.label ?? local.children)}>
					<KobalteCheckbox.Label class={cn('text-ink-700 dark:text-ink-300 cursor-pointer', local.compact ? 'text-xs' : 'text-sm', local.disabled && 'cursor-not-allowed')}>
						{local.label ?? local.children}
						<Show when={local.required}>
							<span class="text-danger-500 ml-0.5" aria-hidden="true">*</span>
						</Show>
						<Show when={!local.required && local.optional}>
							<span class="text-xs text-ink-500 dark:text-ink-400 ml-1">optional</span>
						</Show>
					</KobalteCheckbox.Label>
				</Show>
			</div>

			<Show when={!local.bare && local.helperText && !hasError()}>
				<KobalteCheckbox.Description class="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
					{local.helperText}
				</KobalteCheckbox.Description>
			</Show>

			<Show when={!local.bare && local.error}>
				<KobalteCheckbox.ErrorMessage class="mt-1.5 text-sm text-danger-600">
					{local.error}
				</KobalteCheckbox.ErrorMessage>
			</Show>
		</KobalteCheckbox>
	)
}
