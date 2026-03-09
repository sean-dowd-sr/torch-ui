import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { Loading } from '../../components/feedback/Loading'
import { renderUI } from '../../test/test-utils'

describe('Loading', () => {
	it('renders a status region', () => {
		renderUI(() => <Loading />)
		expect(screen.getByRole('status')).toBeInTheDocument()
	})

	it('shows default message', () => {
		renderUI(() => <Loading />)
		expect(screen.getByText('Loading…')).toBeInTheDocument()
	})

	it('shows custom message', () => {
		renderUI(() => <Loading message="Fetching data…" />)
		expect(screen.getByText('Fetching data…')).toBeInTheDocument()
	})

	it('hides message when iconOnly=true', () => {
		renderUI(() => <Loading iconOnly />)
		expect(screen.queryByText('Loading…')).not.toBeInTheDocument()
	})

	it('applies aria-label when iconOnly', () => {
		renderUI(() => <Loading iconOnly aria-label="Loading content" />)
		expect(screen.getByRole('status', { name: 'Loading content' })).toBeInTheDocument()
	})

	it('renders spinner variant by default', () => {
		renderUI(() => <Loading />)
		expect(screen.getByRole('status')).toBeInTheDocument()
	})
})
