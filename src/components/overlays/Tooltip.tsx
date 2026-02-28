import { type JSX, splitProps } from 'solid-js'
import * as TooltipPrimitive from '@kobalte/core/tooltip'
import { cn } from '../../utilities/classNames'

export const TooltipRoot = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger
export const TooltipPortal = TooltipPrimitive.Portal
export const TooltipContentPrimitive = TooltipPrimitive.Content
export const TooltipArrow = TooltipPrimitive.Arrow

export interface TooltipContentProps extends TooltipPrimitive.TooltipContentProps {
	class?: string
	children?: JSX.Element
}

export function TooltipContent(props: TooltipContentProps) {
	const [local, others] = splitProps(props, ['class', 'children'])
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				class={cn(
					'z-50 max-w-xs rounded-md border border-ink-200 bg-ink-900 px-3 py-2 text-sm text-white shadow-md',
					'dark:border-ink-600 dark:bg-ink-100 dark:text-ink-900',
					local.class
				)}
				{...others}
			>
				{local.children}
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	)
}
