import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { Select } from '../../components/forms/Select'
import { renderUI } from '../../test/test-utils'

const OPTIONS = [
	{ value: 'us', label: 'United States' },
	{ value: 'ca', label: 'Canada' },
	{ value: 'gb', label: 'United Kingdom' },
]

describe('Select', () => {
	it('renders label', () => {
		renderUI(() => <Select label="Country" options={OPTIONS} />)
		expect(screen.getByText('Country')).toBeInTheDocument()
	})

	it('renders a trigger button', () => {
		const { container } = renderUI(() => <Select label="Country" options={OPTIONS} />)
		expect(container.querySelector('button')).toBeInTheDocument()
	})

	it('shows placeholder text', () => {
		renderUI(() => <Select options={OPTIONS} placeholder="Pick a country" />)
		expect(screen.getByText('Pick a country')).toBeInTheDocument()
	})

	it('shows controlled value', () => {
		renderUI(() => <Select options={OPTIONS} value="ca" />)
		expect(screen.getByText('Canada')).toBeInTheDocument()
	})

	it('opens dropdown on click', async () => {
		const user = userEvent.setup()
		const { container } = renderUI(() => <Select label="Country" options={OPTIONS} />)
		await user.click(container.querySelector('button')!)
		expect(screen.getByRole('listbox')).toBeInTheDocument()
	})

	it('calls onValueChange when an option is selected', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		const { container } = renderUI(() => <Select options={OPTIONS} onValueChange={onValueChange} />)
		await user.click(container.querySelector('button')!)
		await user.click(screen.getByRole('option', { name: 'Canada' }))
		expect(onValueChange).toHaveBeenCalledWith('ca')
	})

	it('shows error message', () => {
		renderUI(() => <Select options={OPTIONS} error="Please select a country" />)
		expect(screen.getByText('Please select a country')).toBeInTheDocument()
	})

	it('calls onErrorClear when option selected while error is shown', async () => {
		const user = userEvent.setup()
		const onErrorClear = vi.fn()
		const { container } = renderUI(() => (
			<Select options={OPTIONS} error="Required" onErrorClear={onErrorClear} />
		))
		await user.click(container.querySelector('button')!)
		await user.click(screen.getByRole('option', { name: 'United States' }))
		expect(onErrorClear).toHaveBeenCalledTimes(1)
	})

	it('is disabled when disabled=true', () => {
		const { container } = renderUI(() => <Select options={OPTIONS} disabled />)
		expect(container.querySelector('button')).toBeDisabled()
	})

	it('shows helper text', () => {
		renderUI(() => <Select options={OPTIONS} helperText="Select your country of residence" />)
		expect(screen.getByText('Select your country of residence')).toBeInTheDocument()
	})
})
