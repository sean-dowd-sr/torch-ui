import { type JSX, splitProps } from 'solid-js'
import { Accordion as KobalteAccordion } from '@kobalte/core/accordion'
import type { AccordionContentProps as KobalteAccordionContentProps, AccordionTriggerProps as KobalteAccordionTriggerProps, AccordionItemProps as KobalteAccordionItemProps } from '@kobalte/core/accordion'
import { ChevronDown } from 'lucide-solid'
import { cn } from '../../utilities/classNames'

export const AccordionRoot = KobalteAccordion
export const AccordionItem = KobalteAccordion.Item
export const AccordionHeader = KobalteAccordion.Header
export const AccordionTrigger = KobalteAccordion.Trigger
export const AccordionContent = KobalteAccordion.Content

const accordionContentStyles = `
.accordion-content[data-expanded] {
	animation: torchui-accordion-down 200ms ease-out;
}
.accordion-content[data-closed] {
	animation: torchui-accordion-up 200ms ease-out;
}
@keyframes torchui-accordion-down {
	from { height: 0; opacity: 0; }
	to { height: var(--kb-accordion-content-height); opacity: 1; }
}
@keyframes torchui-accordion-up {
	from { height: var(--kb-accordion-content-height); opacity: 1; }
	to { height: 0; opacity: 0; }
}
`

export interface AccordionContentProps extends KobalteAccordionContentProps {
	class?: string
	children?: JSX.Element
}

const ACCORDION_STYLE_ID = 'torchui-accordion-styles'

function ensureAccordionStyles() {
	if (typeof document === 'undefined') return
	if (document.getElementById(ACCORDION_STYLE_ID)) return
	const style = document.createElement('style')
	style.id = ACCORDION_STYLE_ID
	style.textContent = accordionContentStyles
	document.head.appendChild(style)
}

if (typeof document !== 'undefined') ensureAccordionStyles()

export function AccordionContentStyled(props: AccordionContentProps) {
	const [local, others] = splitProps(props, ['class', 'children'])
	return (
		<KobalteAccordion.Content
			class={cn(
				'accordion-content overflow-hidden border-b border-surface-border bg-surface-base/50',
				local.class
			)}
			{...others}
		>
			<div class="px-4 py-3 text-sm text-ink-700 dark:text-ink-300">{local.children}</div>
		</KobalteAccordion.Content>
	)
}

export interface AccordionTriggerStyledProps extends KobalteAccordionTriggerProps {
	class?: string
	children?: JSX.Element
}

export function AccordionTriggerStyled(props: AccordionTriggerStyledProps) {
	const [local, others] = splitProps(props, ['class', 'children'])
	return (
		<KobalteAccordion.Header as="h3" class="flex">
			<KobalteAccordion.Trigger
				class={cn(
					'flex flex-1 items-center justify-between gap-2 rounded-t-lg px-4 py-3 text-left text-sm font-medium text-ink-800 dark:text-ink-200',
					'hover:bg-ink-100 dark:hover:bg-ink-800',
					'data-[expanded]:rounded-b-none data-[expanded]:bg-ink-100 dark:data-[expanded]:bg-ink-800',
					'data-[expanded]:[&>svg]:rotate-180',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
					'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
					local.class
				)}
				{...others}
			>
				{local.children}
				<ChevronDown class="h-4 w-4 shrink-0 transition-transform duration-200" aria-hidden="true" />
			</KobalteAccordion.Trigger>
		</KobalteAccordion.Header>
	)
}

export interface AccordionItemStyledProps extends KobalteAccordionItemProps {
	class?: string
	children?: JSX.Element
}

export function AccordionItemStyled(props: AccordionItemStyledProps) {
	const [local, others] = splitProps(props, ['class', 'children'])
	return (
		<KobalteAccordion.Item
			class={cn(
				'w-full rounded-lg border border-surface-border',
				'data-[disabled]:opacity-60 data-[disabled]:cursor-not-allowed',
				local.class
			)}
			{...others}
		>
			{local.children}
		</KobalteAccordion.Item>
	)
}
