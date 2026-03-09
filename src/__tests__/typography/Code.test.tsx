import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { Code } from '../../components/typography/Code'
import { renderUI } from '../../test/test-utils'

describe('Code', () => {
	it('renders inline code text', () => {
		renderUI(() => <Code>const x = 1</Code>)
		expect(screen.getByText('const x = 1')).toBeInTheDocument()
	})

	it('renders as a code element', () => {
		const { container } = renderUI(() => <Code>snippet</Code>)
		expect(container.querySelector('code')).toBeInTheDocument()
	})

	it('renders without throwing when empty', () => {
		const { container } = renderUI(() => <Code />)
		expect(container.querySelector('code')).toBeInTheDocument()
	})

	it('applies custom class', () => {
		const { container } = renderUI(() => <Code class="custom-code">text</Code>)
		expect(container.querySelector('.custom-code')).toBeInTheDocument()
	})
})
