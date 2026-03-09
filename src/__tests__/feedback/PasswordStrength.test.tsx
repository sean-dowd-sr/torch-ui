import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { PasswordStrengthIndicator } from '../../components/feedback/password/PasswordStrengthIndicator'
import {
	getPasswordStrength,
	getPasswordAnalysis,
} from '../../components/feedback'
import { renderUI } from '../../test/test-utils'

describe('PasswordStrengthIndicator', () => {
	it('renders without throwing', () => {
		const { container } = renderUI(() => (
			<PasswordStrengthIndicator password="" />
		))
		expect(container.firstChild).toBeInTheDocument()
	})

	it('renders segments', () => {
		const { container } = renderUI(() => (
			<PasswordStrengthIndicator password="Hello1!" />
		))
		expect(container.firstChild).toBeInTheDocument()
	})

	it('renders for empty password', () => {
		const { container } = renderUI(() => (
			<PasswordStrengthIndicator password="" />
		))
		expect(container.firstChild).toBeInTheDocument()
	})

	it('renders for strong password', () => {
		const { container } = renderUI(() => (
			<PasswordStrengthIndicator password="Str0ng!Pass#99" />
		))
		expect(container.firstChild).toBeInTheDocument()
	})
})

describe('getPasswordStrength', () => {
	it('returns empty for empty password', () => {
		expect(getPasswordStrength('')).toBe('empty')
	})

	it('returns a strength value for complex password', () => {
		const strength = getPasswordStrength('Str0ng!Pass#99')
		expect(['empty', 'poor', 'fair', 'good', 'excellent']).toContain(strength)
	})
})

describe('getPasswordAnalysis', () => {
	it('returns an analysis object with strength and met', () => {
		const analysis = getPasswordAnalysis('Hello123!')
		expect(analysis).toHaveProperty('met')
		expect(analysis).toHaveProperty('strength')
	})
})
