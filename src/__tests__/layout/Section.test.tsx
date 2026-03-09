import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { Section } from '../../components/layout/Section'
import { renderUI } from '../../test/test-utils'

describe('Section', () => {
	it('renders children', () => {
		renderUI(() => <Section>Content here</Section>)
		expect(screen.getByText('Content here')).toBeInTheDocument()
	})

	it('renders title as h2', () => {
		renderUI(() => <Section title="Settings">Child</Section>)
		expect(screen.getByRole('heading', { level: 2, name: 'Settings' })).toBeInTheDocument()
	})

	it('renders description text', () => {
		renderUI(() => <Section description="Manage your account settings">Child</Section>)
		expect(screen.getByText('Manage your account settings')).toBeInTheDocument()
	})

	it('renders a section element', () => {
		const { container } = renderUI(() => <Section>Content</Section>)
		expect(container.querySelector('section')).toBeInTheDocument()
	})

	it('applies id to section element', () => {
		const { container } = renderUI(() => <Section id="settings-section">Content</Section>)
		expect(container.querySelector('#settings-section')).toBeInTheDocument()
	})

	it('renders descriptionContent JSX over description string', () => {
		renderUI(() => (
			<Section descriptionContent={<span>Custom desc</span>}>Child</Section>
		))
		expect(screen.getByText('Custom desc')).toBeInTheDocument()
	})
})
