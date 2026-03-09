import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import {
	PopoverRoot,
	PopoverTrigger,
	PopoverContent,
} from '../../components/overlays/Popover'
import { renderUI } from '../../test/test-utils'

function TestPopover() {
	return (
		<PopoverRoot>
			<PopoverTrigger as="button" type="button">Open popover</PopoverTrigger>
			<PopoverContent>Popover body text</PopoverContent>
		</PopoverRoot>
	)
}

describe('Popover', () => {
	it('renders trigger', () => {
		renderUI(() => <TestPopover />)
		expect(screen.getByRole('button', { name: 'Open popover' })).toBeInTheDocument()
	})

	it('popover content is not visible before clicking', () => {
		renderUI(() => <TestPopover />)
		expect(screen.queryByText('Popover body text')).not.toBeInTheDocument()
	})

	it('clicking trigger reveals popover content', async () => {
		const user = userEvent.setup()
		renderUI(() => <TestPopover />)
		await user.click(screen.getByRole('button', { name: 'Open popover' }))
		expect(screen.getByText('Popover body text')).toBeInTheDocument()
	})

	it('pressing Escape closes popover', async () => {
		const user = userEvent.setup()
		renderUI(() => <TestPopover />)
		await user.click(screen.getByRole('button', { name: 'Open popover' }))
		expect(screen.getByText('Popover body text')).toBeInTheDocument()
		await user.keyboard('{Escape}')
		// After Escape, trigger should still be accessible (popover closed)
		expect(screen.getByRole('button', { name: 'Open popover' })).toBeInTheDocument()
	})
})
