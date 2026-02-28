import { type JSX, splitProps } from 'solid-js'
import { ContextMenu as KobalteContextMenu, type ContextMenuContentProps as KobalteContextMenuContentProps, type ContextMenuItemProps as KobalteContextMenuItemProps, type ContextMenuSeparatorProps as KobalteContextMenuSeparatorProps } from '@kobalte/core/context-menu'
import { cn } from '../../utilities/classNames'

/** Pass-through to Kobalte's ContextMenu.Root. See Kobalte docs for available props (e.g. onOpenChange). */
export const ContextMenuRoot = KobalteContextMenu
/** Pass-through to Kobalte's ContextMenu.Trigger. Renders as the element that responds to right-click. */
export const ContextMenuTrigger = KobalteContextMenu.Trigger

export interface ContextMenuContentProps extends KobalteContextMenuContentProps {
	class?: string
	children?: JSX.Element
}

export function ContextMenuContent(props: ContextMenuContentProps) {
	const [local, others] = splitProps(props, ['class', 'children'])
	return (
		<KobalteContextMenu.Portal>
			<KobalteContextMenu.Content
				class={cn(
					'z-50 min-w-[160px] rounded-lg border border-surface-border bg-surface-raised p-1 shadow-lg',
					local.class
				)}
				{...others}
			>
				{local.children}
			</KobalteContextMenu.Content>
		</KobalteContextMenu.Portal>
	)
}

export interface ContextMenuItemProps extends KobalteContextMenuItemProps {
	class?: string
	children: JSX.Element
}

export function ContextMenuItem(props: ContextMenuItemProps) {
	const [local, others] = splitProps(props, ['class', 'children'])
	return (
		<KobalteContextMenu.Item
			class={cn(
				'flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm text-ink-700 outline-none',
				'data-[highlighted]:bg-surface-overlay data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
				local.class,
			)}
			{...others}
		>
			{local.children}
		</KobalteContextMenu.Item>
	)
}

export interface ContextMenuSeparatorProps extends KobalteContextMenuSeparatorProps {
	class?: string
}

export function ContextMenuSeparator(props: ContextMenuSeparatorProps) {
	const [local, others] = splitProps(props, ['class'])
	return (
		<KobalteContextMenu.Separator
			class={cn('my-1 h-px bg-surface-border', local.class)}
			{...others}
		/>
	)
}
