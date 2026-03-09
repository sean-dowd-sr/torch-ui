import { cpSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const files = [
	['src/styles/theme.css', 'dist/styles/theme.css'],
	['src/styles/code-block-tokens.css', 'dist/styles/code-block-tokens.css'],
]

for (const [src, dest] of files) {
	mkdirSync(dirname(dest), { recursive: true })
	cpSync(src, dest)
}
