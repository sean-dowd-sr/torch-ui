import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import {
	CollapsibleRoot,
	CollapsibleTriggerStyled,
	CollapsibleContentStyled,
} from '../../components/layout/Collapsible'
import { renderUI } from '../../test/test-utils'

function TestCollapsible() {
	return (
		<CollapsibleRoot>
			<CollapsibleTriggerStyled>Toggle</CollapsibleTriggerStyled>
			<CollapsibleContentStyled>Hidden content</CollapsibleContentStyled>
		</CollapsibleRoot>
	)
}

describe('Collapsible', () => {
	it('renders the trigger', () => {
		renderUI(() => <TestCollapsible />)
		expect(screen.getByText('Toggle')).toBeInTheDocument()
	})

	it('content has data-closed attribute initially (collapsed)', () => {
		const { container } = renderUI(() => <TestCollapsible />)
		// Kobalte marks closed collapsible with data-closed on the content element
		const closedEl = container.querySelector('[data-closed]')
		expect(closedEl).toBeInTheDocument()
	})

	it('clicking trigger reveals content', async () => {
		const user = userEvent.setup()
		renderUI(() => <TestCollapsible />)
		await user.click(screen.getByText('Toggle'))
		expect(screen.getByText('Hidden content')).toBeVisible()
	})

	it('clicking again restores collapsed state', async () => {
		const user = userEvent.setup()
		const { container } = renderUI(() => <TestCollapsible />)
		await user.click(screen.getByText('Toggle'))
		expect(screen.getByText('Hidden content')).toBeInTheDocument()
		await user.click(screen.getByText('Toggle'))
		const closedEl = container.querySelector('[data-closed]')
		expect(closedEl).toBeInTheDocument()
	})
})
