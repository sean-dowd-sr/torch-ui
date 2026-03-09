import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { Icon } from '../../components/typography/Icon'
import { renderUI } from '../../test/test-utils'

describe('Icon', () => {
	it('renders an img element', () => {
		const { container } = renderUI(() => <Icon src="/icons/star.svg" />)
		expect(container.querySelector('img')).toBeInTheDocument()
	})

	it('sets the src attribute', () => {
		const { container } = renderUI(() => <Icon src="/icons/star.svg" />)
		expect(container.querySelector('img')).toHaveAttribute('src', '/icons/star.svg')
	})

	it('is decorative by default (aria-hidden="true", alt="")', () => {
		const { container } = renderUI(() => <Icon src="/icons/star.svg" />)
		const img = container.querySelector('img')!
		expect(img).toHaveAttribute('aria-hidden', 'true')
		expect(img).toHaveAttribute('alt', '')
	})

	it('is accessible when alt and aria-hidden override provided', () => {
		renderUI(() => (
			<Icon src="/icons/star.svg" alt="Favorite" aria-hidden="false" />
		))
		expect(screen.getByRole('img', { name: 'Favorite' })).toBeInTheDocument()
	})

	it('uses default size 16', () => {
		const { container } = renderUI(() => <Icon src="/icons/star.svg" />)
		const img = container.querySelector('img')!
		expect(img).toHaveAttribute('width', '16')
		expect(img).toHaveAttribute('height', '16')
	})

	it('applies custom size', () => {
		const { container } = renderUI(() => <Icon src="/icons/star.svg" size={24} />)
		const img = container.querySelector('img')!
		expect(img).toHaveAttribute('width', '24')
		expect(img).toHaveAttribute('height', '24')
	})
})
