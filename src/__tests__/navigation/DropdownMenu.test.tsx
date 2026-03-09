import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from '../../components/navigation/DropdownMenu'
import { renderUI } from '../../test/test-utils'

function TestDropdown() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onSelect={vi.fn()}>Edit</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onSelect={vi.fn()}>Delete</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

describe('DropdownMenu', () => {
	it('renders trigger button', () => {
		renderUI(() => <TestDropdown />)
		expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
	})

	it('menu is not visible before clicking', () => {
		renderUI(() => <TestDropdown />)
		expect(screen.queryByRole('menu')).not.toBeInTheDocument()
	})

	it('clicking trigger opens the menu', async () => {
		const user = userEvent.setup()
		renderUI(() => <TestDropdown />)
		await user.click(screen.getByRole('button', { name: 'Open menu' }))
		expect(screen.getByRole('menu')).toBeInTheDocument()
	})

	it('menu items are visible after opening', async () => {
		const user = userEvent.setup()
		renderUI(() => <TestDropdown />)
		await user.click(screen.getByRole('button', { name: 'Open menu' }))
		expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument()
		expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument()
	})

	it('pressing Escape closes the menu', async () => {
		const user = userEvent.setup()
		renderUI(() => <TestDropdown />)
		await user.click(screen.getByRole('button', { name: 'Open menu' }))
		expect(screen.getByRole('menu')).toBeInTheDocument()
		await user.keyboard('{Escape}')
		// After Escape, menu should be closed (removed from DOM or data-closed)
		const menu = screen.queryByRole('menu')
		if (menu) {
			expect(menu.getAttribute('data-closed')).not.toBeNull()
		} else {
			expect(menu).not.toBeInTheDocument()
		}
	})
})
