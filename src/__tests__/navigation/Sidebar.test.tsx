import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { Sidebar } from '../../components/navigation/Sidebar'
import { renderUI } from '../../test/test-utils'

const ITEMS = [
	{ key: 'home', label: 'Home', onClick: vi.fn() },
	{ key: 'settings', label: 'Settings', onClick: vi.fn() },
	{ key: 'profile', label: 'Profile', disabled: true, onClick: vi.fn() },
]

describe('Sidebar', () => {
	it('renders navigation items', () => {
		renderUI(() => <Sidebar items={ITEMS} />)
		expect(screen.getByText('Home')).toBeInTheDocument()
		expect(screen.getByText('Settings')).toBeInTheDocument()
		expect(screen.getByText('Profile')).toBeInTheDocument()
	})

	it('renders title when showTitle=true', () => {
		renderUI(() => <Sidebar items={ITEMS} title="Navigation" showTitle />)
		expect(screen.getByText('Navigation')).toBeInTheDocument()
	})

	it('calls onClick for an item', async () => {
		const user = userEvent.setup()
		const onClick = vi.fn()
		renderUI(() => (
			<Sidebar items={[{ key: 'home', label: 'Home', onClick }]} />
		))
		await user.click(screen.getByText('Home'))
		expect(onClick).toHaveBeenCalledTimes(1)
	})

	it('renders header slot', () => {
		renderUI(() => (
			<Sidebar items={ITEMS} header={<div>App Logo</div>} />
		))
		expect(screen.getByText('App Logo')).toBeInTheDocument()
	})

	it('renders groups', () => {
		renderUI(() => (
			<Sidebar
				groups={[
					{
						title: 'Admin',
						defaultOpen: true,
						items: [
							{ key: 'users', label: 'Users', onClick: vi.fn() },
						],
					},
				]}
			/>
		))
		expect(screen.getByText('Admin')).toBeInTheDocument()
		expect(document.body.textContent).toContain('Users')
	})
})
