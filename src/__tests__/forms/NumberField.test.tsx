import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { NumberField } from '../../components/forms/NumberField'
import { renderUI } from '../../test/test-utils'

describe('NumberField', () => {
	it('renders label text', () => {
		renderUI(() => <NumberField label="Quantity" />)
		expect(screen.getByText('Quantity')).toBeInTheDocument()
	})

	it('renders a spinbutton input', () => {
		renderUI(() => <NumberField label="Quantity" />)
		expect(screen.getByRole('spinbutton')).toBeInTheDocument()
	})

	it('reflects controlled value', () => {
		renderUI(() => <NumberField label="Quantity" value={42} />)
		expect(screen.getByRole('spinbutton')).toHaveValue('42')
	})

	it('shows error message', () => {
		renderUI(() => <NumberField label="Quantity" error="Value is required" />)
		expect(screen.getByText('Value is required')).toBeInTheDocument()
	})

	it('sets aria-invalid when error is provided', () => {
		renderUI(() => <NumberField label="Quantity" error="Required" />)
		expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'true')
	})

	it('calls onValueChange when value changes', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		renderUI(() => <NumberField label="Qty" onValueChange={onValueChange} />)
		const input = screen.getByRole('spinbutton')
		await user.clear(input)
		await user.type(input, '5')
		expect(onValueChange).toHaveBeenCalled()
	})

	it('calls onErrorClear when user types while error is shown', async () => {
		const user = userEvent.setup()
		const onErrorClear = vi.fn()
		renderUI(() => (
			<NumberField label="Qty" error="Required" onErrorClear={onErrorClear} />
		))
		const input = screen.getByRole('spinbutton')
		await user.clear(input)
		await user.type(input, '3')
		expect(onErrorClear).toHaveBeenCalled()
	})

	it('is disabled when disabled=true', () => {
		renderUI(() => <NumberField label="Quantity" disabled />)
		expect(screen.getByRole('spinbutton')).toBeDisabled()
	})

	it('shows helper text', () => {
		renderUI(() => <NumberField label="Quantity" helperText="Enter a number between 1–100" />)
		expect(screen.getByText('Enter a number between 1–100')).toBeInTheDocument()
	})
})
