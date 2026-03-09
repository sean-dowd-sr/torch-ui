import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { Divider } from '../../components/layout/Divider'
import { renderUI } from '../../test/test-utils'

describe('Divider', () => {
	it('renders a separator', () => {
		renderUI(() => <Divider />)
		expect(screen.getByRole('separator')).toBeInTheDocument()
	})

	it('renders a label when provided', () => {
		renderUI(() => <Divider label="or" />)
		expect(screen.getByText('or')).toBeInTheDocument()
	})

	it('renders without label by default', () => {
		renderUI(() => <Divider />)
		expect(screen.queryByText('or')).not.toBeInTheDocument()
	})

	it('renders all lineStyle variants without throwing', () => {
		const styles = ['solid', 'dotted', 'dashed'] as const
		for (const lineStyle of styles) {
			renderUI(() => <Divider lineStyle={lineStyle} />)
		}
	})

	it('renders all weight variants without throwing', () => {
		const weights = ['thin', 'medium', 'thick'] as const
		for (const weight of weights) {
			renderUI(() => <Divider weight={weight} />)
		}
	})
})
