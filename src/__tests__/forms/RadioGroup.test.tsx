import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { RadioGroup } from '../../components/forms/RadioGroup'
import { renderUI } from '../../test/test-utils'

const OPTIONS = [
	{ value: 'a', label: 'Option A' },
	{ value: 'b', label: 'Option B' },
	{ value: 'c', label: 'Option C' },
]

describe('RadioGroup', () => {
	it('renders group label', () => {
		renderUI(() => <RadioGroup label="Pick one" options={OPTIONS} />)
		expect(screen.getByText('Pick one')).toBeInTheDocument()
	})

	it('renders all option labels', () => {
		renderUI(() => <RadioGroup options={OPTIONS} />)
		for (const opt of OPTIONS) {
			expect(screen.getByLabelText(opt.label)).toBeInTheDocument()
		}
	})

	it('marks the controlled value as checked', () => {
		renderUI(() => <RadioGroup options={OPTIONS} value="b" />)
		expect(screen.getByLabelText('Option B')).toBeChecked()
		expect(screen.getByLabelText('Option A')).not.toBeChecked()
	})

	it('calls onValueChange with the selected value', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		renderUI(() => <RadioGroup options={OPTIONS} onValueChange={onValueChange} />)
		await user.click(screen.getByLabelText('Option C'))
		expect(onValueChange).toHaveBeenCalledWith('c')
	})

	it('shows error message', () => {
		renderUI(() => <RadioGroup options={OPTIONS} error="Selection required" />)
		expect(screen.getByText('Selection required')).toBeInTheDocument()
	})

	it('calls onErrorClear when an option is selected while error is shown', async () => {
		const user = userEvent.setup()
		const onErrorClear = vi.fn()
		renderUI(() => (
			<RadioGroup
				options={OPTIONS}
				error="Required"
				onErrorClear={onErrorClear}
			/>
		))
		await user.click(screen.getByLabelText('Option A'))
		expect(onErrorClear).toHaveBeenCalledTimes(1)
	})

	it('disables all options when disabled=true', () => {
		renderUI(() => <RadioGroup options={OPTIONS} disabled />)
		for (const opt of OPTIONS) {
			expect(screen.getByLabelText(opt.label)).toBeDisabled()
		}
	})
})
