import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { Progress } from '../../components/feedback/Progress'
import { renderUI } from '../../test/test-utils'

describe('Progress', () => {
	it('renders a progressbar', () => {
		renderUI(() => <Progress value={50} label="Loading" />)
		expect(screen.getByRole('progressbar')).toBeInTheDocument()
	})

	it('renders label text', () => {
		renderUI(() => <Progress value={30} label="Uploading files" />)
		expect(screen.getByText('Uploading files')).toBeInTheDocument()
	})

	it('reflects value via aria-valuenow', () => {
		renderUI(() => <Progress value={75} label="Progress" />)
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75')
	})

	it('renders indeterminate when no value is given', () => {
		renderUI(() => <Progress label="Loading" />)
		const bar = screen.getByRole('progressbar')
		expect(bar).toBeInTheDocument()
	})

	it('renders all color variants without throwing', () => {
		const colors = ['default', 'primary', 'success', 'warning', 'danger'] as const
		for (const color of colors) {
			renderUI(() => <Progress value={50} color={color} label={color} />)
		}
	})

	it('renders all sizes without throwing', () => {
		const sizes = ['sm', 'md', 'lg'] as const
		for (const size of sizes) {
			renderUI(() => <Progress value={50} size={size} label={size} />)
		}
	})
})
