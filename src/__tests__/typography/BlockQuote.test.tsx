import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { BlockQuote } from '../../components/layout/BlockQuote'
import { renderUI } from '../../test/test-utils'

describe('BlockQuote', () => {
	it('renders children text', () => {
		renderUI(() => <BlockQuote>The only way to do great work is to love what you do.</BlockQuote>)
		expect(screen.getByText('The only way to do great work is to love what you do.')).toBeInTheDocument()
	})

	it('renders a blockquote element', () => {
		const { container } = renderUI(() => <BlockQuote>Quote text</BlockQuote>)
		expect(container.querySelector('blockquote')).toBeInTheDocument()
	})

	it('renders citation/attribution when provided', () => {
		renderUI(() => <BlockQuote citation="Steve Jobs">Stay hungry, stay foolish.</BlockQuote>)
		expect(screen.getByText('Steve Jobs')).toBeInTheDocument()
	})

	it('renders start justify without throwing', () => {
		const { container } = renderUI(() => <BlockQuote justify="start">Quote-L</BlockQuote>)
		expect(container.querySelector('blockquote')).toBeInTheDocument()
	})

	it('renders center justify without throwing', () => {
		const { container } = renderUI(() => <BlockQuote justify="center">Quote-C</BlockQuote>)
		expect(container.querySelector('blockquote')).toBeInTheDocument()
	})

	it('renders end justify without throwing', () => {
		const { container } = renderUI(() => <BlockQuote justify="end">Quote-R</BlockQuote>)
		expect(container.querySelector('blockquote')).toBeInTheDocument()
	})
})
