import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { Switch } from '../../components/forms/Switch'
import { renderUI } from '../../test/test-utils'

describe('Switch', () => {
	it('renders label text', () => {
		renderUI(() => <Switch label="Enable notifications" />)
		expect(screen.getByText('Enable notifications')).toBeInTheDocument()
	})

	it('renders in unchecked state by default', () => {
		renderUI(() => <Switch label="Toggle" />)
		expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
	})

	it('renders in checked state when checked=true', () => {
		renderUI(() => <Switch label="Toggle" checked />)
		expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
	})

	it('calls onValueChange with true when toggled on', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		renderUI(() => <Switch label="Toggle" onValueChange={onValueChange} />)
		await user.click(screen.getByRole('switch'))
		expect(onValueChange).toHaveBeenCalledWith(true)
	})

	it('calls onValueChange with false when toggled off', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		renderUI(() => <Switch label="Toggle" checked onValueChange={onValueChange} />)
		await user.click(screen.getByRole('switch'))
		expect(onValueChange).toHaveBeenCalledWith(false)
	})

	it('shows error message', () => {
		renderUI(() => <Switch label="Toggle" error="This field is required" />)
		expect(screen.getByText('This field is required')).toBeInTheDocument()
	})

	it('calls onErrorClear when toggled while error is shown', async () => {
		const user = userEvent.setup()
		const onErrorClear = vi.fn()
		renderUI(() => (
			<Switch label="Toggle" error="Required" onErrorClear={onErrorClear} />
		))
		await user.click(screen.getByRole('switch'))
		expect(onErrorClear).toHaveBeenCalledTimes(1)
	})

	it('is disabled when disabled=true', () => {
		renderUI(() => <Switch label="Toggle" disabled />)
		expect(screen.getByRole('switch')).toBeDisabled()
	})

	it('shows helper text', () => {
		renderUI(() => <Switch label="Toggle" helperText="Turns on dark mode" />)
		expect(screen.getByText('Turns on dark mode')).toBeInTheDocument()
	})
})
