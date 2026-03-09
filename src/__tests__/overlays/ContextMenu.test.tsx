import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import {
	ContextMenuRoot,
	ContextMenuTrigger,
	ContextMenuContent,
	ContextMenuItem,
} from '../../components/overlays/ContextMenu'
import { renderUI } from '../../test/test-utils'

function TestContextMenu() {
	return (
		<ContextMenuRoot>
			<ContextMenuTrigger as="div">Right-click me</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem onSelect={vi.fn()}>Copy</ContextMenuItem>
				<ContextMenuItem onSelect={vi.fn()}>Paste</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenuRoot>
	)
}

describe('ContextMenu', () => {
	it('renders the trigger element', () => {
		renderUI(() => <TestContextMenu />)
		expect(screen.getByText('Right-click me')).toBeInTheDocument()
	})

	it('menu is not visible before right-click', () => {
		renderUI(() => <TestContextMenu />)
		expect(screen.queryByRole('menu')).not.toBeInTheDocument()
	})

	it('right-clicking opens the context menu', async () => {
		const user = userEvent.setup()
		renderUI(() => <TestContextMenu />)
		await user.pointer({ keys: '[MouseRight]', target: screen.getByText('Right-click me') })
		expect(screen.getByRole('menu')).toBeInTheDocument()
	})

	it('menu items are visible after opening', async () => {
		const user = userEvent.setup()
		renderUI(() => <TestContextMenu />)
		await user.pointer({ keys: '[MouseRight]', target: screen.getByText('Right-click me') })
		expect(screen.getByRole('menuitem', { name: 'Copy' })).toBeInTheDocument()
		expect(screen.getByRole('menuitem', { name: 'Paste' })).toBeInTheDocument()
	})
})
