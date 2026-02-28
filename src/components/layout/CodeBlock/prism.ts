/**
 * Prism syntax highlighting for CodeBlock. Supports many languages; add more
 * prismjs/components/prism-* imports as needed. Apps style tokens via
 * .code-block (follows app .dark), .code-block-dark (forced), .code-block-primary.
 */
import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-diff'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-git'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-graphql'
import 'prismjs/components/prism-ini'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-sass'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-toml'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-yaml'

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
