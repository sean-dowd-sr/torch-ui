import { type JSX, splitProps } from 'solid-js'
import { Tooltip as KobalteTooltip, type TooltipContentProps as KobalteTooltipContentProps } from '@kobalte/core/tooltip'
import { cn } from '../../utilities/classNames'

export const TooltipRoot = KobalteTooltip
export const TooltipTrigger = KobalteTooltip.Trigger
export const TooltipPortal = KobalteTooltip.Portal
export const TooltipContentPrimitive = KobalteTooltip.Content
export const TooltipArrow = KobalteTooltip.Arrow

export interface TooltipContentProps extends KobalteTooltipContentProps {
	class?: string
	children?: JSX.Element
}

export function TooltipContent(props: TooltipContentProps) {
	const [local, others] = splitProps(props, ['class', 'children'])
	return (
		<KobalteTooltip.Portal>
			<KobalteTooltip.Content
				class={cn(
					'z-50 max-w-xs rounded-md border border-ink-200 bg-ink-900 px-3 py-2 text-sm text-white shadow-md',
					local.class
				)}
				{...others}
			>
				{local.children}
			</KobalteTooltip.Content>
		</KobalteTooltip.Portal>
	)
}
