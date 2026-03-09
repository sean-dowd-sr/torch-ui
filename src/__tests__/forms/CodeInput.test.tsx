import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { CodeInput } from '../../components/forms/CodeInput'
import { renderUI } from '../../test/test-utils'

describe('CodeInput — single variant', () => {
	it('renders label', () => {
		renderUI(() => <CodeInput label="Verification code" />)
		expect(screen.getByText('Verification code')).toBeInTheDocument()
	})

	it('renders a text input', () => {
		renderUI(() => <CodeInput label="Code" />)
		expect(screen.getByRole('textbox')).toBeInTheDocument()
	})

	it('reflects controlled value', () => {
		renderUI(() => <CodeInput label="Code" value="ABC123" />)
		expect(screen.getByRole('textbox')).toHaveValue('ABC123')
	})

	it('shows error message', () => {
		renderUI(() => <CodeInput label="Code" error="Invalid code" />)
		expect(screen.getByText('Invalid code')).toBeInTheDocument()
	})

	it('calls onErrorClear when typing while error is shown', async () => {
		const user = userEvent.setup()
		const onErrorClear = vi.fn()
		renderUI(() => (
			<CodeInput label="Code" error="Invalid" onErrorClear={onErrorClear} />
		))
		await user.type(screen.getByRole('textbox'), 'A')
		expect(onErrorClear).toHaveBeenCalled()
	})

	it('shows helper text', () => {
		renderUI(() => <CodeInput label="Code" helperText="Enter the 6-digit code" />)
		expect(screen.getByText('Enter the 6-digit code')).toBeInTheDocument()
	})
})

describe('CodeInput — digits variant', () => {
	it('renders multiple inputs for digit entry', () => {
		renderUI(() => <CodeInput variant="digits" length={6} label="PIN" />)
		const inputs = screen.getAllByRole('textbox')
		expect(inputs.length).toBe(6)
	})

	it('renders 4 digits when length=4', () => {
		renderUI(() => <CodeInput variant="digits" length={4} label="PIN" />)
		expect(screen.getAllByRole('textbox').length).toBe(4)
	})
})
