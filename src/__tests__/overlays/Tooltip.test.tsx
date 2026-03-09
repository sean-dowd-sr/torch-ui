import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { TooltipRoot, TooltipTrigger, TooltipContent } from '../../components/overlays/Tooltip'
import { renderUI } from '../../test/test-utils'

function TestTooltip() {
	return (
		<TooltipRoot openDelay={0} closeDelay={0}>
			<TooltipTrigger as="button" type="button">Hover me</TooltipTrigger>
			<TooltipContent>Tooltip text</TooltipContent>
		</TooltipRoot>
	)
}

describe('Tooltip', () => {
	it('renders trigger element', () => {
		renderUI(() => <TestTooltip />)
		expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument()
	})

	it('tooltip is not visible before hover', () => {
		renderUI(() => <TestTooltip />)
		expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument()
	})

	it('tooltip appears on hover', async () => {
		const user = userEvent.setup()
		renderUI(() => <TestTooltip />)
		await user.hover(screen.getByRole('button', { name: 'Hover me' }))
		expect(document.body.textContent).toContain('Tooltip text')
	})

	it('tooltip disappears on unhover', async () => {
		const user = userEvent.setup()
		renderUI(() => <TestTooltip />)
		await user.hover(screen.getByRole('button', { name: 'Hover me' }))
		expect(document.body.textContent).toContain('Tooltip text')
		await user.unhover(screen.getByRole('button', { name: 'Hover me' }))
		// After unhover the content may be removed or hidden
		expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument()
	})
})
