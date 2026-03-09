import { test, expect } from '@playwright/test'

test.describe('Input', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/forms/input')
	})

	test('page renders input examples', async ({ page }) => {
		const inputCount = await page.locator('input[type="text"], input:not([type])').count()
		expect(inputCount).toBeGreaterThanOrEqual(1)
	})

	test('can type into an input field', async ({ page }) => {
		const input = page.locator('input[type="text"], input:not([type])').first()
		await input.fill('hello world')
		await expect(input).toHaveValue('hello world')
	})
})

test.describe('Select keyboard navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/forms/select')
	})

	test('opens with Enter key and closes with Escape', async ({ page }) => {
		const trigger = page.getByRole('combobox').first()
		await trigger.focus()
		await page.keyboard.press('Enter')
		await expect(page.getByRole('listbox')).toBeVisible()
		await page.keyboard.press('Escape')
		await expect(page.getByRole('listbox')).not.toBeVisible()
	})

	test('ArrowDown moves focus through options', async ({ page }) => {
		const trigger = page.getByRole('combobox').first()
		await trigger.focus()
		await page.keyboard.press('Enter')
		await expect(page.getByRole('listbox')).toBeVisible()
		await page.keyboard.press('ArrowDown')
		await page.keyboard.press('ArrowDown')
		// An option should now be focused (aria-selected or data-highlighted)
		const highlighted = await page.locator('[role="option"][data-highlighted]').count()
		expect(highlighted).toBeGreaterThanOrEqual(1)
	})
})

test.describe('Autocomplete keyboard navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/forms/autocomplete')
	})

	test('typing filters options', async ({ page }) => {
		const input = page.getByRole('combobox').first()
		await input.fill('a')
		await expect(page.getByRole('listbox')).toBeVisible()
		const optionCount = await page.getByRole('option').count()
		expect(optionCount).toBeGreaterThanOrEqual(1)
	})

	test('Escape closes the dropdown', async ({ page }) => {
		const input = page.getByRole('combobox').first()
		await input.fill('a')
		await expect(page.getByRole('listbox')).toBeVisible()
		await page.keyboard.press('Escape')
		await expect(page.getByRole('listbox')).not.toBeVisible()
	})
})

test.describe('Tabs keyboard navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/navigation/tabs')
	})

	test('ArrowRight moves focus to next tab', async ({ page }) => {
		const firstTab = page.getByRole('tab').first()
		await firstTab.focus()
		const firstTabText = await firstTab.textContent()
		await page.keyboard.press('ArrowRight')
		const focused = page.locator('[role="tab"]:focus')
		await expect(focused).not.toHaveText(firstTabText ?? '')
	})
})
