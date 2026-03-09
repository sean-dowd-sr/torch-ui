import { defineConfig } from 'vitest/config'
import solid from 'vite-plugin-solid'

export default defineConfig({
	plugins: [solid({ hot: false })],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/test/setup.ts'],
		include: ['src/__tests__/**/*.test.{ts,tsx}'],
		exclude: ['**/node_modules/**', '**/dist/**', '**/dev/**'],
	},
})
