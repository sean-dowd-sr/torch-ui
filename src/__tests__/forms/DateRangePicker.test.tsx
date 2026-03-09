import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { DateRangePicker } from '../../components/forms/DateRangePicker'
import { renderUI } from '../../test/test-utils'

describe('DateRangePicker', () => {
	it('renders label', () => {
		renderUI(() => <DateRangePicker label="Date range" />)
		expect(screen.getByText('Date range')).toBeInTheDocument()
	})

	it('renders a trigger button', () => {
		renderUI(() => <DateRangePicker label="Range" />)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('shows placeholder when no value', () => {
		renderUI(() => <DateRangePicker label="Range" placeholder="Pick dates" />)
		expect(screen.getByText('Pick dates')).toBeInTheDocument()
	})

	it('shows error message', () => {
		renderUI(() => <DateRangePicker label="Range" error="Date range is required" />)
		expect(screen.getByText('Date range is required')).toBeInTheDocument()
	})

	it('shows helper text', () => {
		renderUI(() => <DateRangePicker label="Range" helperText="Select start and end dates" />)
		expect(screen.getByText('Select start and end dates')).toBeInTheDocument()
	})

	it('is disabled when disabled=true', () => {
		renderUI(() => <DateRangePicker label="Range" disabled />)
		expect(screen.getByRole('button')).toBeDisabled()
	})

	it('opens calendar on click', async () => {
		const user = userEvent.setup()
		renderUI(() => <DateRangePicker label="Range" />)
		await user.click(screen.getByRole('button'))
		// Calendar renders inside a Popover portal as role="dialog"
		expect(document.body.querySelector('[role="dialog"]')).toBeInTheDocument()
	})
})
