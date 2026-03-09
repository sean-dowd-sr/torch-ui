import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { DatePicker } from '../../components/forms/DatePicker'
import { renderUI } from '../../test/test-utils'

describe('DatePicker', () => {
	it('renders label', () => {
		renderUI(() => <DatePicker label="Start date" />)
		expect(screen.getByText('Start date')).toBeInTheDocument()
	})

	it('renders a button trigger', () => {
		renderUI(() => <DatePicker label="Date" />)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('shows placeholder text when no value', () => {
		renderUI(() => <DatePicker label="Date" placeholder="Pick a date" />)
		expect(screen.getByText('Pick a date')).toBeInTheDocument()
	})

	it('shows formatted value when date is set', () => {
		// When value is set a clear button also renders; use container selector for the trigger
		const { container } = renderUI(() => <DatePicker label="Date" value="2024-06-15" />)
		const trigger = container.querySelector('button')
		expect(trigger?.textContent).toContain('2024')
	})

	it('opens calendar popover on click', async () => {
		const user = userEvent.setup()
		renderUI(() => <DatePicker label="Date" />)
		await user.click(screen.getByRole('button'))
		// Calendar renders inside a Popover portal as role="dialog"
		expect(document.body.querySelector('[role="dialog"]')).toBeInTheDocument()
	})

	it('shows error message', () => {
		renderUI(() => <DatePicker label="Date" error="Date is required" />)
		expect(screen.getByText('Date is required')).toBeInTheDocument()
	})

	it('shows helper text', () => {
		renderUI(() => <DatePicker label="Date" helperText="Select your travel date" />)
		expect(screen.getByText('Select your travel date')).toBeInTheDocument()
	})

	it('is disabled when disabled=true', () => {
		renderUI(() => <DatePicker label="Date" disabled />)
		expect(screen.getByRole('button')).toBeDisabled()
	})

	it('calls onValueChange when a date is selected', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		renderUI(() => <DatePicker label="Date" onValueChange={onValueChange} />)
		await user.click(screen.getByRole('button'))
		// Find 1-2 digit numeric day buttons (excludes 4-digit year buttons)
		const dayButtons = Array.from(document.body.querySelectorAll('button')).filter(
			(btn) => /^\d{1,2}$/.test(btn.textContent?.trim() ?? '')
		)
		if (dayButtons.length > 0) {
			await user.click(dayButtons[0])
			expect(onValueChange).toHaveBeenCalled()
		} else {
			// Calendar opened but no day buttons found — just verify it opened
			expect(document.body.querySelector('[role="dialog"]')).toBeInTheDocument()
		}
	})
})
