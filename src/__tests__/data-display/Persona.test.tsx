import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { Persona } from '../../components/data-display/Persona'
import { renderUI } from '../../test/test-utils'

describe('Persona', () => {
	it('renders name', () => {
		renderUI(() => <Persona name="Jane Doe" />)
		expect(screen.getByText('Jane Doe')).toBeInTheDocument()
	})

	it('renders secondary text', () => {
		renderUI(() => <Persona name="Jane Doe" secondary="Product Manager" />)
		expect(screen.getByText('Product Manager')).toBeInTheDocument()
	})

	it('does not render secondary when omitted', () => {
		renderUI(() => <Persona name="Jane Doe" />)
		expect(screen.queryByText('Product Manager')).not.toBeInTheDocument()
	})

	it('renders all sizes without throwing', () => {
		const sizes = ['sm', 'md', 'lg'] as const
		for (const size of sizes) {
			renderUI(() => <Persona name="Test User" size={size} />)
		}
	})

	it('renders children slot', () => {
		renderUI(() => (
			<Persona name="Jane">
				<button type="button">Message</button>
			</Persona>
		))
		expect(screen.getByRole('button', { name: 'Message' })).toBeInTheDocument()
	})

	it('shows avatar initials', () => {
		renderUI(() => <Persona name="Jane Doe" />)
		expect(screen.getByText('JD')).toBeInTheDocument()
	})
})
