import { type JSX, splitProps } from 'solid-js'
import * as ContextMenuPrimitive from '@kobalte/core/context-menu'
import { cn } from '../../utilities/classNames'

/** Pass-through to Kobalte's ContextMenu.Root. See Kobalte docs for available props (e.g. onOpenChange). */
export const ContextMenuRoot = ContextMenuPrimitive.Root
/** Pass-through to Kobalte's ContextMenu.Trigger. Renders as the element that responds to right-click. */
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger

export interface ContextMenuContentProps extends ContextMenuPrimitive.ContextMenuContentProps {
	class?: string
	children?: JSX.Element
}

export function ContextMenuContent(props: ContextMenuContentProps) {
	const [local, others] = splitProps(props, ['class', 'children'])
	return (
		<ContextMenuPrimitive.Portal>
			<ContextMenuPrimitive.Content
				class={cn(
					'z-50 min-w-[160px] rounded-lg border border-surface-border bg-surface-raised p-1 shadow-lg',
					local.class
				)}
				{...others}
			>
				{local.children}
			</ContextMenuPrimitive.Content>
		</ContextMenuPrimitive.Portal>
	)
}

export interface ContextMenuItemProps extends ContextMenuPrimitive.ContextMenuItemProps {
	class?: string
	children: JSX.Element
}

export function ContextMenuItem(props: ContextMenuItemProps) {
	const [local, others] = splitProps(props, ['class', 'children'])
	return (
		<ContextMenuPrimitive.Item
			class={cn(
				'flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm text-ink-700 outline-none',
				'dark:text-ink-200',
				'data-[highlighted]:bg-surface-overlay data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
				local.class,
			)}
			{...others}
		>
			{local.children}
		</ContextMenuPrimitive.Item>
	)
}

export interface ContextMenuSeparatorProps extends ContextMenuPrimitive.ContextMenuSeparatorProps {
	class?: string
}

export function ContextMenuSeparator(props: ContextMenuSeparatorProps) {
	const [local, others] = splitProps(props, ['class'])
	return (
		<ContextMenuPrimitive.Separator
			class={cn('my-1 h-px bg-surface-border', local.class)}
			{...others}
		/>
	)
}
