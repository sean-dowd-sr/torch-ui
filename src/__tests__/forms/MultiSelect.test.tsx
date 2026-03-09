import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { MultiSelect } from '../../components/forms/MultiSelect'
import { renderUI } from '../../test/test-utils'

const OPTIONS = [
	{ value: 'react', label: 'React' },
	{ value: 'solid', label: 'SolidJS' },
	{ value: 'vue', label: 'Vue' },
]

describe('MultiSelect', () => {
	it('renders label', () => {
		renderUI(() => (
			<MultiSelect label="Frameworks" options={OPTIONS} value={[]} onValueChange={vi.fn()} />
		))
		expect(screen.getByText('Frameworks')).toBeInTheDocument()
	})

	it('renders a trigger button', () => {
		const { container } = renderUI(() => (
			<MultiSelect options={OPTIONS} value={[]} onValueChange={vi.fn()} />
		))
		expect(container.querySelector('button')).toBeInTheDocument()
	})

	it('shows placeholder when no value selected', () => {
		renderUI(() => (
			<MultiSelect options={OPTIONS} value={[]} placeholder="Select frameworks" onValueChange={vi.fn()} />
		))
		expect(screen.getByText('Select frameworks')).toBeInTheDocument()
	})

	it('shows chips for selected values', () => {
		renderUI(() => (
			<MultiSelect options={OPTIONS} value={['react', 'solid']} onValueChange={vi.fn()} />
		))
		expect(screen.getByText('React')).toBeInTheDocument()
		expect(screen.getByText('SolidJS')).toBeInTheDocument()
	})

	it('opens dropdown on click and shows options', async () => {
		const user = userEvent.setup()
		const { container } = renderUI(() => (
			<MultiSelect options={OPTIONS} value={[]} onValueChange={vi.fn()} />
		))
		await user.click(container.querySelector('button')!)
		expect(screen.getByRole('listbox')).toBeInTheDocument()
	})

	it('calls onValueChange when option selected', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		const { container } = renderUI(() => (
			<MultiSelect options={OPTIONS} value={[]} onValueChange={onValueChange} />
		))
		await user.click(container.querySelector('button')!)
		await user.click(screen.getByRole('option', { name: 'React' }))
		expect(onValueChange).toHaveBeenCalledWith(['react'])
	})

	it('shows error message', () => {
		renderUI(() => (
			<MultiSelect options={OPTIONS} value={[]} error="Select at least one" onValueChange={vi.fn()} />
		))
		expect(screen.getByText('Select at least one')).toBeInTheDocument()
	})

	it('calls onErrorClear when selecting while error shown', async () => {
		const user = userEvent.setup()
		const onErrorClear = vi.fn()
		const { container } = renderUI(() => (
			<MultiSelect
				options={OPTIONS}
				value={[]}
				error="Required"
				onErrorClear={onErrorClear}
				onValueChange={vi.fn()}
			/>
		))
		await user.click(container.querySelector('button')!)
		await user.click(screen.getByRole('option', { name: 'Vue' }))
		expect(onErrorClear).toHaveBeenCalledTimes(1)
	})
})
