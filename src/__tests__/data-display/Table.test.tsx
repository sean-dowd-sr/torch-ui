import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
	TableCell,
	TableFooter,
} from '../../components/data-display/Table'
import { renderUI } from '../../test/test-utils'

describe('Table', () => {
	it('renders a table element', () => {
		renderUI(() => (
			<Table>
				<TableBody>
					<TableRow>
						<TableCell>Cell</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		))
		expect(screen.getByRole('table')).toBeInTheDocument()
	})

	it('renders header cells', () => {
		renderUI(() => (
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>Jane</TableCell>
						<TableCell>jane@example.com</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		))
		expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
		expect(screen.getByRole('columnheader', { name: 'Email' })).toBeInTheDocument()
	})

	it('renders body cells', () => {
		renderUI(() => (
			<Table>
				<TableBody>
					<TableRow>
						<TableCell>Jane Doe</TableCell>
						<TableCell>jane@example.com</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		))
		expect(screen.getByRole('cell', { name: 'Jane Doe' })).toBeInTheDocument()
	})

	it('renders footer', () => {
		renderUI(() => (
			<Table>
				<TableBody>
					<TableRow><TableCell>Row</TableCell></TableRow>
				</TableBody>
				<TableFooter>
					<TableRow><TableCell>Total: 1</TableCell></TableRow>
				</TableFooter>
			</Table>
		))
		expect(screen.getByText('Total: 1')).toBeInTheDocument()
	})
})
