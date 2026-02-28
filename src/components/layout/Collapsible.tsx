import { type JSX, splitProps } from 'solid-js'
import * as CollapsiblePrimitive from '@kobalte/core/collapsible'
import { ChevronDown } from 'lucide-solid'
import { cn } from '../lib/cn'

export const CollapsibleRoot = CollapsiblePrimitive.Root
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger
export const CollapsibleContent = CollapsiblePrimitive.Content

const COLLAPSIBLE_STYLE_ID = 'torchui-collapsible-styles'

const collapsibleStyles = `
.collapsible-content[data-expanded] {
	animation: torchui-collapsible-down 200ms ease-out;
}
.collapsible-content[data-closed] {
	animation: torchui-collapsible-up 200ms ease-out;
}
@keyframes torchui-collapsible-down {
	from { height: 0; opacity: 0; }
	to { height: var(--kb-collapsible-content-height); opacity: 1; }
}
@keyframes torchui-collapsible-up {
	from { height: var(--kb-collapsible-content-height); opacity: 1; }
	to { height: 0; opacity: 0; }
}
`

function ensureCollapsibleStyles() {
	if (typeof document === 'undefined') return
	if (document.getElementById(COLLAPSIBLE_STYLE_ID)) return
	const style = document.createElement('style')
	style.id = COLLAPSIBLE_STYLE_ID
	style.textContent = collapsibleStyles
	document.head.appendChild(style)
}

// Inject styles once on module load (client-side only)
// Note: In SSR, keyframes won't exist until client module runs, so first interaction may be unanimated
if (typeof document !== 'undefined') {
	ensureCollapsibleStyles()
}

export interface CollapsibleContentProps extends CollapsiblePrimitive.CollapsibleContentProps {
	class?: string
	children?: JSX.Element
}

export function CollapsibleContentStyled(props: CollapsibleContentProps) {
	const [local, others] = splitProps(props, ['class', 'children'])
	return (
		<CollapsiblePrimitive.Content
			class={cn('collapsible-content overflow-hidden', local.class)}
			{...others}
		>
			{local.children}
		</CollapsiblePrimitive.Content>
	)
}

export interface CollapsibleTriggerStyledProps extends CollapsiblePrimitive.CollapsibleTriggerProps {
	class?: string
	children?: JSX.Element
}

export function CollapsibleTriggerStyled(props: CollapsibleTriggerStyledProps) {
	const [local, others] = splitProps(props, ['class', 'children'])
	return (
		<CollapsiblePrimitive.Trigger
			class={cn(
				'flex w-full items-center justify-between gap-2 rounded-lg border border-surface-border bg-surface-base px-4 py-3 text-left text-sm font-medium text-ink-800 dark:text-ink-200',
				'hover:bg-surface-overlay',
				'data-[expanded]:rounded-b-none data-[expanded]:bg-surface-overlay',
				'data-[expanded]:[&>svg]:rotate-180',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
				local.class
			)}
			{...others}
		>
			{local.children}
			<ChevronDown class="h-4 w-4 shrink-0 transition-transform duration-200" aria-hidden="true" />
		</CollapsiblePrimitive.Trigger>
	)
}
