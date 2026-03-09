import { describe, expect, it, vi, afterEach } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { Banner } from '../../components/feedback/Banner'
import { renderUI } from '../../test/test-utils'

afterEach(() => { vi.useRealTimers() })

describe('Banner', () => {
	it('renders children', () => {
		renderUI(() => <Banner>Maintenance scheduled</Banner>)
		expect(screen.getByText('Maintenance scheduled')).toBeInTheDocument()
	})

	it('renders all statuses without throwing', () => {
		const statuses = ['primary', 'info', 'success', 'warning', 'error'] as const
		for (const status of statuses) {
			renderUI(() => <Banner status={status}>{status}</Banner>)
			expect(screen.getByText(status)).toBeInTheDocument()
		}
	})

	it('renders both appearances without throwing', () => {
		renderUI(() => <Banner appearance="solid">Solid</Banner>)
		expect(screen.getByText('Solid')).toBeInTheDocument()
		renderUI(() => <Banner appearance="subtle">Subtle</Banner>)
		expect(screen.getByText('Subtle')).toBeInTheDocument()
	})

	it('shows close button when closeable=true', () => {
		renderUI(() => <Banner closeable onClose={vi.fn()}>Dismissable</Banner>)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('calls onClose when close button is clicked', async () => {
		vi.useFakeTimers()
		const user = userEvent.setup({ delay: null })
		const onClose = vi.fn()
		renderUI(() => <Banner closeable onClose={onClose}>Dismiss me</Banner>)
		await user.click(screen.getByRole('button', { name: 'Dismiss' }))
		vi.runAllTimers()
		expect(onClose).toHaveBeenCalledTimes(1)
	})

	it('renders action slot', () => {
		renderUI(() => (
			<Banner action={<button type="button">Learn more</button>}>Update available</Banner>
		))
		expect(screen.getByRole('button', { name: 'Learn more' })).toBeInTheDocument()
	})
})
