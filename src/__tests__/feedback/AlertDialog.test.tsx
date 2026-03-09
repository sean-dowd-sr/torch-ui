import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { AlertDialog } from '../../components/feedback/AlertDialog'
import { renderUI } from '../../test/test-utils'

describe('AlertDialog', () => {
	it('does not render content when closed', () => {
		renderUI(() => (
			<AlertDialog open={false} title="Confirm delete" onOpenChange={vi.fn()} />
		))
		expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
	})

	it('renders title when open', () => {
		renderUI(() => (
			<AlertDialog open title="Confirm delete" onOpenChange={vi.fn()} />
		))
		expect(screen.getByText('Confirm delete')).toBeInTheDocument()
	})

	it('renders description when provided', () => {
		renderUI(() => (
			<AlertDialog
				open
				title="Delete item"
				description="This action cannot be undone."
				onOpenChange={vi.fn()}
			/>
		))
		expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument()
	})

	it('renders confirm and cancel buttons', () => {
		renderUI(() => (
			<AlertDialog open title="Delete?" onOpenChange={vi.fn()} />
		))
		expect(screen.getByText('Confirm')).toBeInTheDocument()
		expect(screen.getByText('Cancel')).toBeInTheDocument()
	})

	it('uses custom confirm/cancel labels', () => {
		renderUI(() => (
			<AlertDialog
				open
				title="Remove?"
				confirmLabel="Yes, remove"
				cancelLabel="Keep"
				onOpenChange={vi.fn()}
			/>
		))
		expect(screen.getByText('Yes, remove')).toBeInTheDocument()
		expect(screen.getByText('Keep')).toBeInTheDocument()
	})

	it('calls onConfirm when confirm button is clicked', async () => {
		const user = userEvent.setup()
		const onConfirm = vi.fn()
		renderUI(() => (
			<AlertDialog open title="Confirm?" onConfirm={onConfirm} onOpenChange={vi.fn()} />
		))
		await user.click(screen.getByRole('button', { name: 'Confirm' }))
		expect(onConfirm).toHaveBeenCalledTimes(1)
	})

	it('calls onCancel when cancel button is clicked', async () => {
		const user = userEvent.setup()
		const onCancel = vi.fn()
		const onOpenChange = vi.fn()
		renderUI(() => (
			<AlertDialog open title="Confirm?" onCancel={onCancel} onOpenChange={onOpenChange} />
		))
		await user.click(screen.getByText('Cancel'))
		expect(onCancel).toHaveBeenCalledTimes(1)
	})
})
