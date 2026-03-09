import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import {
	Skeleton,
	SkeletonCard,
	SkeletonTable,
	SkeletonSection,
	SkeletonHeading,
	SkeletonForm,
} from '../../components/feedback'
import { renderUI } from '../../test/test-utils'

describe('Skeleton', () => {
	it('renders an element', () => {
		const { container } = renderUI(() => <Skeleton />)
		expect(container.firstChild).toBeInTheDocument()
	})

	it('renders as a div by default', () => {
		const { container } = renderUI(() => <Skeleton />)
		expect(container.querySelector('div')).toBeInTheDocument()
	})

	it('applies custom class', () => {
		const { container } = renderUI(() => <Skeleton class="custom-class" />)
		expect(container.querySelector('.custom-class')).toBeInTheDocument()
	})
})

describe('SkeletonCard', () => {
	it('renders without throwing', () => {
		const { container } = renderUI(() => <SkeletonCard />)
		expect(container.firstChild).toBeInTheDocument()
	})
})

describe('SkeletonTable', () => {
	it('renders without throwing', () => {
		const { container } = renderUI(() => <SkeletonTable />)
		expect(container.firstChild).toBeInTheDocument()
	})
})

describe('SkeletonSection', () => {
	it('renders without throwing', () => {
		const { container } = renderUI(() => <SkeletonSection />)
		expect(container.firstChild).toBeInTheDocument()
	})
})

describe('SkeletonHeading', () => {
	it('renders without throwing', () => {
		const { container } = renderUI(() => <SkeletonHeading />)
		expect(container.firstChild).toBeInTheDocument()
	})
})

describe('SkeletonForm', () => {
	it('renders without throwing', () => {
		const { container } = renderUI(() => <SkeletonForm />)
		expect(container.firstChild).toBeInTheDocument()
	})
})
