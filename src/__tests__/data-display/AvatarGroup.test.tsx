import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { AvatarGroup } from '../../components/data-display/AvatarGroup'
import { renderUI } from '../../test/test-utils'

const AVATARS = [
	{ name: 'Alice Smith' },
	{ name: 'Bob Jones' },
	{ name: 'Carol White' },
	{ name: 'David Brown' },
	{ name: 'Eve Davis' },
]

describe('AvatarGroup', () => {
	it('renders visible avatars', () => {
		renderUI(() => <AvatarGroup avatars={AVATARS} max={3} />)
		expect(screen.getByTitle('Alice Smith')).toBeInTheDocument()
		expect(screen.getByTitle('Bob Jones')).toBeInTheDocument()
	})

	it('shows overflow count when items exceed max', () => {
		renderUI(() => <AvatarGroup avatars={AVATARS} max={3} />)
		expect(screen.getByText('+2')).toBeInTheDocument()
	})

	it('does not show overflow when items <= max', () => {
		renderUI(() => <AvatarGroup avatars={AVATARS.slice(0, 3)} max={3} />)
		expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument()
	})

	it('renders all items when max not specified', () => {
		renderUI(() => <AvatarGroup avatars={AVATARS} />)
		for (const item of AVATARS) {
			expect(screen.getByTitle(item.name)).toBeInTheDocument()
		}
	})

	it('renders all sizes without throwing', () => {
		const sizes = ['sm', 'md', 'lg'] as const
		for (const size of sizes) {
			renderUI(() => <AvatarGroup avatars={AVATARS.slice(0, 3)} size={size} />)
		}
	})
})
