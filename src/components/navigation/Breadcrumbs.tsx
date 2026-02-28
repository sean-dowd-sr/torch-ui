import { type JSX, For, Show, splitProps } from 'solid-js'
import { ChevronRight } from 'lucide-solid'
import { Breadcrumbs as KobalteBreadcrumbs } from '@kobalte/core/breadcrumbs'
import { cn } from '../lib/cn'

export interface BreadcrumbItem {
	/** Label to show. */
	label: string
	/** If set, rendered as a link (anchor). Use your router's Link in the app if needed. */
	href?: string
}

export interface BreadcrumbsProps {
	/** List of items. Last item is typically current page (no href). */
	items: BreadcrumbItem[]
	/** Optional separator between items. Default ChevronRight. */
	separator?: JSX.Element
	/** Root class. */
	class?: string
}

function DefaultSeparator(): JSX.Element {
	return <ChevronRight class="h-4 w-4 shrink-0 text-ink-400 dark:text-ink-500" aria-hidden="true" />
}

export function Breadcrumbs(props: BreadcrumbsProps) {
	const [local] = splitProps(props, ['items', 'separator', 'class'])

	const separator = () => local.separator ?? <DefaultSeparator />

	return (
		<KobalteBreadcrumbs class={cn('flex flex-wrap items-center gap-1 text-sm', local.class)}>
			<ol class="flex flex-wrap items-center gap-1">
				<For each={local.items}>
					{(item, i) => {
						const isLast = () => i() === local.items.length - 1
						return (
							<li class="flex items-center gap-1" classList={{ 'text-ink-500 dark:text-ink-400': !isLast() }}>
								<Show when={i() > 0}>
									<KobalteBreadcrumbs.Separator class="flex shrink-0">
										{separator()}
									</KobalteBreadcrumbs.Separator>
								</Show>
								<Show
									when={!!item.href && !isLast()}
									fallback={
										<span class="font-medium text-ink-800 dark:text-ink-200" {...(isLast() && { 'aria-current': 'page' })}>
											{item.label}
										</span>
									}
								>
									<KobalteBreadcrumbs.Link
										href={item.href!}
										class="text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-ink-100 underline-offset-2 hover:underline"
									>
										{item.label}
									</KobalteBreadcrumbs.Link>
								</Show>
							</li>
						)
					}}
				</For>
			</ol>
		</KobalteBreadcrumbs>
	)
}
