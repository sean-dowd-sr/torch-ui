import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { Avatar } from '../../components/data-display/Avatar'
import { renderUI } from '../../test/test-utils'

describe('Avatar', () => {
	it('renders with name as title', () => {
		renderUI(() => <Avatar name="Jane Doe" />)
		expect(screen.getByTitle('Jane Doe')).toBeInTheDocument()
	})

	it('shows initials from name', () => {
		renderUI(() => <Avatar name="Jane Doe" />)
		expect(screen.getByText('JD')).toBeInTheDocument()
	})

	it('shows single initial for single-word name', () => {
		renderUI(() => <Avatar name="Alice" />)
		expect(screen.getByText('A')).toBeInTheDocument()
	})

	it('renders img element when imageUrl is provided', () => {
		const { container } = renderUI(() => <Avatar name="Jane Doe" imageUrl="https://example.com/avatar.jpg" />)
		const img = container.querySelector('img')
		expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
	})

	it('renders all color variants without throwing', () => {
		const colors = ['neutral', 'primary', 'success', 'warning', 'danger', 'info'] as const
		for (const color of colors) {
			renderUI(() => <Avatar name="Test User" color={color} />)
		}
	})

	it('renders all shape variants without throwing', () => {
		const shapes = ['circle', 'rounded', 'square'] as const
		for (const shape of shapes) {
			renderUI(() => <Avatar name="Test" shape={shape} />)
		}
	})

	it('renders all sizes without throwing', () => {
		const sizes = ['sm', 'md', 'lg'] as const
		for (const size of sizes) {
			renderUI(() => <Avatar name="Test" size={size} />)
		}
	})

	it('is decorative (aria-hidden) when decorative=true', () => {
		const { container } = renderUI(() => <Avatar name="Test" decorative />)
		const root = container.firstChild as HTMLElement
		expect(root).toHaveAttribute('aria-hidden', 'true')
	})
})
