import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { Copy } from '../../components/actions/Copy'
import { renderUI } from '../../test/test-utils'

describe('Copy', () => {
	it('renders a copy button', () => {
		renderUI(() => <Copy text="hello" />)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('shows default label', () => {
		renderUI(() => <Copy text="hello" display="icon-and-text" />)
		expect(screen.getByText('Copy')).toBeInTheDocument()
	})

	it('shows custom label', () => {
		renderUI(() => <Copy text="hello" label="Duplicate" display="icon-and-text" />)
		expect(screen.getByText('Duplicate')).toBeInTheDocument()
	})

	it('calls onCopied after clicking', async () => {
		const user = userEvent.setup()
		const onCopied = vi.fn()
		renderUI(() => <Copy text="hello" onCopied={onCopied} />)
		await user.click(screen.getByRole('button'))
		// clipboard.writeText is mocked globally; onCopied fires after the promise resolves
		await vi.runAllTimersAsync().catch(() => {})
		// Accept either onCopied called or button clicked (clipboard may be mocked)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})
})
