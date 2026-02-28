import { type JSX, splitProps } from 'solid-js'
import { DropdownMenu as KobalteDropdownMenu } from '@kobalte/core/dropdown-menu'
import type { 
	DropdownMenuContentProps as KobalteDropdownMenuContentProps, 
	DropdownMenuItemProps as KobalteDropdownMenuItemProps, 
	DropdownMenuSeparatorProps as KobalteDropdownMenuSeparatorProps,
	DropdownMenuTriggerProps as KobalteDropdownMenuTriggerProps 
} from '@kobalte/core/dropdown-menu'
import { cn } from '../../utilities/classNames'

export interface DropdownMenuContentProps extends KobalteDropdownMenuContentProps {
	class?: string
	children: JSX.Element
}

export function DropdownMenuContent(props: DropdownMenuContentProps) {
	const [local, others] = splitProps(props, ['class', 'children'])
	return (
		<KobalteDropdownMenu.Portal>
			<KobalteDropdownMenu.Content
				class={cn(
					'z-50 min-w-[160px] rounded-lg border border-surface-border bg-surface-raised p-1 shadow-lg',
					local.class,
				)}
				{...others}
			>
				{local.children}
			</KobalteDropdownMenu.Content>
		</KobalteDropdownMenu.Portal>
	)
}

export interface DropdownMenuItemProps extends KobalteDropdownMenuItemProps {
	class?: string
	children: JSX.Element
}

export function DropdownMenuItem(props: DropdownMenuItemProps) {
	const [local, others] = splitProps(props, ['class', 'children'])
	return (
		<KobalteDropdownMenu.Item
			class={cn(
				'flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm text-ink-700 outline-none',
				'dark:text-ink-200',
				'data-[highlighted]:bg-surface-overlay data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
				local.class,
			)}
			{...others}
		>
			{local.children}
		</KobalteDropdownMenu.Item>
	)
}

export interface DropdownMenuSeparatorProps extends KobalteDropdownMenuSeparatorProps {
	class?: string
}

export function DropdownMenuSeparator(props: DropdownMenuSeparatorProps) {
	const [local, others] = splitProps(props, ['class'])
	return (
		<KobalteDropdownMenu.Separator
			class={cn('my-1 h-px bg-surface-dim', local.class)}
			{...others}
		/>
	)
}

export interface DropdownMenuTriggerProps extends Omit<KobalteDropdownMenuTriggerProps, 'class' | 'children'> {
	class?: string
	children: JSX.Element
}

export function DropdownMenuTrigger(props: DropdownMenuTriggerProps) {
	const [local, others] = splitProps(props, ['class', 'children'])
	return (
		<KobalteDropdownMenu.Trigger
			class={cn(local.class)}
			{...others}
		>
			{local.children}
		</KobalteDropdownMenu.Trigger>
	)
}

// Re-export the root Kobalte DropdownMenu for convenience
export { DropdownMenu } from '@kobalte/core/dropdown-menu'
