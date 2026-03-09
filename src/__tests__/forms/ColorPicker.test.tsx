import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { ColorPicker } from '../../components/forms/ColorPicker'
import { renderUI } from '../../test/test-utils'

describe('ColorPicker', () => {
	it('renders label', () => {
		renderUI(() => <ColorPicker label="Brand color" />)
		expect(screen.getByText('Brand color')).toBeInTheDocument()
	})

	it('renders a trigger button', () => {
		const { container } = renderUI(() => <ColorPicker label="Color" />)
		expect(container.querySelector('button')).toBeInTheDocument()
	})

	it('shows current color value in trigger', () => {
		// Value is shown as background-color style; JSDOM converts hex to rgb()
		const { container } = renderUI(() => <ColorPicker value="#3b82f6" />)
		const trigger = container.querySelector('button')
		expect(trigger?.style.backgroundColor).toBe('rgb(59, 130, 246)')
	})

	it('opens picker popover on click', async () => {
		const user = userEvent.setup()
		const { container } = renderUI(() => <ColorPicker label="Color" />)
		await user.click(container.querySelector('button')!)
		// Dialog may render in a portal; check document body for dialog role
		const dialog = document.body.querySelector('[role="dialog"]')
		expect(dialog).toBeInTheDocument()
	})

	it('shows error message', () => {
		renderUI(() => <ColorPicker error="Color is required" />)
		expect(screen.getByText('Color is required')).toBeInTheDocument()
	})

	it('shows helperText', () => {
		renderUI(() => <ColorPicker helperText="Choose a primary brand color" />)
		expect(screen.getByText('Choose a primary brand color')).toBeInTheDocument()
	})

	it('does not show helperText when error is present', () => {
		renderUI(() => <ColorPicker error="Required" helperText="Choose a color" />)
		expect(screen.getByText('Required')).toBeInTheDocument()
		expect(screen.queryByText('Choose a color')).not.toBeInTheDocument()
	})

	it('suppresses label and error when bare=true', () => {
		renderUI(() => <ColorPicker label="Brand" error="Required" bare />)
		expect(screen.queryByText('Brand')).not.toBeInTheDocument()
		expect(screen.queryByText('Required')).not.toBeInTheDocument()
	})

	it('is disabled when disabled=true', () => {
		const { container } = renderUI(() => <ColorPicker disabled />)
		expect(container.querySelector('button')).toBeDisabled()
	})

	it('renders all sizes without throwing', () => {
		const sizes = ['sm', 'md'] as const
		for (const size of sizes) {
			const { container } = renderUI(() => <ColorPicker size={size} />)
			expect(container.firstChild).toBeInTheDocument()
		}
	})
})
