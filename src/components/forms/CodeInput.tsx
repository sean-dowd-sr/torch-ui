import { createEffect, type JSX, splitProps, createUniqueId } from 'solid-js'
import { cn } from '../lib/cn'
import { mergeRefs } from '../lib/mergeRefs'

export interface CodeInputProps
	extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'maxLength'> {
	/** 'single' = one input; 'digits' = one input per digit with paste/keyboard nav (e.g. verification code) */
	variant?: 'single' | 'digits'
	label?: string
	error?: string
	helperText?: string
	/** Length of code (default 6) */
	length?: number
	value?: string
	onValueChange?: (value: string) => void
	onErrorClear?: () => void
}

export function CodeInput(props: CodeInputProps) {
	const variant = () => props.variant ?? 'single'
	if (variant() === 'digits') {
		return <CodeInputDigits {...props} />
	}
	return <CodeInputSingle {...props} />
}

function CodeInputSingle(props: CodeInputProps) {
	const [local, others] = splitProps(props, [
		'variant',
		'label',
		'error',
		'helperText',
		'length',
		'value',
		'onValueChange',
		'onErrorClear',
		'class',
		'id',
		'onInput',
		'disabled',
	])

	const length = () => local.length ?? 6
	const generatedId = createUniqueId()
	const inputId = () => local.id ?? `code-input-${generatedId}`
	const hasError = () => !!local.error
	const msgId = () => (local.error || local.helperText) ? `${inputId()}-msg` : undefined
	const describedBy = () => {
		const user = (others as Record<string, unknown>)['aria-describedby'] as string | undefined
		const own = msgId()
		return user && own ? `${user} ${own}` : (user ?? own)
	}

	const handleInput = (e: InputEvent) => {
		const input = e.target as HTMLInputElement
		const raw = input.value.replace(/\D/g, '').slice(0, length())
		input.value = raw
		if (local.error && local.onErrorClear) local.onErrorClear()
		local.onValueChange?.(raw)
		if (local.onInput) (local.onInput as (e: InputEvent) => void)(e)
	}

	return (
		<div class="w-full">
			{local.label && (
				<label
					for={inputId()}
					class={cn(
						'block text-md font-medium mb-1.5',
						hasError() ? 'text-danger-600' : 'text-ink-700 dark:text-ink-300'
					)}
				>
					{local.label}
				</label>
			)}
			<input
				id={inputId()}
				type="text"
				inputMode="numeric"
				autocomplete="one-time-code"
				pattern="[0-9]*"
				maxLength={length()}
				value={local.value}
				onInput={handleInput}
				disabled={local.disabled}
				aria-invalid={hasError() ? 'true' : undefined}
				aria-describedby={describedBy()}
				class={cn(
					'w-full px-4 py-3 rounded-lg transition-all outline-none text-center text-xl tracking-[0.25em] font-mono',
					'text-ink-900 dark:text-ink-100 placeholder:text-ink-400 dark:placeholder:text-ink-500 placeholder:tracking-normal',
					'bg-surface-raised border',
					hasError()
						? 'border-danger-500 focus:ring-2 focus:ring-inset focus:ring-danger-500 focus:border-transparent'
						: 'border-ink-300 dark:border-ink-700 focus:ring-2 focus:ring-inset focus:ring-primary-500 focus:border-transparent',
					'disabled:bg-ink-50 dark:disabled:bg-ink-900 disabled:text-ink-500 dark:disabled:text-ink-500 disabled:cursor-not-allowed',
					local.class
				)}
				{...others}
			/>
			{(local.error || local.helperText) && (
				<p
					id={msgId()}
					role={local.error ? 'alert' : undefined}
					class={cn('mt-2 text-sm', hasError() ? 'text-danger-600' : 'text-ink-500 dark:text-ink-400')}
				>
					{local.error || local.helperText}
				</p>
			)}
		</div>
	)
}

function CodeInputDigits(props: CodeInputProps) {
	const length = () => props.length ?? 6
	let inputRefs: (HTMLInputElement | undefined)[] = []

	createEffect(() => {
		inputRefs = new Array(length())
	})

	const emit = (next: string) => {
		if (props.error && props.onErrorClear) props.onErrorClear()
		props.onValueChange?.(next)
	}

	createEffect(() => {
		const val = (props.value ?? '').replace(/\D/g, '').slice(0, length())
		if (val !== (props.value ?? '')) emit(val)
	})

	const onInput = (index: number, e: InputEvent) => {
		const target = e.currentTarget as HTMLInputElement
		const raw = (target.value ?? '').replace(/\D/g, '')
		const val = props.value ?? ''
		if (!raw) {
			emit((val.slice(0, index) + val.slice(index + 1)).slice(0, length()))
			return
		}
		const rest = raw.slice(0, length() - index)
		const next = (val.slice(0, index) + rest).slice(0, length())
		emit(next)
		requestAnimationFrame(() =>
			inputRefs[Math.min(index + rest.length, length() - 1)]?.focus()
		)
	}

	const onKeyDown = (index: number, e: KeyboardEvent) => {
		const val = props.value ?? ''
		if (e.key === 'Backspace' && !val[index] && index > 0) {
			e.preventDefault()
			emit(val.slice(0, index - 1) + val.slice(index))
			requestAnimationFrame(() => inputRefs[index - 1]?.focus())
		} else if (e.key === 'Backspace' && val[index]) {
			emit(val.slice(0, index) + val.slice(index + 1))
		} else if (e.key === 'ArrowLeft' && index > 0) {
			e.preventDefault()
			inputRefs[index - 1]?.focus()
		} else if (e.key === 'ArrowRight' && index < length() - 1) {
			e.preventDefault()
			inputRefs[index + 1]?.focus()
		}
	}

	const onPaste = (e: ClipboardEvent) => {
		e.preventDefault()
		const pasted = (e.clipboardData?.getData('text') ?? '')
			.replace(/\D/g, '')
			.slice(0, length())
		if (!pasted) return
		emit(pasted)
		requestAnimationFrame(() =>
			inputRefs[Math.min(pasted.length, length() - 1)]?.focus()
		)
	}

	const generatedId = createUniqueId()
	const firstId = () => props.id ?? `code-digits-${generatedId}`
	const hasError = () => !!props.error

	return (
		<div class={cn('w-full', props.class)}>
			{props.label && (
				<label
					for={firstId()}
					class={cn(
						'block text-sm font-medium mb-2',
						hasError() ? 'text-danger-600' : 'text-ink-700 dark:text-ink-300'
					)}
				>
					{props.label}
				</label>
			)}
			<div
				class="flex gap-2 justify-center"
				role="group"
				aria-label="Verification code digits"
			>
				{Array.from({ length: length() }, (_, i) => (
					<input
						ref={i === 0 ? mergeRefs((el: HTMLInputElement) => (inputRefs[i] = el), props.ref) : (el: HTMLInputElement) => (inputRefs[i] = el)}
						id={i === 0 ? firstId() : undefined}
						type="text"
						inputMode="numeric"
						autocomplete={i === 0 ? 'one-time-code' : 'off'}
						maxLength={1}
						value={(props.value ?? '')[i] ?? ''}
						onInput={(e) => onInput(i, e)}
						onKeyDown={(e) => onKeyDown(i, e)}
						onPaste={onPaste}
						disabled={props.disabled}
						class={cn(
							'w-11 h-12 rounded-lg border text-center text-xl font-semibold font-mono tabular-nums outline-none transition-colors',
							'text-ink-900 dark:text-ink-100 bg-surface-raised',
							hasError()
								? 'border-danger-500 focus:ring-2 focus:ring-danger-500/20 focus:border-danger-500'
								: 'border-ink-300 dark:border-ink-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
							'disabled:opacity-50 disabled:cursor-not-allowed'
						)}
						aria-label={`Digit ${i + 1}`}
						aria-invalid={hasError() ? 'true' : undefined}
					/>
				))}
			</div>
			{(props.error || props.helperText) && (
				<p
					class={cn(
						'mt-1.5 text-sm',
						hasError() ? 'text-danger-600' : 'text-ink-500 dark:text-ink-400'
					)}
					role={props.error ? 'alert' : undefined}
				>
					{props.error || props.helperText}
				</p>
			)}
		</div>
	)
}
