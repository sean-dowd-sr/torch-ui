import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { FieldPicker } from '../../components/forms/FieldPicker'
import { renderUI } from '../../test/test-utils'

const OPTIONS = [
	{ value: 'name', label: 'Name' },
	{ value: 'email', label: 'Email' },
	{ value: 'phone', label: 'Phone' },
]

describe('FieldPicker', () => {
	it('renders label', () => {
		renderUI(() => (
			<FieldPicker
				label="Select field"
				options={OPTIONS}
				value=""
				onValueChange={vi.fn()}
				onAdd={vi.fn()}
			/>
		))
		expect(screen.getByText('Select field')).toBeInTheDocument()
	})

	it('renders a combobox input', () => {
		renderUI(() => (
			<FieldPicker options={OPTIONS} value="" onValueChange={vi.fn()} onAdd={vi.fn()} />
		))
		expect(screen.getByRole('combobox')).toBeInTheDocument()
	})

	it('renders an add button', () => {
		renderUI(() => (
			<FieldPicker
				options={OPTIONS}
				value=""
				onValueChange={vi.fn()}
				onAdd={vi.fn()}
				addLabel="Add field"
			/>
		))
		expect(screen.getByRole('button', { name: 'Add field' })).toBeInTheDocument()
	})

	it('calls onAdd when add button is clicked', async () => {
		const user = userEvent.setup()
		const onAdd = vi.fn()
		renderUI(() => (
			<FieldPicker
				options={OPTIONS}
				value="name"
				onValueChange={vi.fn()}
				onAdd={onAdd}
				addLabel="Add"
			/>
		))
		await user.click(screen.getByRole('button', { name: 'Add' }))
		expect(onAdd).toHaveBeenCalledTimes(1)
	})

	it('disables add button when addDisabled=true', () => {
		renderUI(() => (
			<FieldPicker
				options={OPTIONS}
				value=""
				onValueChange={vi.fn()}
				onAdd={vi.fn()}
				addLabel="Add"
				addDisabled
			/>
		))
		expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled()
	})
})
