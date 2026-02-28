import { type JSX, splitProps, Show, For } from 'solid-js'
import { cn } from '../../utilities/classNames'

export interface SidebarItem {
	/** Unique key for the item */
	key: string
	/** Display label for the item */
	label: string
	/** Icon to display (optional) */
	icon?: JSX.Element
	/** Whether the item is currently active */
	active?: boolean
	/** Whether the item is disabled */
	disabled?: boolean
	/** Badge to show (optional) */
	badge?: string | number
	/** Click handler */
	onClick?: () => void
	/** Link href (renders as anchor if provided) */
	href?: string
	/** Sub-items for nested navigation */
	items?: SidebarItem[]
}

export interface SidebarFooter {
	/** Footer content */
	content: JSX.Element
	/** Whether footer is sticky to bottom (default: false) */
	sticky?: boolean
}

export interface SidebarProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Array of navigation items */
	items: SidebarItem[]
	/** Sidebar title */
	title?: string
	/** Whether to show the sidebar title */
	showTitle?: boolean
	/** Whether the sidebar is collapsible */
	collapsible?: boolean
	/** Whether the sidebar is collapsed */
	collapsed?: boolean
	/** Callback when collapse state changes */
	onCollapseChange?: (collapsed: boolean) => void
	/** Whether to show icons */
	showIcons?: boolean | undefined
	/** Whether to show badges */
	showBadges?: boolean | undefined
	/** Custom footer content */
	footer?: JSX.Element | SidebarFooter
	/** Variant styling */
	variant?: 'default' | 'minimal' | 'padded'
}

/**
 * Sidebar component with nested navigation support.
 * Built with accessibility in mind and supports various styling options.
 */
export function Sidebar(props: SidebarProps) {
	const [local, others] = splitProps(props, [
		'items',
		'title',
		'showTitle',
		'collapsible',
		'collapsed',
		'onCollapseChange',
		'showIcons',
		'showBadges',
		'footer',
		'variant',
		'class',
	])

	const variantClasses = () => {
		switch (local.variant) {
			case 'minimal':
				return 'border-r border-ink-200 bg-surface-base'
			case 'padded':
				return 'border-r border-ink-200 bg-surface-raised px-3 py-2'
			default:
				return 'border-r border-ink-200 bg-surface-raised'
		}
	}

	const sidebarClass = () =>
		cn(
			local.footer && typeof local.footer === 'object' && 'sticky' in local.footer && local.footer.sticky === true
				? 'flex flex-col h-full min-w-0'
				: 'h-full overflow-x-hidden overflow-y-auto min-w-0',
			variantClasses(),
			local.collapsed ? 'w-16' : local.variant === 'padded' ? 'w-72' : 'w-64',
			'transition-all duration-300 ease-in-out',
			local.class
		)

	const titleClass = () =>
		cn(
			'px-4 py-3 text-lg font-semibold text-ink-900 border-b border-ink-200',
			local.collapsed ? 'hidden' : 'block'
		)

	const navigationClass = () =>
		cn(
			local.footer && typeof local.footer === 'object' && 'sticky' in local.footer && local.footer.sticky === true
				? 'flex-1 overflow-x-hidden overflow-y-auto'
				: '',
			local.variant === 'padded' ? 'py-1' : 'py-4'
		)

	const footerClass = () =>
		cn(
			'border-t border-ink-200 p-4',
			local.collapsed ? 'hidden' : 'block'
		)

	const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
		const itemClass = () =>
			cn(
				'flex items-center w-full min-w-0 px-3 py-2 text-sm rounded-md transition-colors',
				'hover:bg-surface-hover focus:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
				item.active 
					? 'bg-primary-600 text-white font-medium' 
					: 'text-ink-700 hover:text-ink-900 dark:hover:text-ink-900',
				item.disabled && 'opacity-50 cursor-not-allowed',
				level > 0 && 'ml-4'
			)

		const iconClass = () =>
			cn(
				'w-5 h-5 flex-shrink-0',
				(local.showIcons ?? true) && !local.collapsed && 'mr-3',
				(local.showIcons ?? true) && local.collapsed && 'mx-auto',
				item.active ? 'text-white' : 'text-ink-500'
			)

		const badgeClass = () =>
			cn(
				'px-2 py-1 text-xs rounded-full font-medium flex-shrink-0',
				(local.showBadges ?? true) && !local.collapsed && 'ml-auto',
				item.active
					? 'bg-white text-primary-600'
					: 'bg-surface-dim text-ink-600'
			)

		const ItemContent = () => (
			<>
				{/* Icon */}
				<Show when={item.icon && (local.showIcons ?? true)}>
					<div class={iconClass()}>
						{item.icon}
					</div>
				</Show>

				{/* Label */}
				<span class="truncate">{item.label}</span>

				{/* Badge */}
				<Show when={item.badge && (local.showBadges ?? true) && !local.collapsed}>
					<span class={badgeClass()}>
						{item.badge}
					</span>
				</Show>
			</>
		)

		// Handle nested items
		if (item.items && item.items.length > 0) {
			return (
				<li role="listitem">
					<div class="space-y-1">
						{/* Parent item */}
						{item.href ? (
							<a
								href={item.href}
								class={itemClass()}
								aria-current={item.active ? 'page' : undefined}
							>
								<ItemContent />
							</a>
						) : (
							<button
								type="button"
								class={itemClass()}
								onClick={item.onClick}
								disabled={item.disabled}
								aria-current={item.active ? 'page' : undefined}
							>
								<ItemContent />
							</button>
						)}

						{/* Nested items */}
						<Show when={!local.collapsed}>
							<div class="ml-4 space-y-1">
								{renderNavigationItems(item.items, level + 1)}
							</div>
						</Show>
					</div>
				</li>
			)
		}

		// Handle regular items
		return (
			<li role="listitem">
				{item.href ? (
					<a
						href={item.href}
						class={itemClass()}
						onClick={item.onClick}
						aria-current={item.active ? 'page' : undefined}
					>
						<ItemContent />
					</a>
				) : (
					<button
						type="button"
						class={itemClass()}
						onClick={item.onClick}
						disabled={item.disabled}
						aria-current={item.active ? 'page' : undefined}
					>
						<ItemContent />
					</button>
				)}
			</li>
		)
	}

	const renderNavigationItems = (items: SidebarItem[], level: number = 0) => {
		return (
			<div class="space-y-1 min-w-0">
				<For each={items}>
					{(item) => {
						if (item.items && item.items.length > 0) {
							return (
								<div class="space-y-1 min-w-0">
									{renderSidebarItem(item, level)}
								</div>
							)
						}
						return renderSidebarItem(item, level)
					}}
				</For>
			</div>
		)
	}

	return (
		<div class={sidebarClass()} {...others}>
			{/* Header */}
			<Show when={local.title && local.showTitle !== false}>
				<div class={titleClass()}>
					{!local.collapsed && local.title}
				</div>
			</Show>

			{/* Navigation */}
			<nav 
				class={navigationClass()} 
				aria-label={local.title || 'Sidebar navigation'}
			>
				<ul class="space-y-1" role="list">
					{renderNavigationItems(local.items)}
				</ul>
			</nav>

			{/* Footer */}
			<Show when={local.footer}>
				<div class={footerClass()}>
					{!local.collapsed && local.footer && (
						typeof local.footer === 'object' && 'content' in local.footer 
							? local.footer.content 
							: local.footer
					)}
				</div>
			</Show>
		</div>
	)
}
