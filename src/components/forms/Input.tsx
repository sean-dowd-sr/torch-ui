import { type JSX, splitProps, Show, createSignal } from 'solid-js'
import { Eye, EyeOff } from 'lucide-solid'
import { TextField as KobalteTextField } from '@kobalte/core/text-field'
import { cn } from '../../utilities/classNames'

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
	label?: string
	/** Optional content on the label row (e.g. "Forgot password?" link) */
	labelTrailing?: JSX.Element
	error?: string
	helperText?: string
	/** When true, never render label row or error/helper text (input only; error still affects border) */
	bare?: boolean
	/** When true, native required on input and required indicator (asterisk) on label. */
	required?: boolean
	/** When true, show "optional" on the label row when the field is not required. Default false. */
	optional?: boolean
	/** When true, use compact height (36px). Default is standard height (40px). Aligns with Select, Autocomplete, MultiSelect. */
	compact?: boolean
	/** When true and type is "password", show a show/hide toggle (eye icon) to reveal the password. Default false. */
	revealable?: boolean
	/** Content at the start of the input (e.g. "$", or an icon). */
	startAdornment?: JSX.Element
	/** Content at the end of the input (e.g. "USD", or an icon). */
	endAdornment?: JSX.Element
	/** Icon at the start (same slot as startAdornment). Use for search, etc. */
	startIcon?: JSX.Element
	/** Icon at the end (same slot as endAdornment). */
	endIcon?: JSX.Element
	/** @deprecated Use startIcon or startAdornment. */
	leftIcon?: JSX.Element
	/** @deprecated Use endIcon or endAdornment. */
	rightIcon?: JSX.Element
	/** Applied to the native input element when you need to style the control itself. */
	inputClass?: string
	onValueChange?: (value: string) => void
	onErrorClear?: () => void
}

export function Input(props: InputProps) {
	const [local, others] = splitProps(props, [
		'label',
		'labelTrailing',
		'error',
		'helperText',
		'bare',
		'required',
		'optional',
		'compact',
		'revealable',
		'type',
		'startAdornment',
		'endAdornment',
		'startIcon',
		'endIcon',
		'leftIcon',
		'rightIcon',
		'onValueChange',
		'onErrorClear',
		'class',
		'inputClass',
		'id',
		'value',
		'onInput',
		'ref',
		'disabled',
	])

	const hasError = () => !!local.error

	const sizeClass = () =>
		local.compact === true
			? 'h-9 min-h-9 py-2 text-sm'
			: 'h-10 min-h-10 py-2 text-base'

	const handleChange = (val: string) => {
		if (local.error && local.onErrorClear) {
			local.onErrorClear()
		}
		local.onValueChange?.(val)
	}

	const handleInput = (e: InputEvent) => {
		if (local.onInput) {
			;(local.onInput as (e: InputEvent) => void)(e)
		}
	}

	const startContent = () => local.startAdornment ?? local.startIcon ?? local.leftIcon
	const isPasswordRevealable = () => local.type === 'password' && local.revealable === true
	const [showPassword, setShowPassword] = createSignal(false)
	const effectiveType = () =>
		isPasswordRevealable() && showPassword() ? 'text' : (local.type ?? 'text')
	const endContent = () => {
		if (isPasswordRevealable()) return null
		return local.endAdornment ?? local.endIcon ?? local.rightIcon
	}
	const hasStart = () => !!startContent()
	const hasEnd = () => !!endContent() || isPasswordRevealable()
	const adornmentClass = () =>
		'absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-ink-500 dark:text-ink-400 pointer-events-none z-10 text-base'

	return (
		<KobalteTextField
			value={typeof local.value === 'string' ? local.value : local.value == null ? '' : String(local.value)}
			onChange={handleChange}
			validationState={hasError() ? 'invalid' : undefined}
			required={local.required}
			disabled={local.disabled}
			class={cn('w-full', local.class)}
		>
			<Show when={!local.bare && (local.label || local.labelTrailing)}>
				<div class="flex items-center justify-between gap-2 mb-1.5">
					<Show when={local.label}>
						<KobalteTextField.Label
							class={cn(
								'block text-md font-medium',
								hasError() ? 'text-danger-600' : 'text-ink-700 dark:text-ink-300'
							)}
						>
							{local.label}
							<Show when={local.required}>
								<span class="text-danger-500 dark:text-danger-400 ml-0.5" aria-hidden="true">*</span>
							</Show>
						</KobalteTextField.Label>
					</Show>
					<Show when={!local.label}>
						<span />
					</Show>
					<div class="flex items-center gap-2 flex-shrink-0">
						<Show when={local.labelTrailing}>{local.labelTrailing}</Show>
						<Show when={local.label && !local.required && local.optional}>
							<span class="text-xs text-ink-500 dark:text-ink-400">optional</span>
						</Show>
					</div>
				</div>
			</Show>

			<div class="relative flex items-center">
				<Show when={startContent()}>
					<div
						class={cn(adornmentClass(), local.compact ? 'left-2.5 text-sm' : 'left-3')}
						aria-hidden="true"
					>
						{startContent()}
					</div>
				</Show>

				<KobalteTextField.Input
					ref={local.ref}
					id={local.id}
					type={effectiveType()}
					onInput={handleInput}
					class={cn(
						'w-full rounded-lg transition-all outline-none border text-ink-900 dark:text-ink-100 placeholder:text-ink-400 dark:placeholder:text-ink-500 bg-surface-raised',
						sizeClass(),
						hasStart() && (local.compact ? 'pl-9' : 'pl-10'),
						hasEnd() && (local.compact ? 'pr-9' : 'pr-10'),
						!hasStart() && (local.compact ? 'pl-3' : 'pl-4'),
						!hasEnd() && (local.compact ? 'pr-3' : 'pr-4'),
						hasError()
							? 'border-danger-500 focus:ring-2 focus:ring-inset focus:ring-danger-500 focus:border-transparent'
							: 'border-ink-300 dark:border-ink-800 focus:ring-2 focus:ring-inset focus:ring-primary-500 focus:border-transparent',
						'disabled:bg-surface-base disabled:text-ink-500 dark:disabled:text-ink-500 disabled:cursor-not-allowed',
						local.inputClass
					)}
					{...others}
				/>

				<Show when={endContent()}>
					<div
						class={cn(adornmentClass(), local.compact ? 'right-2.5 text-sm' : 'right-3')}
						aria-hidden="true"
					>
						{endContent()}
					</div>
				</Show>
				<Show when={isPasswordRevealable()}>
					<button
						type="button"
						onClick={() => setShowPassword((v) => !v)}
						class={cn(
							'absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded p-1 z-10 text-ink-500 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800',
							local.compact ? 'right-2.5 text-sm' : 'right-3'
						)}
						aria-label={showPassword() ? 'Hide password' : 'Show password'}
					>
						{showPassword() ? <EyeOff class="h-4 w-4" aria-hidden="true" /> : <Eye class="h-4 w-4" aria-hidden="true" />}
					</button>
				</Show>
			</div>

			<Show when={!local.bare && local.helperText && !hasError()}>
				<KobalteTextField.Description class="mt-2 text-sm text-ink-500 dark:text-ink-400">
					{local.helperText}
				</KobalteTextField.Description>
			</Show>

			<Show when={!local.bare}>
				<KobalteTextField.ErrorMessage class="mt-2 text-sm text-danger-600">
					{local.error}
				</KobalteTextField.ErrorMessage>
			</Show>
		</KobalteTextField>
	)
}
