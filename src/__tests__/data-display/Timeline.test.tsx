import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { Timeline } from '../../components/data-display/Timeline'
import { renderUI } from '../../test/test-utils'

const ITEMS = [
	{ title: 'Order placed', time: 'Jan 1', status: 'completed' as const },
	{ title: 'In transit', description: 'Package is on its way', status: 'active' as const },
	{ title: 'Delivered', status: 'pending' as const },
]

describe('Timeline', () => {
	it('renders all item titles', () => {
		renderUI(() => <Timeline items={ITEMS} />)
		expect(screen.getByText('Order placed')).toBeInTheDocument()
		expect(screen.getByText('In transit')).toBeInTheDocument()
		expect(screen.getByText('Delivered')).toBeInTheDocument()
	})

	it('renders time labels', () => {
		renderUI(() => <Timeline items={ITEMS} />)
		expect(screen.getByText('Jan 1')).toBeInTheDocument()
	})

	it('renders description when provided', () => {
		renderUI(() => <Timeline items={ITEMS} />)
		expect(screen.getByText('Package is on its way')).toBeInTheDocument()
	})

	it('renders all statuses without throwing', () => {
		const statuses = ['completed', 'active', 'pending', 'error'] as const
		for (const status of statuses) {
			renderUI(() => (
				<Timeline items={[{ title: status, status }]} />
			))
		}
	})

	it('renders all variants without throwing', () => {
		const variants = ['default', 'compact', 'outlined'] as const
		for (const variant of variants) {
			renderUI(() => <Timeline items={ITEMS} variant={variant} />)
		}
	})
})
