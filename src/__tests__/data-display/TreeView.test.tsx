import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { TreeView } from '../../components/data-display/TreeView'
import type { TreeNode } from '../../components/data-display/TreeView'
import { renderUI } from '../../test/test-utils'

const NODES: TreeNode[] = [
	{
		id: 'root',
		label: 'Root',
		children: [
			{ id: 'child-1', label: 'Child One' },
			{ id: 'child-2', label: 'Child Two', children: [
				{ id: 'grandchild', label: 'Grandchild' },
			]},
		],
	},
]

describe('TreeView', () => {
	it('renders root node label', () => {
		renderUI(() => <TreeView nodes={NODES} />)
		expect(screen.getByText('Root')).toBeInTheDocument()
	})

	it('children are hidden before expanding', () => {
		renderUI(() => <TreeView nodes={NODES} />)
		expect(screen.queryByText('Child One')).not.toBeInTheDocument()
	})

	it('expanding root reveals children', async () => {
		const user = userEvent.setup()
		renderUI(() => <TreeView nodes={NODES} />)
		await user.click(screen.getByText('Root'))
		expect(screen.getByText('Child One')).toBeInTheDocument()
		expect(screen.getByText('Child Two')).toBeInTheDocument()
	})

	it('calls onSelect when a leaf node is clicked', async () => {
		const user = userEvent.setup()
		const onSelect = vi.fn()
		renderUI(() => <TreeView nodes={NODES} defaultExpanded={['root']} onSelect={onSelect} />)
		await user.click(screen.getByText('Child One'))
		expect(onSelect).toHaveBeenCalledWith('child-1')
	})

	it('renders with controlled expanded ids', () => {
		renderUI(() => <TreeView nodes={NODES} expanded={['root']} onExpandedChange={vi.fn()} />)
		expect(screen.getByText('Child One')).toBeInTheDocument()
	})

	it('highlights controlled selected node', () => {
		renderUI(() => (
			<TreeView nodes={NODES} defaultExpanded={['root']} selected="child-1" />
		))
		expect(screen.getByText('Child One')).toBeInTheDocument()
	})
})
