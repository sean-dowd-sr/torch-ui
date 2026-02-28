import { createSignal, createEffect, type JSX, Show, For, splitProps } from 'solid-js'
import { ChevronDown, ChevronUp } from 'lucide-solid'
import { Copy } from '../actions/Copy'
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContentStyled } from './Collapsible'
import { PopoverRoot, PopoverTrigger, PopoverContent } from '../overlays/Popover'
import { cn } from '../lib/cn'
import Prism from 'prismjs'

export interface CodeBlockLanguage {
	/** Unique id for the tab (e.g. "js", "ts"). */
	id: string
	/** Tab label (e.g. "JavaScript", "TypeScript"). */
	label: string
	/** Code content for this variant. */
	content: string
	/** Prism language for syntax highlighting (e.g. "javascript", "typescript"). Defaults to id. */
	language?: string
	/** Optional icon (e.g. SVG). Pass a function to show the icon in both the trigger and the list (e.g. `() => <Icon name="JS" />`); a static element can only appear in one place. */
	icon?: JSX.Element | (() => JSX.Element)
}

export interface CodeBlockProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Code content (single block). When used, language applies. */
	content?: string
	/** Alternate content (e.g. component-only snippet). When set, a toggle in the header switches between content and alternateContent. */
	alternateContent?: string
	/** Prism language for syntax highlighting when using content (e.g. "javascript", "typescript"). */
	language?: string
	/** Multiple language variants with a tab switcher. When set, content/language are ignored for initial display. */
	languages?: CodeBlockLanguage[]
	/** Optional filename or title shown in the header (e.g. "Table.jsx"). */
	filename?: string
	/** Optional label in the header (e.g. "Embed Code"). Shown with or instead of filename. */
	label?: string
	/** Optional icon or image (e.g. SVG) shown to the left of the filename/label in the header. */
	headerIcon?: JSX.Element
	/** Show line numbers. */
	showLineNumbers?: boolean
	/** Line numbers to highlight (e.g. [2, 3, 5]). */
	highlightLines?: number[]
	/** When true, force dark appearance regardless of app theme. When undefined, follow app light/dark (e.g. .dark on root). */
	dark?: boolean
	/** Use primary (brand) background. Overrides dark. */
	primary?: boolean
	/** Minimum height (e.g. "min-h-[120px]"). Default none (min-h-0) so short snippets don't reserve extra space. */
	minHeight?: string
	/** When true, code is in a collapsible section with a "Show code" / "Hide code" trigger. */
	collapsible?: boolean
	/** When collapsible, whether the code is open by default. Default false. */
	defaultCodeOpen?: boolean
	/** Label for the trigger when code is hidden. Default "Show code". */
	collapsibleLabelShow?: string
	/** Label for the trigger when code is visible. Default "Hide code". */
	collapsibleLabelHide?: string
	class?: string
	preProps?: JSX.HTMLAttributes<HTMLPreElement>
}

function getHeaderTitle(props: CodeBlockProps): string | undefined {
	if (props.filename != null && props.filename !== '') return props.filename
	if (props.label != null && props.label !== '') return props.label
	return undefined
}

/**
 * Code block with optional copy button, language switcher, line numbers, and syntax highlighting (Prism).
 * Use content + language for a single block, or languages for a tabbed multi-variant block.
 * Import token styles in your app or tokens will be unstyled: `import '@torchui/solid/styles/code-block-tokens.css'`
 * Language must match a Prism grammar in packages/ui/src/lib/prism.ts (or an alias there).

 */
const CODE_BLOCK_PROP_KEYS = [
	'content',
	'alternateContent',
	'language',
	'languages',
	'filename',
	'label',
	'headerIcon',
	'showLineNumbers',
	'highlightLines',
	'dark',
	'primary',
	'minHeight',
	'collapsible',
	'defaultCodeOpen',
	'collapsibleLabelShow',
	'collapsibleLabelHide',
	'class',
	'preProps',
	'ref',
] as const

export function CodeBlock(props: CodeBlockProps) {
	const [local, others] = splitProps(props, [...CODE_BLOCK_PROP_KEYS])
	const primary = () => local.primary === true
	/** Follow app theme when not forcing dark. */
	const themeAuto = () => !primary() && local.dark !== true
	const dark = () => local.dark === true
	const minHeight = () => local.minHeight ?? 'min-h-0'
	const showLineNumbers = () => local.showLineNumbers === true
	const highlightLines = () => local.highlightLines ?? []

	const [selectedIndex, setSelectedIndex] = createSignal(0)
	const [languageOpen, setLanguageOpen] = createSignal(false)
	const [showAlternate, setShowAlternate] = createSignal(true)
	const [codeOpen, setCodeOpen] = createSignal(local.defaultCodeOpen ?? false)
	const collapsible = () => local.collapsible === true
	const triggerClass = () =>
		cn(
			'flex w-full items-center justify-center gap-2 rounded-none border-t border-surface-border py-2.5 text-sm font-medium',
			'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100',
			'bg-surface-overlay hover:bg-surface-dim',
			'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
		)

	const currentContent = (): string => {
		const langs = local.languages
		if (langs && langs.length > 0) {
			const idx = selectedIndex()
			return langs[idx]?.content ?? langs[0].content
		}
		return local.content ?? ''
	}

	/** When alternateContent is set, this is the content actually displayed (full vs snippet). */
	const effectiveContent = (): string => {
		if (local.alternateContent != null && showAlternate()) return local.alternateContent
		return currentContent()
	}

	const currentLanguage = (): string => {
		const langs = local.languages
		if (langs && langs.length > 0) {
			const idx = selectedIndex()
			const item = langs[idx] ?? langs[0]
			return item?.language ?? item?.id ?? 'text'
		}
		return local.language ?? 'text'
	}

	/** Currently selected language item (for icon, etc.). */
	const selectedLanguageItem = (): CodeBlockLanguage | undefined => {
		const langs = local.languages ?? []
		const idx = selectedIndex()
		return langs[idx] ?? langs[0]
	}

	const hasHeader = () => {
		const title = getHeaderTitle(local)
		const hasLangs = local.languages && local.languages.length > 1
		const hasAlternate = local.alternateContent != null && local.alternateContent.trim() !== ''
		return !!(title || hasLangs || hasAlternate)
	}

	const lines = () => {
		const text = effectiveContent()
		return text.split(/\r?\n/)
	}

	const containerClass = () =>
		primary()
			? 'border border-primary-600/80 bg-primary-600'
			: themeAuto()
				? 'border border-surface-border bg-surface-base'
				: dark()
					? 'border border-ink-800 bg-ink-900'
					: 'border border-ink-200 bg-ink-50'

	const headerBorderClass = () =>
		primary()
			? 'border-primary-500/60'
			: themeAuto()
				? 'border-surface-border'
				: dark()
					? 'border-ink-800'
					: 'border-ink-200'

	const headerTextClass = () =>
		primary()
			? 'text-white/90'
			: themeAuto()
				? 'text-ink-500 dark:text-ink-400'
				: dark()
					? 'text-ink-400'
					: 'text-ink-500'

	/* Minimal copy: icon only, no border/outline/ring, blends into header */
	const copyButtonClass = () =>
		primary()
			? '!border-0 !bg-transparent !shadow-none !ring-0 !ring-offset-0 text-white/70 hover:!bg-white/15 hover:text-white'
			: themeAuto()
				? '!border-0 !bg-transparent !shadow-none !ring-0 !ring-offset-0 text-ink-500 hover:!bg-surface-overlay hover:text-ink-700 dark:text-ink-400 dark:hover:text-ink-200'
				: dark()
					? '!border-0 !bg-transparent !shadow-none !ring-0 !ring-offset-0 text-ink-400 hover:!bg-ink-850 hover:text-ink-200'
					: '!border-0 !bg-transparent !shadow-none !ring-0 !ring-offset-0 text-ink-500 hover:!bg-ink-200 hover:text-ink-700'

	/* Line numbers: light grey, right-aligned, subtle separator (like reference) */
	const lineNumClass = () =>
		primary()
			? 'text-white/40'
			: themeAuto()
				? 'text-ink-400 dark:text-ink-500'
				: dark()
					? 'text-ink-500'
					: 'text-ink-400'

	const [codeEl, setCodeEl] = createSignal<HTMLElement | null>(null)
	/** Use textContent + Prism.highlightElement() for safe dynamic content highlighting. */
	createEffect(() => {
		const el = codeEl()
		if (!el) return

		const content = effectiveContent()
		const _lang = currentLanguage() // track language changes

		// 1) SAFE: never interpret user content as HTML
		el.textContent = content

		// 2) Prism generates markup based on textContent (language class is declarative)
		Prism.highlightElement(el)
	})
	/* Token styling: .code-block (follows app .dark) or forced .code-block-dark / .code-block-primary */
	const themeClass = () =>
		primary()
			? 'code-block-primary'
			: dark()
				? 'code-block-dark'
				: 'code-block'

	const codeContent = (
		<>
			<Show when={hasHeader()}>
				<div
					class={cn(
						'flex items-center justify-between gap-2 px-3 py-2 border-b',
						headerBorderClass()
					)}
				>
					<div class="min-w-0 flex-1 flex items-center gap-2 truncate">
						<Show when={local.headerIcon}>
							<span class="shrink-0 flex items-center [&>svg]:size-4 [&>img]:size-4" aria-hidden="true">
								{local.headerIcon}
							</span>
						</Show>
						<Show when={getHeaderTitle(local)}>
							<span
								class={cn(
									'text-xs font-medium truncate',
									headerTextClass()
								)}
							>
								{getHeaderTitle(local)}
							</span>
						</Show>
					</div>
					<div class="flex shrink-0 items-center gap-2">
						<Show when={local.languages && local.languages.length > 1}>
							<PopoverRoot open={languageOpen()} onOpenChange={setLanguageOpen} align="end">
								<PopoverTrigger
									as="button"
									type="button"
									aria-label="Language"
									aria-haspopup="menu"
									aria-expanded={languageOpen()}
									class={cn(
										'h-7 min-w-0 flex items-center gap-1.5 rounded border text-xs font-medium overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500',
										primary()
											? 'bg-white/10 border-white/30 text-white hover:bg-white/15'
											: themeAuto()
												? 'bg-surface-base border-surface-border text-ink-700 dark:text-ink-300 hover:bg-surface-overlay'
												: dark()
													? 'bg-ink-800 border-ink-600 text-ink-300 hover:bg-ink-700'
													: 'bg-ink-50 border-ink-200 text-ink-700 hover:bg-ink-100'
									)}
								>
									<Show when={selectedLanguageItem()?.icon}>
										<span class="shrink-0 flex items-center pl-2 [&>svg]:size-3.5 [&>img]:size-3.5 text-inherit" aria-hidden="true">
											{(typeof selectedLanguageItem()!.icon === 'function'
												? (selectedLanguageItem()!.icon as () => JSX.Element)()
												: selectedLanguageItem()!.icon) as JSX.Element}
										</span>
									</Show>
									<span class="min-w-0 flex-1 truncate text-left py-1 pr-1 pl-1.5">
										{selectedLanguageItem()?.label ?? ''}
									</span>
									<ChevronDown class="h-3.5 w-3.5 shrink-0 mr-1.5 opacity-70" aria-hidden="true" />
								</PopoverTrigger>
								<PopoverContent
									class={cn(
										'min-w-0 p-1 max-h-60 overflow-auto',
										primary()
											? 'bg-ink-900 border-white/20'
											: themeAuto()
												? 'bg-surface-raised border-surface-border'
												: 'bg-ink-900 border-ink-700'
									)}
									onCloseAutoFocus={(e) => e.preventDefault()}
								>
									<div class="flex flex-col" role="menu" aria-label="Language">
										<For each={local.languages ?? []}>
											{(item, idx) => (
												<button
													type="button"
													role="menuitemradio"
													aria-checked={selectedIndex() === idx()}
													class={cn(
														'w-full flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs font-medium transition-colors',
														primary()
															? 'text-ink-200 hover:bg-white/10 hover:text-white'
															: themeAuto()
																? 'text-ink-700 dark:text-ink-300 hover:bg-surface-overlay'
																: 'text-ink-300 hover:bg-ink-800',
														selectedIndex() === idx() && 'bg-primary-500/20 text-primary-600 dark:text-primary-400'
													)}
													onClick={() => {
														setSelectedIndex(idx())
														setLanguageOpen(false)
													}}
												>
													<Show when={item.icon && (typeof item.icon === 'function' || selectedIndex() !== idx())}>
														<span class="shrink-0 flex items-center [&>svg]:size-3.5 [&>img]:size-3.5 text-inherit" aria-hidden="true">
															{typeof item.icon === 'function' ? (item.icon as () => JSX.Element)() : item.icon}
														</span>
													</Show>
													<Show when={item.icon && typeof item.icon !== 'function' && selectedIndex() === idx()}>
														<span class="w-3.5 shrink-0" aria-hidden="true" />
													</Show>
													<span class="min-w-0 truncate">{item.label}</span>
												</button>
											)}
										</For>
									</div>
								</PopoverContent>
							</PopoverRoot>
						</Show>
						<Show when={local.alternateContent != null && local.alternateContent.trim() !== ''}>
							<button
								type="button"
								onClick={() => setShowAlternate((p) => !p)}
								aria-pressed={showAlternate()}
								class={cn(
									'flex items-center gap-1.5 shrink-0 px-2 py-1 text-xs font-medium rounded transition-colors',
									primary()
										? 'text-white/80 hover:bg-white/15 hover:text-white'
										: themeAuto()
											? 'text-ink-600 dark:text-ink-400 hover:bg-surface-overlay hover:text-ink-900 dark:hover:text-ink-100'
											: dark()
												? 'text-ink-400 hover:bg-ink-850 hover:text-ink-100'
												: 'text-ink-600 hover:bg-ink-200 hover:text-ink-800'
								)}
							>
								{showAlternate() ? 'Full code' : 'Component only'}
							</button>
						</Show>
						<Copy
							text={effectiveContent()}
							display="icon-only"
							variant="ghost"
							size="sm"
							class={copyButtonClass()}
						/>
					</div>
				</div>
			</Show>

			<Show when={!hasHeader()}>
				<div class="absolute top-4 right-4 z-10 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
					<Copy
						text={effectiveContent()}
						display="icon-only"
						variant="ghost"
						size="sm"
						class={copyButtonClass()}
					/>
				</div>
			</Show>

			<pre
				data-torchui="code-block"
				class={cn(
					'w-full py-3 px-4 text-sm font-mono whitespace-pre overflow-x-auto overflow-y-auto',
					minHeight(),
					themeClass(),
					/* No text-* on pre: let Prism theme (or token CSS) color tokens; otherwise inherited color overrides .token */
					showLineNumbers() && 'pl-0',
					local.preProps?.class
				)}
				{...(local.preProps ? (() => {
					const { class: _, ...rest } = local.preProps
					return rest
				})() : {})}
			>
				<Show
					when={showLineNumbers()}
					fallback={
						<code ref={setCodeEl} class={cn('block leading-5', `language-${currentLanguage()}`)} />
					}
				>
					<div class="flex min-w-0">
						<div
							class={cn(
								'select-none py-3 pr-3 pl-0 w-8 shrink-0 text-right text-xs font-mono tabular-nums',
								lineNumClass()
							)}
							aria-hidden="true"
						>
							<For each={lines()}>
								{(_, i) => {
									const num = i() + 1
									const isHighlighted = () => highlightLines().includes(num)
									return (
										<div
											class={cn(
												'leading-5',
												isHighlighted() &&
													(primary()
														? 'bg-white/20 -mx-1 px-1 rounded'
														: themeAuto()
															? 'bg-surface-dim -mx-1 px-1 rounded'
															: dark()
																? 'bg-ink-850 -mx-1 px-1 rounded'
																: 'bg-primary-100 dark:bg-primary-900/30 -mx-1 px-1 rounded')
											)}
										>
											{num}
										</div>
									)
								}}
							</For>
						</div>
						<code
							ref={setCodeEl}
							class={cn('block flex-1 min-w-0 py-4 pr-4 pl-4 leading-6', `language-${currentLanguage()}`)}
						/>
					</div>
				</Show>
			</pre>
		</>
	)

	return (
		<div
			ref={local.ref}
			data-torchui="code-block-container"
			class={cn(
				'rounded-lg overflow-hidden relative',
				!hasHeader() && !collapsible() && 'group',
				containerClass(),
				local.class
			)}
			{...others}
		>
			<Show when={collapsible()} fallback={codeContent}>
				<CollapsibleRoot open={codeOpen()} onOpenChange={setCodeOpen}>
					<CollapsibleTrigger class={triggerClass()}>
						{codeOpen() ? (
							<>
								<ChevronUp class="h-4 w-4" aria-hidden="true" />
								{local.collapsibleLabelHide ?? 'Hide code'}
							</>
						) : (
							<>
								<ChevronDown class="h-4 w-4" aria-hidden="true" />
								{local.collapsibleLabelShow ?? 'Show code'}
							</>
						)}
					</CollapsibleTrigger>
					<CollapsibleContentStyled>
						<div class="border-t border-surface-border">{codeContent}</div>
					</CollapsibleContentStyled>
				</CollapsibleRoot>
			</Show>
		</div>
	)
}
