import { type JSX, type Component, splitProps, Show, For } from 'solid-js'
import { createStore } from 'solid-js/store'
import { cn } from '../../utilities/classNames'
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContentStyled } from '../layout/Collapsible'

export interface SidebarItem {
	key: string
	label: string
	icon?: JSX.Element
	active?: boolean
	disabled?: boolean
	badge?: string | number
	onClick?: () => void
	href?: string
	items?: SidebarItem[]
}

export interface SidebarGroup {
	title: string
	items: SidebarItem[]
	/** Groups with active items auto-open regardless. */
	defaultOpen?: boolean
}

export interface SidebarFooter {
	content: JSX.Element
	/** Sticky to bottom. Default false. */
	sticky?: boolean
}

export interface SidebarProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Optional JSX rendered at the very top of the sidebar, above the title and nav. */
	header?: JSX.Element
	/** Flat navigation items. Use `items` or `groups`, not both. */
	items?: SidebarItem[]
	/** Grouped navigation with collapsible section headers. */
	groups?: SidebarGroup[]
	/** Router-aware link component (e.g. `A` from @solidjs/router). Falls back to `<a>`. */
	linkComponent?: Component<any>
	title?: string
	showTitle?: boolean
	collapsible?: boolean
	collapsed?: boolean
	onCollapseChange?: (collapsed: boolean) => void
	showIcons?: boolean
	showBadges?: boolean
	footer?: JSX.Element | SidebarFooter
	variant?: 'default' | 'minimal' | 'padded'
}

function hasActiveItem(items: SidebarItem[]): boolean {
	for (const item of items) {
		if (item.active) return true
		if (item.items && hasActiveItem(item.items)) return true
	}
	return false
}

function ChevronIcon() {
	return (
		<svg
			class="h-3.5 w-3.5 shrink-0 transition-transform rotate-90 [[data-expanded]>&]:rotate-0"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	)
}

/** Sidebar navigation with flat items or grouped collapsible sections. */
export function Sidebar(props: SidebarProps) {
	const [local, others] = splitProps(props, [
		'header',
		'items',
		'groups',
		'linkComponent',
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
				return 'border-r border-surface-border'
			case 'padded':
				return 'border-r border-surface-border px-3 py-2'
			default:
				return 'border-r border-surface-border'
		}
	}

	const hasStickyFooter = () =>
		local.footer != null &&
		typeof local.footer === 'object' &&
		'sticky' in local.footer &&
		(local.footer as SidebarFooter).sticky === true

	const sidebarClass = () =>
		cn(
			hasStickyFooter() ? 'flex flex-col h-full min-w-0' : 'h-full overflow-x-hidden overflow-y-auto min-w-0',
			variantClasses(),
			local.collapsed ? 'w-16' : local.variant === 'padded' ? 'w-72' : 'w-64',
			'transition-all duration-300 ease-in-out',
			local.class
		)

	const titleClass = () =>
		cn(
			'px-4 py-3 text-lg font-semibold text-ink-900',
			local.collapsed ? 'hidden' : 'block'
		)

	const navigationClass = () =>
		cn(
			hasStickyFooter() ? 'flex-1 overflow-x-hidden overflow-y-auto' : '',
			local.variant === 'padded' ? 'py-1' : 'p-3'
		)

	const footerClass = () =>
		cn(
			'border-t border-surface-border p-4',
			local.collapsed ? 'hidden' : 'block'
		)

	const [groupOpenByTitle, setGroupOpenByTitle] = createStore<Record<string, boolean>>({})

	const renderLink = (
		item: SidebarItem,
		cls: string,
		children: JSX.Element
	) => {
		const LinkTag = local.linkComponent
		if (LinkTag) {
			return (
				<LinkTag
					href={item.href}
					class={cls}
					onClick={item.onClick}
					aria-current={item.active ? 'page' : undefined}
				>
					{children}
				</LinkTag>
			)
		}
		return (
			<a
				href={item.href}
				class={cls}
				onClick={item.onClick}
				aria-current={item.active ? 'page' : undefined}
			>
				{children}
			</a>
		)
	}

	const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
		const itemClass = () =>
			cn(
				'flex items-center w-full min-w-0 rounded-lg transition-colors',
				local.variant === 'minimal'
					? 'px-3 py-1.5 text-xs font-light'
					: 'px-3 py-2 text-sm',
				'outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-inset',
				item.active
					? 'text-primary-600 dark:text-primary-400'
					: 'text-ink-700 hover:text-ink-900',
				item.disabled && 'opacity-50 cursor-not-allowed',
				level > 0 && 'ml-4'
			)

		const iconClass = () =>
			cn(
				'w-5 h-5 flex-shrink-0',
				(local.showIcons ?? true) && !local.collapsed && 'mr-3',
				(local.showIcons ?? true) && local.collapsed && 'mx-auto',
				item.active ? 'text-primary-600 dark:text-primary-400' : 'text-ink-500'
			)

		const badgeClass = () =>
			cn(
				'px-2 py-0.5 text-xs rounded-full font-medium flex-shrink-0',
				(local.showBadges ?? true) && !local.collapsed && 'ml-auto',
				item.active
					? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
					: 'bg-surface-dim text-ink-600'
			)

		const ItemContent = () => (
			<>
				<Show when={item.icon && (local.showIcons ?? true)}>
					<div class={iconClass()}>{item.icon}</div>
				</Show>
				<Show when={!local.collapsed}>
					<span class="truncate">{item.label}</span>
				</Show>
				<Show when={item.badge != null && (local.showBadges ?? true) && !local.collapsed}>
					<span class={badgeClass()}>{item.badge}</span>
				</Show>
			</>
		)

		if (item.items && item.items.length > 0) {
			return (
				<li>
					<div class="space-y-0.5">
						{item.href
							? renderLink(item, itemClass(), <ItemContent />)
							: (
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
						<Show when={!local.collapsed}>
							<ul class="ml-4 space-y-0.5">
								<For each={item.items}>
									{(child) => renderSidebarItem(child, level + 1)}
								</For>
							</ul>
						</Show>
					</div>
				</li>
			)
		}

		return (
			<li>
				{item.href
					? renderLink(item, itemClass(), <ItemContent />)
					: (
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

	const renderGroup = (group: SidebarGroup) => {
		const isOpen = () => hasActiveItem(group.items) || (groupOpenByTitle[group.title] ?? (group.defaultOpen ?? false))
		return (
			<CollapsibleRoot
				class="mb-1"
				open={isOpen()}
				onOpenChange={(next) => setGroupOpenByTitle(group.title, next)}
			>
				<CollapsibleTrigger
					class={cn(
						'flex w-full items-center justify-between gap-1 rounded-lg px-2 py-1.5',
						'text-[11px] font-semibold uppercase tracking-wider',
						'text-ink-500',
						'hover:bg-surface-overlay hover:text-ink-700',
						'data-[expanded]:text-ink-700',
						'outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-inset'
					)}
				>
					<span>{group.title}</span>
					<ChevronIcon />
				</CollapsibleTrigger>
				<CollapsibleContentStyled variant="minimal" class="pt-0.5">
					<ul class="space-y-0.5">
						<For each={group.items}>
							{(item) => renderSidebarItem(item)}
						</For>
					</ul>
				</CollapsibleContentStyled>
			</CollapsibleRoot>
		)
	}

	return (
		<div class={sidebarClass()} {...others}>
			<Show when={local.header}>
				<div class="shrink-0">{local.header}</div>
			</Show>
			<Show when={local.title && local.showTitle !== false}>
				<div class={titleClass()}>
					{!local.collapsed && local.title}
				</div>
			</Show>

			<nav
				class={navigationClass()}
				aria-label={local.title || 'Sidebar navigation'}
			>
				<Show when={local.groups} fallback={
					<ul class="space-y-0.5" role="list">
						<For each={local.items}>
							{(item) => renderSidebarItem(item)}
						</For>
					</ul>
				}>
					<For each={local.groups}>
						{(group) => renderGroup(group)}
					</For>
				</Show>
			</nav>

			<Show when={local.footer}>
				<div class={footerClass()}>
					{!local.collapsed && local.footer && (
						typeof local.footer === 'object' && 'content' in local.footer
							? (local.footer as SidebarFooter).content
							: local.footer
					)}
				</div>
			</Show>
		</div>
	)
}
