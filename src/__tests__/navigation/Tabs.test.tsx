import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { Tabs } from '../../components/navigation/Tabs'
import { renderUI } from '../../test/test-utils'

const TABS = [
	{ id: 'overview', label: 'Overview' },
	{ id: 'settings', label: 'Settings' },
	{ id: 'billing', label: 'Billing' },
]

describe('Tabs', () => {
	it('renders all tab labels', () => {
		renderUI(() => <Tabs tabs={TABS} />)
		expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument()
		expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument()
		expect(screen.getByRole('tab', { name: 'Billing' })).toBeInTheDocument()
	})

	it('first tab is selected by default (uncontrolled)', () => {
		renderUI(() => <Tabs tabs={TABS} />)
		expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('data-selected')
	})

	it('controlled value selects the correct tab', () => {
		renderUI(() => <Tabs tabs={TABS} value="settings" />)
		expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('data-selected')
	})

	it('calls onValueChange when a tab is clicked', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		renderUI(() => <Tabs tabs={TABS} onValueChange={onValueChange} />)
		await user.click(screen.getByRole('tab', { name: 'Billing' }))
		expect(onValueChange).toHaveBeenCalledWith('billing')
	})

	it('renders tablist with accessible label', () => {
		renderUI(() => <Tabs tabs={TABS} ariaLabel="Main navigation" />)
		expect(screen.getByRole('tablist', { name: 'Main navigation' })).toBeInTheDocument()
	})
})
