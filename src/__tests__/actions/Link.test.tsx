import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { Link } from '../../components/actions/Link'
import { renderUI } from '../../test/test-utils'

describe('Link', () => {
	it('renders an anchor element', () => {
		renderUI(() => <Link href="/home">Home</Link>)
		expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
	})

	it('has the correct href', () => {
		renderUI(() => <Link href="/about">About</Link>)
		expect(screen.getByRole('link')).toHaveAttribute('href', '/about')
	})

	it('renders primary variant by default', () => {
		renderUI(() => <Link href="#">Click</Link>)
		const link = screen.getByRole('link')
		expect(link.className).toContain('text-primary')
	})

	it('renders muted variant', () => {
		renderUI(() => <Link href="#" variant="muted">Muted</Link>)
		const link = screen.getByRole('link')
		expect(link.className).toContain('text-ink')
	})

	it('passes through extra attributes', () => {
		renderUI(() => <Link href="https://example.com" target="_blank" rel="noopener">External</Link>)
		const link = screen.getByRole('link')
		expect(link).toHaveAttribute('target', '_blank')
		expect(link).toHaveAttribute('rel', 'noopener')
	})
})
