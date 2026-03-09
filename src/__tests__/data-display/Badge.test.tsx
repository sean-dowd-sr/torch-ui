import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { Badge } from '../../components/data-display/Badge'
import { renderUI } from '../../test/test-utils'

describe('Badge', () => {
	it('renders children as pill', () => {
		renderUI(() => <Badge decorative={false} aria-label="3 notifications">3</Badge>)
		expect(screen.getByText('3')).toBeInTheDocument()
	})

	it('renders as a dot when no children or icon', () => {
		const { container } = renderUI(() => <Badge />)
		expect(container.querySelector('span')).toBeInTheDocument()
	})

	it('is aria-hidden by default (decorative)', () => {
		const { container } = renderUI(() => <Badge />)
		expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
	})

	it('is not aria-hidden when decorative=false and aria-label given', () => {
		renderUI(() => <Badge decorative={false} aria-label="5 items">5</Badge>)
		const badge = screen.getByText('5')
		expect(badge.closest('[aria-hidden]')).toBeNull()
	})

	it('renders all variants without throwing', () => {
		const variants = ['neutral', 'primary', 'success', 'warning', 'danger', 'info'] as const
		for (const variant of variants) {
			renderUI(() => <Badge variant={variant} />)
		}
	})

	it('renders all sizes without throwing', () => {
		const sizes = ['sm', 'md', 'lg'] as const
		for (const size of sizes) {
			renderUI(() => <Badge size={size}>1</Badge>)
		}
	})
})
