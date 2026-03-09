import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { TextArea } from '../../components/forms/TextArea'
import { renderUI } from '../../test/test-utils'

describe('TextArea', () => {
	it('renders label text', () => {
		renderUI(() => <TextArea label="Description" />)
		expect(screen.getByText('Description')).toBeInTheDocument()
	})

	it('renders a textarea element', () => {
		renderUI(() => <TextArea label="Description" />)
		expect(screen.getByRole('textbox')).toBeInTheDocument()
	})

	it('accepts typed text', async () => {
		const user = userEvent.setup()
		renderUI(() => <TextArea label="Description" />)
		const textarea = screen.getByRole('textbox')
		await user.type(textarea, 'Hello world')
		expect(textarea).toHaveValue('Hello world')
	})

	it('reflects controlled value', () => {
		renderUI(() => <TextArea label="Notes" value="prefilled" />)
		expect(screen.getByRole('textbox')).toHaveValue('prefilled')
	})

	it('shows error message', () => {
		renderUI(() => <TextArea label="Notes" error="Field is required" />)
		expect(screen.getByText('Field is required')).toBeInTheDocument()
	})

	it('sets aria-invalid when error is provided', () => {
		renderUI(() => <TextArea label="Notes" error="Required" />)
		expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
	})

	it('calls onErrorClear when user types while error is shown', async () => {
		const user = userEvent.setup()
		const onErrorClear = vi.fn()
		renderUI(() => (
			<TextArea label="Notes" error="Required" onErrorClear={onErrorClear} />
		))
		await user.type(screen.getByRole('textbox'), 'a')
		expect(onErrorClear).toHaveBeenCalled()
	})

	it('is disabled when disabled=true', () => {
		renderUI(() => <TextArea label="Notes" disabled />)
		expect(screen.getByRole('textbox')).toBeDisabled()
	})

	it('shows helper text', () => {
		renderUI(() => <TextArea label="Notes" helperText="Max 500 characters" />)
		expect(screen.getByText('Max 500 characters')).toBeInTheDocument()
	})
})
