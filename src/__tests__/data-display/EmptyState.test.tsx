import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { EmptyState } from '../../components/data-display/EmptyState'
import { renderUI } from '../../test/test-utils'

describe('EmptyState', () => {
	it('renders title', () => {
		renderUI(() => <EmptyState title="No results found" />)
		expect(screen.getByRole('heading', { name: 'No results found' })).toBeInTheDocument()
	})

	it('renders description when provided', () => {
		renderUI(() => (
			<EmptyState title="No items" description="Try adjusting your filters." />
		))
		expect(screen.getByText('Try adjusting your filters.')).toBeInTheDocument()
	})

	it('renders actions slot', () => {
		renderUI(() => (
			<EmptyState title="Empty" actions={<button type="button">Add item</button>} />
		))
		expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument()
	})

	it('has role="status" + aria-live when announce=true', () => {
		renderUI(() => <EmptyState title="No results" announce />)
		expect(screen.getByRole('status')).toBeInTheDocument()
	})

	it('no role by default', () => {
		renderUI(() => <EmptyState title="No results" />)
		expect(screen.queryByRole('status')).not.toBeInTheDocument()
	})
})
