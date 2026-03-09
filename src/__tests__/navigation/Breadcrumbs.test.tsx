import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { Breadcrumbs } from '../../components/navigation/Breadcrumbs'
import { renderUI } from '../../test/test-utils'

const ITEMS = [
	{ label: 'Home', href: '/' },
	{ label: 'Products', href: '/products' },
	{ label: 'Current Page' },
]

describe('Breadcrumbs', () => {
	it('renders all item labels', () => {
		renderUI(() => <Breadcrumbs items={ITEMS} />)
		expect(screen.getByText('Home')).toBeInTheDocument()
		expect(screen.getByText('Products')).toBeInTheDocument()
		expect(screen.getByText('Current Page')).toBeInTheDocument()
	})

	it('renders links for items with href (except last)', () => {
		renderUI(() => <Breadcrumbs items={ITEMS} />)
		const homeLink = screen.getByText('Home').closest('a')
		expect(homeLink).toHaveAttribute('href', '/')
	})

	it('last item is not a link', () => {
		renderUI(() => <Breadcrumbs items={ITEMS} />)
		const lastItem = screen.getByText('Current Page')
		expect(lastItem.tagName).not.toBe('A')
	})

	it('last item has aria-current="page"', () => {
		renderUI(() => <Breadcrumbs items={ITEMS} />)
		expect(screen.getByText('Current Page')).toHaveAttribute('aria-current', 'page')
	})

	it('renders a single item without error', () => {
		renderUI(() => <Breadcrumbs items={[{ label: 'Home' }]} />)
		expect(screen.getByText('Home')).toBeInTheDocument()
	})
})
