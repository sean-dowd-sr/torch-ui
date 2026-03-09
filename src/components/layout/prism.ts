/**
 * Prism syntax highlighting for CodeBlock. Supports many languages; add more
 * prismjs/components/prism-* imports as needed. Apps style tokens via
 * .code-block (follows app .dark), .code-block-dark (forced), .code-block-primary.
 */
import Prism from 'prismjs'

const loadedLanguages = new Set<string>()
const loadingLanguages = new Map<string, Promise<void>>()

const LANGUAGE_DEPENDENCIES: Record<string, string[]> = {
	// prismjs language component dependencies
	tsx: ['typescript', 'jsx'],
	jsx: ['javascript', 'markup'],
	typescript: ['javascript'],
	graphql: ['javascript'],
	scss: ['css'],
	sass: ['css'],
	diff: ['markup'],
}

const LANGUAGE_LOADERS: Record<string, () => Promise<unknown>> = {
	bash: () => import('prismjs/components/prism-bash'),
	css: () => import('prismjs/components/prism-css'),
	diff: () => import('prismjs/components/prism-diff'),
	docker: () => import('prismjs/components/prism-docker'),
	git: () => import('prismjs/components/prism-git'),
	go: () => import('prismjs/components/prism-go'),
	graphql: () => import('prismjs/components/prism-graphql'),
	ini: () => import('prismjs/components/prism-ini'),
	javascript: () => import('prismjs/components/prism-javascript'),
	json: () => import('prismjs/components/prism-json'),
	jsx: () => import('prismjs/components/prism-jsx'),
	markdown: () => import('prismjs/components/prism-markdown'),
	markup: () => import('prismjs/components/prism-markup'),
	python: () => import('prismjs/components/prism-python'),
	ruby: () => import('prismjs/components/prism-ruby'),
	rust: () => import('prismjs/components/prism-rust'),
	sass: () => import('prismjs/components/prism-sass'),
	scss: () => import('prismjs/components/prism-scss'),
	sql: () => import('prismjs/components/prism-sql'),
	toml: () => import('prismjs/components/prism-toml'),
	typescript: () => import('prismjs/components/prism-typescript'),
	tsx: () => import('prismjs/components/prism-tsx'),
	yaml: () => import('prismjs/components/prism-yaml'),
}

const LANGUAGE_ALIASES: Record<string, string> = {
	js: 'javascript',
	ts: 'typescript',
	jsx: 'jsx',
	tsx: 'tsx',
	sh: 'bash',
	shell: 'bash',
	zsh: 'bash',
	html: 'markup',
	xml: 'markup',
	py: 'python',
	rb: 'ruby',
	rs: 'rust',
	yml: 'yaml',
	text: 'plaintext',
	plain: 'plaintext',
	txt: 'plaintext',
}

function normalizeLang(lang: string): string {
	const key = lang.toLowerCase()
	return LANGUAGE_ALIASES[key] ?? key
}

async function loadLangRecursive(language: string, seen: Set<string>): Promise<void> {
	const lang = normalizeLang(language)
	if (lang === 'plaintext') return
	if (seen.has(lang)) return
	seen.add(lang)

	const deps = LANGUAGE_DEPENDENCIES[lang] ?? []
	for (const dep of deps) {
		await loadLangRecursive(dep, seen)
	}

	// If already present, mark as loaded.
	if (loadedLanguages.has(lang)) return
	if (Prism.languages[lang]) {
		loadedLanguages.add(lang)
		return
	}

	const existing = loadingLanguages.get(lang)
	if (existing) return existing

	const loader = LANGUAGE_LOADERS[lang]
	if (!loader) return

	const p = Promise.resolve()
		.then(() => loader())
		.then(() => {
			loadedLanguages.add(lang)
		})
		.finally(() => {
			loadingLanguages.delete(lang)
		})

	loadingLanguages.set(lang, p)
	return p
}

export async function ensurePrismLanguage(language: string): Promise<void> {
	return loadLangRecursive(language, new Set())
}

/**
 * Highlight code string to HTML. Use this (and set el.innerHTML) for dynamic content.
 * highlightElement() is for static page HTML; Prism.highlight() is the right API for programmatic use.
 */
export function highlightCode(code: string, language: string): string {
	const lang = normalizeLang(language)
	const grammar = Prism.languages[lang]
	if (!grammar) return escapeHtml(code)
	return Prism.highlight(code, grammar, lang)
}

/** Escape text for safe insertion into HTML. Output is HTML-escaped text only — not safe for use in attribute contexts. */
function escapeHtml(text: string): string {
	if (typeof document === 'undefined') {
		return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
	}
	const el = document.createElement('div')
	el.textContent = text
	return el.innerHTML
}

/** Highlight a <code> element in place. Call after mount when content/language changes. */
export function highlightElement(element: HTMLElement, language: string): void {
	const lang = normalizeLang(language)
	element.classList.add(`language-${lang}`)
	Prism.highlightElement(element, false)
}
