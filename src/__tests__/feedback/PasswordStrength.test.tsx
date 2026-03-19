import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { PasswordStrengthIndicator, type PasswordStrength } from '../../components/feedback/password/PasswordStrengthIndicator'
import { renderUI } from '../../test/test-utils'

describe('PasswordStrengthIndicator', () => {
	it('renders without throwing', () => {
		const { container } = renderUI(() => (
			<PasswordStrengthIndicator strength="empty" score={0} />
		))
		expect(container.firstChild).toBeInTheDocument()
	})

	it('renders segments for poor strength', () => {
		const { container } = renderUI(() => (
			<PasswordStrengthIndicator strength="poor" score={25} />
		))
		expect(container.firstChild).toBeInTheDocument()
	})

	it('renders for empty password', () => {
		const { container } = renderUI(() => (
			<PasswordStrengthIndicator strength="empty" score={0} />
		))
		expect(container.firstChild).toBeInTheDocument()
	})

	it('renders for strong password', () => {
		const { container } = renderUI(() => (
			<PasswordStrengthIndicator strength="excellent" score={100} />
		))
		expect(container.firstChild).toBeInTheDocument()
	})

	it('renders with custom details', () => {
		const { container } = renderUI(() => (
			<PasswordStrengthIndicator 
				strength="fair" 
				score={50}
				details={[
					{ name: '8+ characters', passed: true },
					{ name: 'Uppercase', passed: false },
				]}
			/>
		))
		expect(container.firstChild).toBeInTheDocument()
	})

	it('renders without helper text when disabled', () => {
		const { container } = renderUI(() => (
			<PasswordStrengthIndicator 
				strength="good" 
				score={75} 
				showHelperText={false} 
			/>
		))
		expect(container.firstChild).toBeInTheDocument()
	})

	it('renders with custom title', () => {
		const { container } = renderUI(() => (
			<PasswordStrengthIndicator 
				strength="good" 
				score={75} 
				title="Security Score" 
			/>
		))
		expect(container.firstChild).toBeInTheDocument()
		expect(screen.getByText('Security Score')).toBeInTheDocument()
	})

	it('renders with custom segments', () => {
		const { container } = renderUI(() => (
			<PasswordStrengthIndicator 
				strength="good" 
				score={75} 
				segments={4} 
			/>
		))
		expect(container.firstChild).toBeInTheDocument()
	})

	it('shows strength label when provided', () => {
		renderUI(() => (
			<PasswordStrengthIndicator 
				strength="good" 
				score={75}
				messages={{
					good: { label: 'Strong' }
				}}
			/>
		))
		expect(screen.getByText('Strong')).toBeInTheDocument()
	})

	it('shows helper text based on details', () => {
		renderUI(() => (
			<PasswordStrengthIndicator 
				strength="poor" 
				score={25}
				details={[
					{ name: '8+ characters', passed: false },
					{ name: 'Uppercase', passed: false },
				]}
			/>
		))
		expect(screen.getByText(/Must contain/)).toBeInTheDocument()
	})

	it('applies custom class', () => {
		const { container } = renderUI(() => (
			<PasswordStrengthIndicator 
				strength="good" 
				score={75} 
				class="custom-class" 
			/>
		))
		const wrapper = container.firstChild as HTMLElement
		expect(wrapper).toHaveClass('custom-class')
	})
})
