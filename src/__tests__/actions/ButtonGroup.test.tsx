import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { ButtonGroup } from '../../components/actions/ButtonGroup'
import { Button } from '../../components/actions/Button'
import { renderUI } from '../../test/test-utils'

const TOGGLE_OPTIONS = [
	{ value: 'list', label: 'List' },
	{ value: 'grid', label: 'Grid' },
	{ value: 'table', label: 'Table' },
]

describe('ButtonGroup — toggle mode', () => {
	it('renders toggle buttons for each option', () => {
		renderUI(() => (
			<ButtonGroup
				options={TOGGLE_OPTIONS}
				value="list"
				onValueChange={vi.fn()}
			/>
		))
		expect(screen.getByRole('button', { name: 'List' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Grid' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Table' })).toBeInTheDocument()
	})

	it('calls onValueChange when an option is clicked', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		renderUI(() => (
			<ButtonGroup options={TOGGLE_OPTIONS} value="list" onValueChange={onValueChange} />
		))
		await user.click(screen.getByRole('button', { name: 'Grid' }))
		expect(onValueChange).toHaveBeenCalledWith('grid')
	})

	it('disables all buttons when disabled=true', () => {
		renderUI(() => (
			<ButtonGroup options={TOGGLE_OPTIONS} value="list" onValueChange={vi.fn()} disabled />
		))
		const buttons = screen.getAllByRole('button')
		for (const btn of buttons) {
			expect(btn).toBeDisabled()
		}
	})
})

describe('ButtonGroup — children mode', () => {
	it('renders children buttons', () => {
		renderUI(() => (
			<ButtonGroup>
				<Button>Cancel</Button>
				<Button>Save</Button>
			</ButtonGroup>
		))
		expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
	})
})
