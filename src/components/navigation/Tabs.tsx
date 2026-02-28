import { For, splitProps, type Accessor } from 'solid-js'
import * as TabsPrimitive from '@kobalte/core/tabs'
import { cn } from '../../utilities/classNames'

/** Kobalte tabs root. Use for custom tab layouts; prefer Tabs for the standard tab bar. */
export const KobalteTabs = TabsPrimitive.Root

export interface TabItem {
	id: string
	label: string
}

export interface TabsProps
	extends Omit<TabsPrimitive.TabsRootProps, 'value' | 'defaultValue' | 'onChange'> {
	tabs: TabItem[]
	/** Current tab id (controlled), or omit and use defaultValue for uncontrolled. */
	value?: string | Accessor<string>
	/** Initial tab id when uncontrolled. */
	defaultValue?: string
	/** Called when selected tab changes. Optional for uncontrolled usage. */
	onValueChange?: (tabId: string) => void
	/** Accessible label for the tab list. Default: "Tabs". */
	ariaLabel?: string
	class?: string
}

/** Generic tab bar. Content is rendered by the parent based on value. */
export function Tabs(props: TabsProps) {
	const [local, others] = splitProps(props, [
		'tabs', 'value', 'defaultValue', 'onValueChange', 'ariaLabel', 'class',
	])

	const resolvedValue = () => {
		const v = local.value
		if (v === undefined) return undefined
		return typeof v === 'function' ? v() : v
	}
	const isControlled = () => local.value !== undefined
	// Tab ids are never empty — coerce empty string to undefined so Kobalte
	// doesn't try to select a non-existent tab.
	const normalizedValue = () => {
		const v = resolvedValue()
		return v && v.length > 0 ? v : undefined
	}

	return (
		<div class={cn('mb-6 border-b border-surface-border', local.class)}>
			<KobalteTabs
				value={isControlled() ? normalizedValue() : undefined}
				defaultValue={!isControlled() ? (local.defaultValue ?? local.tabs[0]?.id) : undefined}
				onChange={local.onValueChange}
				{...others}
			>
				<TabsPrimitive.List
					class="flex w-full flex-nowrap gap-1 overflow-x-auto rounded-none border-0 bg-transparent p-0"
					aria-label={local.ariaLabel ?? 'Tabs'}
				>
					<For each={local.tabs}>
						{(tab) => (
							<TabsPrimitive.Trigger
								value={tab.id}
								class="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent bg-transparent px-5 py-3 text-sm font-medium text-ink-500 transition-colors hover:border-primary-300 hover:text-primary-700 data-[selected]:border-primary-500 data-[selected]:bg-transparent data-[selected]:text-primary-600 data-[selected]:shadow-none dark:text-ink-400 dark:hover:text-primary-400 dark:data-[selected]:border-primary-400 dark:data-[selected]:text-primary-400"
							>
								{tab.label}
							</TabsPrimitive.Trigger>
						)}
					</For>
				</TabsPrimitive.List>
			</KobalteTabs>
		</div>
	)
}

export interface TabsListProps extends TabsPrimitive.TabsListProps {
	class?: string
}

export function TabsList(props: TabsListProps) {
	const [local, others] = splitProps(props, ['class'])
	return (
		<TabsPrimitive.List
			class={cn(
				'inline-flex items-center gap-1 rounded-lg border border-surface-border bg-surface-raised p-1',
				local.class,
			)}
			{...others}
		/>
	)
}

export interface TabsTriggerProps extends TabsPrimitive.TabsTriggerProps {
	class?: string
}

export function TabsTrigger(props: TabsTriggerProps) {
	const [local, others] = splitProps(props, ['class'])
	return (
		<TabsPrimitive.Trigger
			class={cn(
				'rounded-md px-3 py-1.5 text-xs font-medium text-ink-500 transition-colors',
				'data-[selected]:bg-surface-overlay data-[selected]:text-ink-900',
				'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
				local.class,
			)}
			{...others}
		/>
	)
}

export interface TabsContentProps extends TabsPrimitive.TabsContentProps {
	class?: string
}

export function TabsContent(props: TabsContentProps) {
	const [local, others] = splitProps(props, ['class'])
	return (
		<TabsPrimitive.Content
			class={cn('mt-4', local.class)}
			{...others}
		/>
	)
}
