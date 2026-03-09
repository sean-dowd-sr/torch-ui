import { describe, test, expect, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '../../components/forms/Checkbox'
import { renderUI } from '../../test/test-utils'

describe('Checkbox', () => {
	test('renders label text', () => {
		renderUI(() => <Checkbox label="Accept terms" />)
		expect(screen.getByText('Accept terms')).toBeInTheDocument()
	})

	test('is unchecked by default', () => {
		renderUI(() => <Checkbox label="Accept terms" />)
		expect(screen.getByRole('checkbox')).not.toBeChecked()
	})

	test('checked=true renders as checked', () => {
		renderUI(() => <Checkbox label="Accept terms" checked />)
		expect(screen.getByRole('checkbox')).toBeChecked()
	})

	test('calls onValueChange when clicked', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		renderUI(() => <Checkbox label="Accept terms" onValueChange={onValueChange} />)
		await user.click(screen.getByRole('checkbox'))
		expect(onValueChange).toHaveBeenCalledTimes(1)
		expect(onValueChange).toHaveBeenCalledWith(true)
	})

	test('sets aria-invalid="true" when error is set', () => {
		renderUI(() => <Checkbox label="Accept terms" error="You must accept the terms" />)
		expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
		expect(screen.getByText('You must accept the terms')).toBeInTheDocument()
	})

	test('calls onErrorClear when clicked while error is shown', async () => {
		const user = userEvent.setup()
		const onErrorClear = vi.fn()
		renderUI(() => (
			<Checkbox
				label="Accept terms"
				error="Required"
				onErrorClear={onErrorClear}
			/>
		))
		await user.click(screen.getByRole('checkbox'))
		expect(onErrorClear).toHaveBeenCalledTimes(1)
	})

	test('is disabled when disabled=true', () => {
		renderUI(() => <Checkbox label="Accept terms" disabled />)
		expect(screen.getByRole('checkbox')).toBeDisabled()
	})
})
