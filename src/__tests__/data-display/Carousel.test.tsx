import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { Carousel } from '../../components/data-display/Carousel'
import { renderUI } from '../../test/test-utils'

const SLIDES = [
	{ id: 'slide-1', content: <div>Slide One</div> },
	{ id: 'slide-2', content: <div>Slide Two</div> },
	{ id: 'slide-3', content: <div>Slide Three</div> },
]

describe('Carousel', () => {
	it('renders first slide content', () => {
		renderUI(() => <Carousel slides={SLIDES} aria-label="Test carousel" />)
		expect(screen.getByText('Slide One')).toBeInTheDocument()
	})

	it('renders dot indicators by default', () => {
		const { container } = renderUI(() => (
			<Carousel slides={SLIDES} aria-label="Test carousel" />
		))
		const dots = container.querySelectorAll('[aria-label^="Go to slide"]')
		expect(dots.length).toBe(SLIDES.length)
	})

	it('does not render dots when showDots=false', () => {
		const { container } = renderUI(() => (
			<Carousel slides={SLIDES} showDots={false} aria-label="Test carousel" />
		))
		const dots = container.querySelectorAll('[aria-label^="Go to slide"]')
		expect(dots.length).toBe(0)
	})

	it('renders prev/next arrows when showArrows=true', () => {
		renderUI(() => (
			<Carousel slides={SLIDES} showArrows aria-label="Test carousel" />
		))
		expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
	})

	it('has accessible region label', () => {
		renderUI(() => <Carousel slides={SLIDES} aria-label="Product images" />)
		expect(screen.getByRole('region', { name: 'Product images' })).toBeInTheDocument()
	})

	it('navigates to next slide when next arrow clicked', async () => {
		const user = userEvent.setup()
		renderUI(() => (
			<Carousel slides={SLIDES} showArrows aria-label="Test carousel" />
		))
		await user.click(screen.getByRole('button', { name: /next/i }))
		expect(screen.getByText('Slide Two')).toBeInTheDocument()
	})
})
