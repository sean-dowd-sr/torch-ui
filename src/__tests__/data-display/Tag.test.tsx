import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { Tag } from '../../components/data-display/Tag'
import { renderUI } from '../../test/test-utils'

describe('Tag', () => {
	it('renders children text', () => {
		renderUI(() => <Tag>Active</Tag>)
		expect(screen.getByText('Active')).toBeInTheDocument()
	})

	it('renders as a span', () => {
		const { container } = renderUI(() => <Tag>Active</Tag>)
		expect(container.querySelector('span')).toBeInTheDocument()
	})

	it('renders all variants without throwing', () => {
		const variants = ['neutral', 'primary', 'success', 'warning', 'danger', 'info'] as const
		for (const variant of variants) {
			renderUI(() => <Tag variant={variant}>{variant}</Tag>)
			expect(screen.getByText(variant)).toBeInTheDocument()
		}
	})

	it('renders both sizes without throwing', () => {
		renderUI(() => <Tag size="sm">Small</Tag>)
		expect(screen.getByText('Small')).toBeInTheDocument()
		renderUI(() => <Tag size="md">Medium</Tag>)
		expect(screen.getByText('Medium')).toBeInTheDocument()
	})

	it('renders status label as accessible name on the dot when provided', () => {
		renderUI(() => <Tag statusColor="#22c55e" statusLabel="Online">Active</Tag>)
		expect(screen.getByRole('img', { name: 'Online' })).toBeInTheDocument()
	})
})
