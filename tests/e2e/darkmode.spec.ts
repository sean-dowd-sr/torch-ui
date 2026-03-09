import { test, expect } from '@playwright/test'

test.describe('DarkModeToggle', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/actions/dark-mode-toggle')
		// Clear any persisted theme from a previous test run
		await page.evaluate(() => localStorage.removeItem('torch-theme'))
		await page.evaluate(() => document.documentElement.classList.remove('dark'))
	})

	test('page loads in light mode by default', async ({ page }) => {
		await expect(page.locator('html')).not.toHaveClass(/\bdark\b/)
	})

	test('clicking toggle adds .dark to <html>', async ({ page }) => {
		// The docs page has a dark mode toggle in the header
		const toggle = page.getByRole('button', { name: /dark mode|light mode|theme/i }).first()
		await toggle.click()
		await expect(page.locator('html')).toHaveClass(/\bdark\b/)
	})

	test('dark class persists after page reload', async ({ page }) => {
		const toggle = page.getByRole('button', { name: /dark mode|light mode|theme/i }).first()
		await toggle.click()
		await expect(page.locator('html')).toHaveClass(/\bdark\b/)
		await page.reload()
		await expect(page.locator('html')).toHaveClass(/\bdark\b/)
	})

	test('localStorage key is "torch-theme"', async ({ page }) => {
		const toggle = page.getByRole('button', { name: /dark mode|light mode|theme/i }).first()
		await toggle.click()
		const value = await page.evaluate(() => localStorage.getItem('torch-theme'))
		expect(value).toBe('dark')
	})

	test('toggling back removes .dark and sets localStorage to "light"', async ({ page }) => {
		const toggle = page.getByRole('button', { name: /dark mode|light mode|theme/i }).first()
		await toggle.click()
		await expect(page.locator('html')).toHaveClass(/\bdark\b/)
		await toggle.click()
		await expect(page.locator('html')).not.toHaveClass(/\bdark\b/)
		const value = await page.evaluate(() => localStorage.getItem('torch-theme'))
		expect(value).toBe('light')
	})
})
