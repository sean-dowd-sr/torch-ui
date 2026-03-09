import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { ReorderableList } from '../../components/forms/ReorderableList'
import { renderUI } from '../../test/test-utils'

const ITEMS = [
	{ id: 'a', label: 'Apple' },
	{ id: 'b', label: 'Banana' },
	{ id: 'c', label: 'Cherry' },
]

describe('ReorderableList', () => {
	it('renders all item labels', () => {
		renderUI(() => (
			<ReorderableList items={ITEMS} onReorder={vi.fn()} />
		))
		expect(screen.getByText('Apple')).toBeInTheDocument()
		expect(screen.getByText('Banana')).toBeInTheDocument()
		expect(screen.getByText('Cherry')).toBeInTheDocument()
	})

	it('renders a list element', () => {
		const { container } = renderUI(() => (
			<ReorderableList items={ITEMS} onReorder={vi.fn()} />
		))
		expect(container.querySelector('ul, ol, [role="list"]')).toBeInTheDocument()
	})

	it('renders without throwing when items is empty', () => {
		const { container } = renderUI(() => (
			<ReorderableList items={[]} onReorder={vi.fn()} />
		))
		expect(container.firstChild).toBeInTheDocument()
	})
})
