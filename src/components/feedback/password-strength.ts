/**
 * Password strength and requirements.
 *
 * Callers should NOT trim the password before passing it in; these functions
 * operate on the raw value. isPasswordWeak (from password-validation) trims
 * internally for its own pattern checks — that asymmetry is intentional so
 * that leading/trailing spaces count toward length and character requirements
 * but don't bypass weak-pattern detection.
 */
import { isPasswordWeak } from '../lib/password-validation'

export type PasswordStrength = 'empty' | 'poor' | 'fair' | 'good' | 'excellent'

export interface PasswordRequirements {
	hasMinLength: boolean
	hasUppercase: boolean
	hasLowercase: boolean
	hasNumber: boolean
	hasSymbol: boolean
}

export interface PasswordAnalysis {
	requirements: PasswordRequirements
	/** Number of requirements met (0–5). */
	met: number
	strength: PasswordStrength
	/** 0–8 segment score for smooth progress bar fill. */
	segmentScore: number
}

/**
 * Single-pass analysis: requirements, strength, and segment score.
 * Use this instead of calling getPasswordRequirements / getPasswordStrength /
 * getPasswordSegmentScore individually which avoids redundant computation on every keystroke.
 */
export function getPasswordAnalysis(password: string): PasswordAnalysis {
	if (password.length === 0) {
		return {
			requirements: { hasMinLength: false, hasUppercase: false, hasLowercase: false, hasNumber: false, hasSymbol: false },
			met: 0,
			strength: 'empty',
			segmentScore: 0,
		}
	}

	const requirements = computeRequirements(password)
	const met = [
		requirements.hasMinLength,
		requirements.hasUppercase,
		requirements.hasLowercase,
		requirements.hasNumber,
		requirements.hasSymbol,
	].filter(Boolean).length

	const weak = isPasswordWeak(password)

	const strength: PasswordStrength =
		weak || met < 3 ? 'poor'
		: met === 3 ? 'fair'
		: met === 4 ? 'good'
		: 'excellent'

	// Segment score: 0–8 for smooth progress bar fill.
	// When weak, cap at 2 regardless of met count.
	let segmentScore: number
	if (weak) {
		segmentScore = Math.min(2, Math.max(1, met))
	} else if (met <= 2) {
		segmentScore = met
	} else if (met === 3) {
		segmentScore = requirements.hasMinLength && password.length >= 10 ? 4 : 3
	} else if (met === 4) {
		segmentScore = requirements.hasMinLength && password.length >= 12 ? 6 : 5
	} else {
		segmentScore = requirements.hasMinLength && password.length >= 14 ? 8 : 7
	}

	return { requirements, met, strength, segmentScore }
}

// Convenience wrappers (backward-compat, delegate to getPasswordAnalysis)

export function getPasswordRequirements(password: string): PasswordRequirements {
	return getPasswordAnalysis(password).requirements
}

export function getPasswordStrength(password: string): PasswordStrength {
	return getPasswordAnalysis(password).strength
}

/** Returns 0–8 for smooth segment progression. */
export function getPasswordSegmentScore(password: string): number {
	return getPasswordAnalysis(password).segmentScore
}

// Internal

function computeRequirements(password: string): PasswordRequirements {
	let upper = false, lower = false, digit = false, symbol = false
	for (let i = 0; i < password.length; i++) {
		const c = password.charCodeAt(i)
		if (c >= 65 && c <= 90) upper = true
		else if (c >= 97 && c <= 122) lower = true
		else if (c >= 48 && c <= 57) digit = true
		else if (c >= 33 && c <= 126) symbol = true
		if (upper && lower && digit && symbol) break
	}
	return {
		hasMinLength: password.length >= 8,
		hasUppercase: upper,
		hasLowercase: lower,
		hasNumber: digit,
		hasSymbol: symbol,
	}
}
