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

const GROUPS = [
	{
		group: 'Americas',
		options: [
			{ value: 'us', label: 'United States' },
			{ value: 'ca', label: 'Canada' },
		],
	},
	{
		group: 'Europe',
		options: [
			{ value: 'gb', label: 'United Kingdom' },
			{ value: 'de', label: 'Germany' },
		],
	},
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

describe('Select — grouped options', () => {
	it('renders section headers when groups are provided', async () => {
		const user = userEvent.setup()
		const { container } = renderUI(() => <Select groups={GROUPS} />)
		await user.click(container.querySelector('button')!)
		expect(screen.getByText('Americas')).toBeInTheDocument()
		expect(screen.getByText('Europe')).toBeInTheDocument()
	})

	it('renders all options within groups', async () => {
		const user = userEvent.setup()
		const { container } = renderUI(() => <Select groups={GROUPS} />)
		await user.click(container.querySelector('button')!)
		expect(screen.getByRole('option', { name: 'United States' })).toBeInTheDocument()
		expect(screen.getByRole('option', { name: 'Germany' })).toBeInTheDocument()
	})

	it('calls onValueChange when a grouped option is selected', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		const { container } = renderUI(() => <Select groups={GROUPS} onValueChange={onValueChange} />)
		await user.click(container.querySelector('button')!)
		await user.click(screen.getByRole('option', { name: 'Germany' }))
		expect(onValueChange).toHaveBeenCalledWith('de')
	})

	it('shows controlled value from a group', () => {
		renderUI(() => <Select groups={GROUPS} value="gb" />)
		expect(screen.getByText('United Kingdom')).toBeInTheDocument()
	})
})
