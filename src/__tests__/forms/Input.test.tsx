import { describe, test, expect, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { Input } from '../../components/forms/Input'
import { renderUI } from '../../test/test-utils'

describe('Input', () => {
	test('renders label text', () => {
		renderUI(() => <Input label="Email address" />)
		expect(screen.getByText('Email address')).toBeInTheDocument()
	})

	test('no aria-invalid when no error', () => {
		renderUI(() => <Input label="Email" />)
		expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
	})

	test('sets aria-invalid="true" and shows message when error is set', () => {
		renderUI(() => <Input label="Email" error="This field is required" />)
		expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
		expect(screen.getByText('This field is required')).toBeInTheDocument()
	})

	test('input is aria-describedby the error element', () => {
		renderUI(() => <Input label="Email" error="Required" />)
		const input = screen.getByRole('textbox')
		const describedBy = input.getAttribute('aria-describedby')
		expect(describedBy).toBeTruthy()
		const errorEl = document.getElementById(describedBy!)
		expect(errorEl).toHaveTextContent('Required')
	})

	test('calls onErrorClear once when user types while error is shown', async () => {
		const user = userEvent.setup()
		const onErrorClear = vi.fn()
		renderUI(() => <Input label="Email" error="Required" onErrorClear={onErrorClear} />)
		await user.type(screen.getByRole('textbox'), 'a')
		expect(onErrorClear).toHaveBeenCalledTimes(1)
	})

	test('does not call onErrorClear when there is no error', async () => {
		const user = userEvent.setup()
		const onErrorClear = vi.fn()
		renderUI(() => <Input label="Email" onErrorClear={onErrorClear} />)
		await user.type(screen.getByRole('textbox'), 'hello')
		expect(onErrorClear).not.toHaveBeenCalled()
	})

	test('is disabled when disabled=true', () => {
		renderUI(() => <Input label="Email" disabled />)
		expect(screen.getByRole('textbox')).toBeDisabled()
	})

	test('shows helper text', () => {
		renderUI(() => <Input label="Email" helperText="We will never share your email" />)
		expect(screen.getByText('We will never share your email')).toBeInTheDocument()
	})
})
