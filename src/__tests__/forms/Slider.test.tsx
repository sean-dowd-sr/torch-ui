import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { Slider } from '../../components/forms/Slider'
import { renderUI } from '../../test/test-utils'

describe('Slider', () => {
	it('renders a slider', () => {
		renderUI(() => <Slider label="Volume" />)
		expect(screen.getAllByRole('slider').length).toBeGreaterThanOrEqual(1)
	})

	it('renders label text', () => {
		renderUI(() => <Slider label="Brightness" />)
		expect(screen.getByText('Brightness')).toBeInTheDocument()
	})

	it('reflects controlled value via aria-valuenow', () => {
		renderUI(() => <Slider label="Volume" value={[75]} />)
		const slider = screen.getAllByRole('slider')[0]
		expect(slider).toHaveAttribute('aria-valuenow', '75')
	})

	it('reflects min and max via aria attributes', () => {
		renderUI(() => <Slider label="Range" minValue={10} maxValue={200} />)
		const slider = screen.getAllByRole('slider')[0]
		expect(slider).toHaveAttribute('aria-valuemin', '10')
		expect(slider).toHaveAttribute('aria-valuemax', '200')
	})

	it('shows error message', () => {
		renderUI(() => <Slider label="Volume" error="Value required" />)
		expect(screen.getByText('Value required')).toBeInTheDocument()
	})

	it('shows helper text', () => {
		renderUI(() => <Slider label="Volume" helperText="Drag to adjust" />)
		expect(screen.getByText('Drag to adjust')).toBeInTheDocument()
	})

	it('is disabled when disabled=true', () => {
		renderUI(() => <Slider label="Volume" disabled />)
		// Kobalte Slider uses data-disabled instead of HTML disabled attribute
		expect(screen.getAllByRole('slider')[0]).toHaveAttribute('data-disabled')
	})

	it('renders all orientations without throwing', () => {
		renderUI(() => <Slider label="H" orientation="horizontal" />)
		renderUI(() => <Slider label="V" orientation="vertical" />)
	})

	it('renders two thumbs for range slider', () => {
		renderUI(() => <Slider label="Range" value={[20, 80]} />)
		const sliders = screen.getAllByRole('slider')
		expect(sliders.length).toBeGreaterThanOrEqual(2)
	})
})
