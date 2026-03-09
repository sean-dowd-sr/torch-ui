/**
 * Password strength indicator - minimal implementation.
 * Pass password as a prop; updates reactively when parent re-renders with new value.
 *
 * Usage: <PasswordStrengthIndicator password={password()} showHelperText />
 */
import { createMemo, createUniqueId, Show, splitProps } from 'solid-js'
import { cn } from '../../../utilities/classNames'
import { getPasswordAnalysis } from './password-strength'
import type { PasswordStrength } from './password-strength'
import { Progress } from '../Progress'

const SEGMENT_COUNT = 8

const CONFIG: Record<
	PasswordStrength,
	{ label: string; bg: string; textColor: string; helperText: string }
> = {
	empty: { label: '', bg: '', textColor: 'text-ink-500', helperText: '' },
	poor: {
		label: 'Poor',
		bg: 'bg-danger-500',
		textColor: 'text-danger-600',
		helperText: 'Your password is easily guessable. You can do better.',
	},
	fair: {
		label: 'Average',
		bg: 'bg-amber-500',
		textColor: 'text-amber-600',
		helperText: 'Getting there, but could be stronger.',
	},
	good: {
		label: 'Strong',
		bg: 'bg-success-500',
		textColor: 'text-success-600',
		helperText: 'Your password is great. Nice work!',
	},
	excellent: {
		label: 'Very Strong',
		bg: 'bg-success-500',
		textColor: 'text-success-600',
		helperText: 'Excellent password. Nice work!',
	},
}

export interface PasswordStrengthIndicatorProps {
	/** Current password value - pass the signal's value, e.g. password={newPassword()} */
	password?: string
	class?: string
	/** Show helper text below the bar. Default: true. */
	showHelperText?: boolean
}

export function PasswordStrengthIndicator(props: PasswordStrengthIndicatorProps) {
	const [local] = splitProps(props, ['password', 'class', 'showHelperText'])

	const helperId = `psi-helper-${createUniqueId()}`
	const pwd = () => local.password ?? ''
	const analysis = createMemo(() => getPasswordAnalysis(pwd()))
	const strength = createMemo(() => analysis().strength)
	const cfg = createMemo(() => CONFIG[strength()])
	const segmentValue = createMemo(() => (analysis().segmentScore / SEGMENT_COUNT) * 100)

	const missing = createMemo(() => {
		const r = analysis().requirements
		const m: string[] = []
		if (!r.hasMinLength) m.push('at least 8 characters')
		if (!r.hasUppercase) m.push('an uppercase letter')
		if (!r.hasLowercase) m.push('a lowercase letter')
		if (!r.hasNumber) m.push('a number')
		if (!r.hasSymbol) m.push('a symbol')
		return m
	})

	const helperText = () => {
		if (strength() === 'empty') return 'Enter a password to see strength.'
		if (strength() === 'poor' || strength() === 'fair') {
			const m = missing()
			if (m.length === 0) return cfg().helperText
			if (m.length === 1) return `Must contain ${m[0]}.`
			return `Must contain ${m.slice(0, -1).join(', ')}, and ${m[m.length - 1]}.`
		}
		return cfg().helperText
	}

	const isEmpty = () => strength() === 'empty'

	return (
		<div class={cn('mt-1.5', local.class)}>
			<div class="flex items-center justify-between mb-1.5">
				<span class="text-sm font-medium text-ink-700">Password Strength</span>
				<span class={cn('text-sm font-medium', cfg().textColor)}>{cfg().label}</span>
			</div>
			<Progress
				value={segmentValue()}
				segments={SEGMENT_COUNT}
				fillClass={cfg().bg}
				trackClass="bg-transparent"
				showValueLabel={false}
				aria-label={isEmpty() ? 'Password strength: not set' : `Password strength: ${cfg().label}`}
				aria-describedby={local.showHelperText !== false ? helperId : undefined}
			/>
			<Show when={local.showHelperText !== false}>
				<p
					id={helperId}
					class={cn(
						'mt-1.5 text-sm',
						(strength() === 'poor' || strength() === 'fair') ? 'text-ink-600' : 'text-ink-500'
					)}
				>
					{helperText()}
				</p>
			</Show>
		</div>
	)
}
