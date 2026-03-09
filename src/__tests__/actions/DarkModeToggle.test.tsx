import { describe, test, expect, beforeEach } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { DarkModeToggle } from '../../components/actions/DarkModeToggle'
import { renderUI } from '../../test/test-utils'

describe('DarkModeToggle', () => {
	beforeEach(() => {
		document.documentElement.classList.remove('dark')
		localStorage.clear()
	})

	test('starts in light mode when no localStorage preference', () => {
		renderUI(() => <DarkModeToggle />)
		expect(document.documentElement.classList.contains('dark')).toBe(false)
	})

	test('toggles .dark on document.documentElement when clicked', async () => {
		const user = userEvent.setup()
		renderUI(() => <DarkModeToggle />)
		await user.click(screen.getByRole('button'))
		expect(document.documentElement.classList.contains('dark')).toBe(true)
	})

	test('persists preference to localStorage with key "torch-theme"', async () => {
		const user = userEvent.setup()
		renderUI(() => <DarkModeToggle />)
		await user.click(screen.getByRole('button'))
		expect(localStorage.getItem('torch-theme')).toBe('dark')
	})

	test('toggling back to light saves "light" to localStorage', async () => {
		const user = userEvent.setup()
		localStorage.setItem('torch-theme', 'dark')
		document.documentElement.classList.add('dark')
		renderUI(() => <DarkModeToggle />)
		await user.click(screen.getByRole('button'))
		expect(localStorage.getItem('torch-theme')).toBe('light')
		expect(document.documentElement.classList.contains('dark')).toBe(false)
	})

	test('reads initial dark state from localStorage', () => {
		localStorage.setItem('torch-theme', 'dark')
		document.documentElement.classList.add('dark')
		renderUI(() => <DarkModeToggle />)
		expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
	})

	test('button has aria-pressed="false" in light mode', () => {
		renderUI(() => <DarkModeToggle />)
		expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
	})
})
