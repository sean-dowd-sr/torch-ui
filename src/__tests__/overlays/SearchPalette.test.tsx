import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { SearchPalette } from '../../components/overlays/SearchPalette'
import { renderUI } from '../../test/test-utils'

const GROUPS = [
	{
		title: 'Pages',
		items: [
			{ key: 'home', label: 'Home' },
			{ key: 'settings', label: 'Settings' },
		],
	},
]

describe('SearchPalette', () => {
	it('does not render when closed', () => {
		renderUI(() => (
			<SearchPalette
				open={false}
				onOpenChange={vi.fn()}
				query=""
				onQueryChange={vi.fn()}
				groups={GROUPS}
				onSelect={vi.fn()}
			/>
		))
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
	})

	it('renders search input when open', () => {
		renderUI(() => (
			<SearchPalette
				open
				onOpenChange={vi.fn()}
				query=""
				onQueryChange={vi.fn()}
				groups={GROUPS}
				onSelect={vi.fn()}
			/>
		))
		expect(screen.getByRole('textbox')).toBeInTheDocument()
	})

	it('renders result items when open', () => {
		renderUI(() => (
			<SearchPalette
				open
				onOpenChange={vi.fn()}
				query=""
				onQueryChange={vi.fn()}
				groups={GROUPS}
				onSelect={vi.fn()}
			/>
		))
		expect(screen.getByText('Home')).toBeInTheDocument()
		expect(screen.getByText('Settings')).toBeInTheDocument()
	})

	it('calls onQueryChange when typing', async () => {
		const user = userEvent.setup()
		const onQueryChange = vi.fn()
		renderUI(() => (
			<SearchPalette
				open
				onOpenChange={vi.fn()}
				query=""
				onQueryChange={onQueryChange}
				groups={GROUPS}
				onSelect={vi.fn()}
			/>
		))
		await user.type(screen.getByRole('textbox'), 'h')
		expect(onQueryChange).toHaveBeenCalled()
	})

	it('calls onSelect when an item is clicked', async () => {
		const user = userEvent.setup()
		const onSelect = vi.fn()
		renderUI(() => (
			<SearchPalette
				open
				onOpenChange={vi.fn()}
				query=""
				onQueryChange={vi.fn()}
				groups={GROUPS}
				onSelect={onSelect}
			/>
		))
		await user.click(screen.getByText('Home'))
		expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ key: 'home' }))
	})
})
