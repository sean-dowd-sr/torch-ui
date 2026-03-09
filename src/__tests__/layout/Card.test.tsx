import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { Card } from '../../components/layout/Card'
import { renderUI } from '../../test/test-utils'

describe('Card', () => {
	it('renders children', () => {
		renderUI(() => <Card>Card content</Card>)
		expect(screen.getByText('Card content')).toBeInTheDocument()
	})

	it('renders as a div', () => {
		const { container } = renderUI(() => <Card>Content</Card>)
		expect(container.querySelector('div')).toBeInTheDocument()
	})

	it('renders both variants without throwing', () => {
		renderUI(() => <Card variant="default">Default</Card>)
		expect(screen.getByText('Default')).toBeInTheDocument()
		renderUI(() => <Card variant="flat">Flat</Card>)
		expect(screen.getByText('Flat')).toBeInTheDocument()
	})

	it('renders Card.Header with title', () => {
		renderUI(() => (
			<Card>
				<Card.Header title="Header text" />
			</Card>
		))
		expect(screen.getByText('Header text')).toBeInTheDocument()
	})

	it('renders Card.Body', () => {
		renderUI(() => (
			<Card>
				<Card.Body>Body content</Card.Body>
			</Card>
		))
		expect(screen.getByText('Body content')).toBeInTheDocument()
	})

	it('renders horizontal layout', () => {
		const { container } = renderUI(() => <Card horizontal>Content</Card>)
		const card = container.firstChild as HTMLElement
		expect(card.className).toContain('flex-row')
	})
})
