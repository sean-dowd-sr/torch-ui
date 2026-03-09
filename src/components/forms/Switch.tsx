import type { JSX } from 'solid-js'
import { createEffect, createSignal, splitProps, Show, on } from 'solid-js'







import { Switch as KobalteSwitch } from '@kobalte/core/switch'
import { cn } from '../../utilities/classNames'
import { type ComponentSize } from '../../types/component-size'

export interface SwitchProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange' | 'onValueChange'> {
	/** Label text. */
	label?: string
	/** Visual style variant. */
	variant?: 'default' | 'icon'
	/** Icon to render inside the thumb when unchecked (icon variant). */
	thumbOffIcon?: JSX.Element
	/** Icon to render inside the thumb when checked (icon variant). */
	thumbOnIcon?: JSX.Element
	/** Track color when unchecked. Accepts any CSS color string (e.g. 'rebeccapurple', '#fff', 'var(--color-surface-dim)'). */
	trackColor?: string
	/** Track color when checked. Accepts any CSS color string (e.g. 'var(--color-primary-500)'). */
	trackCheckedColor?: string
	/** Hint text below the control. */
	helperText?: string
	/** Error message and invalid styling. */
	error?: string
	/** When true, never render label row or error/helper text (control only). */
	bare?: boolean
	/** When true, show required indicator on label. */
	required?: boolean
	/** When true, show "optional" on the label row when not required. Default false. */
	optional?: boolean
	/** Controlled checked state. */
	checked?: boolean
	/** Default checked (uncontrolled). */
	defaultChecked?: boolean
	/** Called when checked state changes. */
	onValueChange?: (checked: boolean) => void
	/** Called when the user interacts with the control while an error is shown, allowing the parent to clear the error. */
	onErrorClear?: () => void
	/** Disables the switch. */
	disabled?: boolean
	/** For form submission when checked (e.g. "on"). */
	value?: string
	/** Form name. */
	name?: string
	/** Component size. Default 'md'. */
	size?: ComponentSize
	/** When true, the root wrapper uses full width. Default true. */
	fullWidth?: boolean
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
		'variant',
		'thumbOffIcon',
		'thumbOnIcon',
		'trackColor',
		'trackCheckedColor',
		'helperText',
		'error',
		'bare',
		'required',
		'optional',
		'checked',
		'defaultChecked',
		'onValueChange',
		'onErrorClear',
		'disabled',
		'value',
		'name',
		'size',
		'fullWidth',
		'class',
		'controlClass',
		'ref',
	])

	const hasError = () => !!local.error
	const iconVariant = () => local.variant === 'icon'
	const [isChecked, setIsChecked] = createSignal(!!(local.checked ?? local.defaultChecked))

	// Keep internal state in sync with controlled usage.
	// defer: true — skip initial run since the signal is already initialized above.
	createEffect(on(() => local.checked, (checked) => {
		if (checked !== undefined) setIsChecked(!!checked)
	}, { defer: true }))

	const trackStyle = () => {
		if (!local.trackColor && !local.trackCheckedColor) return undefined
		const bg = isChecked() ? (local.trackCheckedColor ?? local.trackColor) : local.trackColor
		return bg ? ({ 'background-color': bg } satisfies JSX.CSSProperties) : undefined
	}

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
		<div
			ref={local.ref}
			class={cn(local.fullWidth === false ? 'w-auto' : 'w-full', local.class)}
			{...others}
		>
			<KobalteSwitch
				class={!local.label ? 'flex items-center' : undefined}
				{...switchA11yProps()}
				checked={local.checked}
				defaultChecked={local.defaultChecked}
				onChange={(checked) => {
					if (local.error && local.onErrorClear) local.onErrorClear()
					setIsChecked(!!checked)
					local.onValueChange?.(!!checked)
				}}
				disabled={local.disabled}
				validationState={hasError() ? 'invalid' : undefined}
				name={local.name}
				value={local.value ?? 'on'}
			>
				<Show
					when={local.label}
					fallback={
						<>
							<div class="flex items-center gap-2">
								<KobalteSwitch.Input class="sr-only" />
								<KobalteSwitch.Control
									style={trackStyle()}
									class={cn(
										'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-surface-border transition-colors group',
										'outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 focus-visible:border-transparent',
										'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
										'bg-surface-dim data-[checked]:bg-success-500 data-[checked]:border-success-500',
										hasError() &&
											'border-danger-500 focus-visible:ring-danger-500 data-[checked]:border-danger-500',
										local.controlClass
									)}
								>
									<KobalteSwitch.Thumb
										style={{
											top: 'calc(var(--spacing) * 0.25)',
											left: 'calc(var(--spacing) * 0.25)',
										}}
										class={cn(
											'pointer-events-none absolute flex h-5 w-5 items-center justify-center rounded-full bg-surface-base shadow ring-0 transition-transform',
											'translate-x-0 group-data-[checked]:translate-x-5',
										)}
									>
										{iconVariant() && (local.thumbOffIcon || local.thumbOnIcon) ? (
											<>
												<span class={cn('block', 'group-data-[checked]:hidden')}>
													{local.thumbOffIcon}
												</span>
												<span class={cn('hidden', 'group-data-[checked]:block')}>
													{local.thumbOnIcon}
												</span>
											</>
										) : null}
									</KobalteSwitch.Thumb>
								</KobalteSwitch.Control>
							</div>

							<Show when={local.helperText && !hasError()}>
								<KobalteSwitch.Description class="mt-1.5 text-sm text-ink-500">
									{local.helperText}
								</KobalteSwitch.Description>
							</Show>

							<Show when={hasError()}>
								<KobalteSwitch.ErrorMessage class="mt-1.5 text-sm text-danger-600">
									{local.error}
								</KobalteSwitch.ErrorMessage>
							</Show>
						</>
					}
				>
					<div class="flex items-start justify-between gap-3">
						<div class="min-w-0">
							<KobalteSwitch.Label
								class={cn(
									'text-sm font-medium cursor-pointer select-none',
									hasError() ? 'text-danger-600' : 'text-ink-700',
									local.disabled && 'opacity-50 cursor-not-allowed'
								)}
							>
								{local.label}
								<Show when={local.required}>
									<span class="text-danger-500 ml-0.5" aria-hidden="true">*</span>
								</Show>
							</KobalteSwitch.Label>

							<Show when={local.helperText && !hasError()}>
								<KobalteSwitch.Description class="mt-1 text-sm text-ink-500">
									{local.helperText}
								</KobalteSwitch.Description>
							</Show>

							<Show when={hasError()}>
								<KobalteSwitch.ErrorMessage class="mt-1 text-sm text-danger-600">
									{local.error}
								</KobalteSwitch.ErrorMessage>
							</Show>
						</div>

						<div class="shrink-0">
							<KobalteSwitch.Input class="sr-only" />
							<KobalteSwitch.Control
								style={trackStyle()}
								class={cn(
									'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-surface-border transition-colors group',
									'outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 focus-visible:border-transparent',
									'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
									'bg-surface-dim data-[checked]:bg-success-500 data-[checked]:border-success-500',
									hasError() &&
										'border-danger-500 focus-visible:ring-danger-500 data-[checked]:border-danger-500',
									local.controlClass
								)}
							>
								<KobalteSwitch.Thumb
									style={{
										top: 'calc(var(--spacing) * 0.25)',
										left: 'calc(var(--spacing) * 0.25)',
									}}
									class={cn(
										'pointer-events-none absolute flex h-5 w-5 items-center justify-center rounded-full bg-surface-base shadow ring-0 transition-transform',
										'translate-x-0 group-data-[checked]:translate-x-5',
									)}
								>
									{iconVariant() && (local.thumbOffIcon || local.thumbOnIcon) ? (
										<>
											<span class={cn('block', 'group-data-[checked]:hidden')}>
												{local.thumbOffIcon}
											</span>
											<span class={cn('hidden', 'group-data-[checked]:block')}>
												{local.thumbOnIcon}
											</span>
										</>
									) : null}
								</KobalteSwitch.Thumb>
							</KobalteSwitch.Control>
						</div>
					</div>
				</Show>
			</KobalteSwitch>
		</div>
	)
}
