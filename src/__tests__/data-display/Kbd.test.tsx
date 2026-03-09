import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { Kbd, KbdShortcut, KEY } from '../../components/data-display/Kbd'
import { renderUI } from '../../test/test-utils'

describe('Kbd', () => {
	it('renders key text', () => {
		renderUI(() => <Kbd>Enter</Kbd>)
		expect(screen.getByText('Enter')).toBeInTheDocument()
	})

	it('renders as a kbd element', () => {
		const { container } = renderUI(() => <Kbd>K</Kbd>)
		expect(container.querySelector('kbd')).toBeInTheDocument()
	})

	it('renders all variants without throwing', () => {
		renderUI(() => <Kbd variant="default">A</Kbd>)
		renderUI(() => <Kbd variant="flat">B</Kbd>)
	})

	it('renders all sizes without throwing', () => {
		const sizes = ['sm', 'md', 'lg'] as const
		for (const size of sizes) {
			renderUI(() => <Kbd size={size}>{size}</Kbd>)
		}
	})

	it('renders KEY constants', () => {
		renderUI(() => <Kbd>{KEY.Cmd}</Kbd>)
		expect(screen.getByText('⌘')).toBeInTheDocument()
	})
})

describe('KbdShortcut', () => {
	it('renders multiple keys', () => {
		renderUI(() => <KbdShortcut keys={[KEY.Cmd, 'K']} />)
		expect(screen.getByText('⌘')).toBeInTheDocument()
		expect(screen.getByText('K')).toBeInTheDocument()
	})

	it('renders custom separator', () => {
		renderUI(() => <KbdShortcut keys={['Ctrl', 'S']} separator="+" />)
		expect(screen.getByText('+')).toBeInTheDocument()
	})

	it('renders all KEY constants without throwing', () => {
		const keys = [...new Set(Object.values(KEY))]
		renderUI(() => <KbdShortcut keys={keys} />)
		for (const key of keys) {
			expect(screen.getAllByText(key).length).toBeGreaterThanOrEqual(1)
		}
	})
})
