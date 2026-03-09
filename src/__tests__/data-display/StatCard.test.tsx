import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { StatCard } from '../../components/data-display/StatCard'
import { renderUI } from '../../test/test-utils'

describe('StatCard', () => {
	it('renders label', () => {
		renderUI(() => <StatCard label="Total Users" />)
		expect(screen.getByText('Total Users')).toBeInTheDocument()
	})

	it('renders value', () => {
		renderUI(() => <StatCard label="Revenue" value="$12,400" />)
		expect(screen.getByText('$12,400')).toBeInTheDocument()
	})

	it('renders numeric value', () => {
		renderUI(() => <StatCard label="Count" value={1024} />)
		expect(screen.getByText('1024')).toBeInTheDocument()
	})

	it('renders subtitle', () => {
		renderUI(() => <StatCard label="Sessions" subtitle="Last 30 days" />)
		expect(screen.getByText('Last 30 days')).toBeInTheDocument()
	})

	it('renders trend label', () => {
		renderUI(() => <StatCard label="Growth" trendLabel="+12%" />)
		expect(screen.getByText('+12%')).toBeInTheDocument()
	})

	it('renders helper text', () => {
		renderUI(() => <StatCard label="Users" helperText="vs last month" />)
		expect(screen.getByText('vs last month')).toBeInTheDocument()
	})

	it('renders emptyText when value is null', () => {
		renderUI(() => <StatCard label="Revenue" value={null} emptyText="N/A" />)
		expect(screen.getByText('N/A')).toBeInTheDocument()
	})

	it('renders topRight slot', () => {
		renderUI(() => (
			<StatCard label="Users" topRight={<span>Badge</span>} />
		))
		expect(screen.getByText('Badge')).toBeInTheDocument()
	})
})
