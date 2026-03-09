import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { ColorSwatch } from '../../components/data-display/ColorSwatch'
import { renderUI } from '../../test/test-utils'

describe('ColorSwatch', () => {
	it('renders an element', () => {
		const { container } = renderUI(() => <ColorSwatch value="#3b82f6" />)
		expect(container.firstChild).toBeInTheDocument()
	})

	it('uses colorName as accessible label', () => {
		renderUI(() => <ColorSwatch value="#3b82f6" colorName="Blue" />)
		// Kobalte may include the color description in the accessible name alongside colorName
		expect(screen.getByRole('img', { name: /Blue/ })).toBeInTheDocument()
	})

	it('uses aria-label when provided', () => {
		renderUI(() => (
			<ColorSwatch value="#3b82f6" aria-label="Primary blue color" />
		))
		// Kobalte may prepend its own color description; match on the provided label
		expect(screen.getByRole('img', { name: /Primary blue color/ })).toBeInTheDocument()
	})

	it('renders all variants without throwing', () => {
		const variants = ['rounded', 'circle', 'square'] as const
		for (const variant of variants) {
			renderUI(() => <ColorSwatch value="#ef4444" variant={variant} colorName="Red" />)
		}
	})

	it('handles invalid hex gracefully', () => {
		const { container } = renderUI(() => <ColorSwatch value="not-a-color" colorName="Invalid" />)
		expect(container.firstChild).toBeInTheDocument()
	})
})
