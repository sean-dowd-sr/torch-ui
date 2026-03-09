import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { Alert } from '../../components/feedback/Alert'
import { renderUI } from '../../test/test-utils'

describe('Alert', () => {
	it('renders children', () => {
		renderUI(() => <Alert>Something went wrong</Alert>)
		expect(screen.getByText('Something went wrong')).toBeInTheDocument()
	})

	it('renders with title', () => {
		renderUI(() => <Alert title="Error" status="error">Details here</Alert>)
		expect(screen.getByText('Error')).toBeInTheDocument()
		expect(screen.getByText('Details here')).toBeInTheDocument()
	})

	it('has role="status" by default (ariaLive=polite)', () => {
		renderUI(() => <Alert>Info</Alert>)
		expect(screen.getByRole('status')).toBeInTheDocument()
	})

	it('has role="alert" when ariaLive=assertive', () => {
		renderUI(() => <Alert ariaLive="assertive">Critical</Alert>)
		expect(screen.getByRole('alert')).toBeInTheDocument()
	})

	it('shows close button when closeable=true', () => {
		renderUI(() => <Alert closeable onClose={vi.fn()}>Closeable</Alert>)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('calls onClose when close button clicked', async () => {
		const user = userEvent.setup()
		const onClose = vi.fn()
		renderUI(() => <Alert closeable onClose={onClose}>Close me</Alert>)
		await user.click(screen.getByRole('button'))
		expect(onClose).toHaveBeenCalledTimes(1)
	})

	it('renders all statuses without throwing', () => {
		const statuses = ['error', 'success', 'warning', 'info'] as const
		for (const status of statuses) {
			renderUI(() => <Alert status={status}>{status}</Alert>)
			expect(screen.getByText(status)).toBeInTheDocument()
		}
	})

	it('renders actions slot', () => {
		renderUI(() => (
			<Alert actions={<button type="button">Retry</button>}>Error occurred</Alert>
		))
		expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
	})
})
