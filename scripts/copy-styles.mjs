import { cpSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const files = [
	['src/styles/theme.css', 'dist/styles/theme.css'],
	['src/styles/code-block-tokens.css', 'dist/styles/code-block-tokens.css'],
	// Also ship at root-level styles/ so CSS @import resolvers that don't follow
	// the exports map can still find the file at node_modules/@torch-ui/solid/styles/
	['src/styles/theme.css', 'styles/theme.css'],
	['src/styles/code-block-tokens.css', 'styles/code-block-tokens.css'],
]

for (const [src, dest] of files) {
	mkdirSync(dirname(dest), { recursive: true })
	cpSync(src, dest)
}
