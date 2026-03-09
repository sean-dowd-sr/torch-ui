import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import {
	HoverCardRoot,
	HoverCardTrigger,
	HoverCardContent,
	HoverCardHeader,
	HoverCardBody,
} from '../../components/overlays/HoverCard'
import { renderUI } from '../../test/test-utils'

function TestHoverCard() {
	return (
		<HoverCardRoot openDelay={0} closeDelay={0}>
			<HoverCardTrigger>Hover for info</HoverCardTrigger>
			<HoverCardContent>
				<HoverCardHeader>User Profile</HoverCardHeader>
				<HoverCardBody>Jane Doe — Product Manager</HoverCardBody>
			</HoverCardContent>
		</HoverCardRoot>
	)
}

describe('HoverCard', () => {
	it('renders trigger element', () => {
		renderUI(() => <TestHoverCard />)
		expect(screen.getByText('Hover for info')).toBeInTheDocument()
	})

	it('card is not visible before hover', () => {
		renderUI(() => <TestHoverCard />)
		expect(screen.queryByText('Jane Doe — Product Manager')).not.toBeInTheDocument()
	})

	it('card appears on hover', async () => {
		const user = userEvent.setup()
		renderUI(() => <TestHoverCard />)
		await user.hover(screen.getByText('Hover for info'))
		expect(document.body.textContent).toContain('Jane Doe')
	})

	it('card header is visible on hover', async () => {
		const user = userEvent.setup()
		renderUI(() => <TestHoverCard />)
		await user.hover(screen.getByText('Hover for info'))
		expect(document.body.textContent).toContain('User Profile')
	})
})
