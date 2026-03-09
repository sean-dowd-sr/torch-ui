import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { PageHeading } from '../../components/layout/PageHeading'
import { renderUI } from '../../test/test-utils'

describe('PageHeading', () => {
	it('renders title', () => {
		renderUI(() => <PageHeading title="Dashboard" />)
		expect(screen.getByText('Dashboard')).toBeInTheDocument()
	})

	it('renders description', () => {
		renderUI(() => <PageHeading title="Dashboard" description="Welcome back" />)
		expect(screen.getByText('Welcome back')).toBeInTheDocument()
	})

	it('renders descriptionContent JSX', () => {
		renderUI(() => (
			<PageHeading title="Settings" descriptionContent={<span>Custom description</span>} />
		))
		expect(screen.getByText('Custom description')).toBeInTheDocument()
	})

	it('renders as h1 by default', () => {
		renderUI(() => <PageHeading title="My Page" />)
		expect(screen.getByRole('heading', { level: 1, name: 'My Page' })).toBeInTheDocument()
	})

	it('renders as h2 when level=2', () => {
		renderUI(() => <PageHeading title="Section" level={2} />)
		expect(screen.getByRole('heading', { level: 2, name: 'Section' })).toBeInTheDocument()
	})
})
