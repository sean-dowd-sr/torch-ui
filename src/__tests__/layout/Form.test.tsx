import { describe, expect, it, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { Form } from '../../components/layout/Form'
import { renderUI } from '../../test/test-utils'

describe('Form', () => {
	it('renders children', () => {
		renderUI(() => (
			<Form onSubmit={vi.fn() as any}>
				<input aria-label="Name" />
			</Form>
		))
		expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument()
	})

	it('renders a form element', () => {
		const { container } = renderUI(() => <Form onSubmit={vi.fn() as any}><span>field</span></Form>)
		expect(container.querySelector('form')).toBeInTheDocument()
	})

	it('calls onSubmit when form is submitted', async () => {
		const user = userEvent.setup()
		const onSubmit = vi.fn((e: SubmitEvent) => e.preventDefault())
		renderUI(() => (
			<Form onSubmit={onSubmit}>
				<button type="submit">Submit</button>
			</Form>
		))
		await user.click(screen.getByRole('button', { name: 'Submit' }))
		expect(onSubmit).toHaveBeenCalledTimes(1)
	})
})
