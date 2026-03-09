import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { Button } from '../../components/actions/Button'
import { renderUI } from '../../test/test-utils'

describe('Button', () => {
	it('renders children', () => {
		renderUI(() => <Button>Click me</Button>)
		expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
	})

	it('renders label prop over children', () => {
		renderUI(() => <Button label="Save">Ignored</Button>)
		expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
	})

	it('calls onClick when clicked', async () => {
		const user = userEvent.setup()
		const onClick = vi.fn()
		renderUI(() => <Button onClick={onClick}>Go</Button>)
		await user.click(screen.getByRole('button'))
		expect(onClick).toHaveBeenCalledTimes(1)
	})

	it('is disabled when disabled=true', () => {
		renderUI(() => <Button disabled>Submit</Button>)
		expect(screen.getByRole('button')).toBeDisabled()
	})

	it('does not call onClick when disabled', async () => {
		const user = userEvent.setup()
		const onClick = vi.fn()
		renderUI(() => <Button disabled onClick={onClick}>Submit</Button>)
		await user.click(screen.getByRole('button'))
		expect(onClick).not.toHaveBeenCalled()
	})

	it('renders as an anchor when href is set', () => {
		renderUI(() => <Button href="/home">Home</Button>)
		expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
	})

	it('renders all variants without throwing', () => {
		const variants = ['primary', 'secondary', 'outlined', 'ghost', 'danger', 'success'] as const
		for (const variant of variants) {
			renderUI(() => <Button variant={variant}>{variant}</Button>)
			expect(screen.getByRole('button', { name: variant })).toBeInTheDocument()
		}
	})

	it('renders in toggle mode with aria-pressed', () => {
		renderUI(() => <Button pressed={false} onValueChange={vi.fn()}>Toggle</Button>)
		const btn = screen.getByRole('button', { name: 'Toggle' })
		expect(btn).toHaveAttribute('aria-pressed', 'false')
	})

	it('calls onValueChange when toggle button is clicked', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		renderUI(() => <Button pressed={false} onValueChange={onValueChange}>Toggle</Button>)
		await user.click(screen.getByRole('button'))
		expect(onValueChange).toHaveBeenCalledWith(true)
	})

	it('shows loading state', () => {
		renderUI(() => <Button loading>Saving</Button>)
		expect(screen.getByRole('button')).toBeDisabled()
	})
})
