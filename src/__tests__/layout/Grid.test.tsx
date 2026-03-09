import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { Grid } from '../../components/layout/Grid'
import { Container } from '../../components/layout/Container'
import { renderUI } from '../../test/test-utils'

describe('Grid', () => {
	it('renders children', () => {
		renderUI(() => (
			<Grid>
				<div>Cell 1</div>
				<div>Cell 2</div>
			</Grid>
		))
		expect(screen.getByText('Cell 1')).toBeInTheDocument()
		expect(screen.getByText('Cell 2')).toBeInTheDocument()
	})

	it('renders as a div', () => {
		const { container } = renderUI(() => (
			<Grid><span>item</span></Grid>
		))
		expect(container.querySelector('div')).toBeInTheDocument()
	})

	it('renders all column variants without throwing', () => {
		const cols = [1, 2, 3, 4, 5, 6] as const
		for (const cols_ of cols) {
			renderUI(() => <Grid cols={cols_}><span>item</span></Grid>)
		}
	})

	it('renders all gap variants without throwing', () => {
		const gaps = ['none', 'sm', 'md', 'lg'] as const
		for (const gap of gaps) {
			renderUI(() => <Grid gap={gap}><span>item</span></Grid>)
		}
	})
})

describe('Container', () => {
	it('renders children', () => {
		renderUI(() => <Container>Content</Container>)
		expect(screen.getByText('Content')).toBeInTheDocument()
	})

	it('renders all size variants without throwing', () => {
		const sizes = ['sm', 'md', 'lg', 'xl', '2xl', 'full'] as const
		for (const size of sizes) {
			renderUI(() => <Container size={size}>Content</Container>)
		}
	})
})
