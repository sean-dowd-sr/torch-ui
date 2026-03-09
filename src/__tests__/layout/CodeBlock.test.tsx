import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { CodeBlock } from '../../components/layout/CodeBlock'
import { renderUI } from '../../test/test-utils'

describe('CodeBlock', () => {
	it('renders code content', () => {
		renderUI(() => <CodeBlock content="const x = 1" />)
		expect(screen.getByText('const x = 1')).toBeInTheDocument()
	})

	it('renders filename when provided', () => {
		renderUI(() => <CodeBlock content="console.log('hi')" filename="Example.ts" />)
		expect(screen.getByText('Example.ts')).toBeInTheDocument()
	})

	it('renders a copy button by default', () => {
		renderUI(() => <CodeBlock content="const a = 1" />)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('renders without throwing when content is empty', () => {
		const { container } = renderUI(() => <CodeBlock content="" />)
		expect(container.firstChild).toBeInTheDocument()
	})

	it('renders label when provided', () => {
		renderUI(() => <CodeBlock content="const x = 1" label="TypeScript" />)
		expect(screen.getByText('TypeScript')).toBeInTheDocument()
	})
})
