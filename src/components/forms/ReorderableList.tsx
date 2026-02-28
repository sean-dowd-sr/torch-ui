import { For, Show, type JSX, splitProps } from 'solid-js'
import { ChevronDown, ChevronUp, GripVertical, X } from 'lucide-solid'
import {
	DragDropProvider,
	DragDropSensors,
	SortableProvider,
	createSortable,
	type DragEvent as DnDDragEvent,
} from '@thisbeyond/solid-dnd'
import { cn } from '../lib/cn'

export interface ReorderableListItem {
	id: string
	label: string
}

export interface ReorderableListProps extends JSX.HTMLAttributes<HTMLDivElement> {
	items: ReorderableListItem[]
	onReorder: (ids: string[]) => void
	/** When true, show up/down arrow buttons to reorder. Default false (drag only). */
	showMoveButtons?: boolean
	onRemove?: (id: string) => void
	class?: string
}

function SortableItem(props: {
	item: ReorderableListItem
	index: number
	count: number
	showMoveButtons: boolean
	onRemove?: (id: string) => void
	move: (id: string, direction: 'up' | 'down') => void
}) {
	const sortable = createSortable(props.item.id)

	const canMoveUp = () => props.index > 0
	const canMoveDown = () => props.index < props.count - 1

	return (
		<div
			role="listitem"
			ref={sortable.ref}
			// @ts-expect-error solid-dnd directive not in JSX namespace
			use:sortable
			class={cn(
				'flex items-center justify-between rounded-lg border border-surface-border bg-surface-raised px-4 py-3 text-sm transition-shadow',
				sortable.isActiveDraggable && 'z-50 shadow-lg',
			)}
		>
			<div class="flex items-center gap-2 text-ink-700 dark:text-ink-200">
				<button
					type="button"
					class="inline-flex h-7 w-7 shrink-0 cursor-grab items-center justify-center rounded-md text-ink-400 hover:bg-ink-100 active:cursor-grabbing dark:hover:bg-ink-700"
					aria-label={`Drag to reorder ${props.item.label}`}
					{...sortable.dragActivators}
				>
					<GripVertical class="h-4 w-4" aria-hidden="true" />
				</button>
				<span>{props.item.label}</span>
			</div>
			<div class="flex shrink-0 items-center gap-1">
				<Show when={props.showMoveButtons}>
					<button
						type="button"
						disabled={!canMoveUp()}
						class={cn(
							'rounded-md p-1 text-ink-500',
							canMoveUp() && 'hover:bg-ink-100 dark:hover:bg-ink-700',
							!canMoveUp() && 'opacity-40 cursor-not-allowed',
						)}
						aria-label={`Move ${props.item.label} up`}
						onClick={() => props.move(props.item.id, 'up')}
					>
						<ChevronUp class="h-4 w-4" aria-hidden="true" />
					</button>
					<button
						type="button"
						disabled={!canMoveDown()}
						class={cn(
							'rounded-md p-1 text-ink-500',
							canMoveDown() && 'hover:bg-ink-100 dark:hover:bg-ink-700',
							!canMoveDown() && 'opacity-40 cursor-not-allowed',
						)}
						aria-label={`Move ${props.item.label} down`}
						onClick={() => props.move(props.item.id, 'down')}
					>
						<ChevronDown class="h-4 w-4" aria-hidden="true" />
					</button>
				</Show>
				<Show when={props.onRemove}>
					<button
						type="button"
						class="rounded-md p-1 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-700"
						aria-label={`Remove ${props.item.label}`}
						onClick={() => props.onRemove?.(props.item.id)}
					>
						<X class="h-4 w-4" aria-hidden="true" />
					</button>
				</Show>
			</div>
		</div>
	)
}

function ReorderableListInner(props: ReorderableListProps) {
	const [local, others] = splitProps(props, ['items', 'onReorder', 'onRemove', 'showMoveButtons', 'class'])
	const showMoveButtons = () => local.showMoveButtons === true

	const move = (id: string, direction: 'up' | 'down') => {
		const ids = local.items.map((item) => item.id)
		const index = ids.indexOf(id)
		const nextIndex = direction === 'up' ? index - 1 : index + 1
		if (index === -1 || nextIndex < 0 || nextIndex >= ids.length) return
		const next = [...ids]
		const [moved] = next.splice(index, 1)
		next.splice(nextIndex, 0, moved)
		local.onReorder(next)
	}

	return (
		<div role="list" class={cn('space-y-2', local.class)} {...others}>
			<For each={local.items}>
				{(item, index) => (
					<SortableItem
						item={item}
						index={index()}
						count={local.items.length}
						showMoveButtons={showMoveButtons()}
						onRemove={local.onRemove}
						move={move}
					/>
				)}
			</For>
		</div>
	)
}

export function ReorderableList(props: ReorderableListProps) {
	const ids = () => props.items.map((i) => i.id)

	const handleDragEnd = (event: DnDDragEvent) => {
		const { draggable, droppable } = event
		if (!droppable || draggable.id === droppable.id) return
		const order = props.items.map((i) => i.id)
		const fromIndex = order.indexOf(String(draggable.id))
		const toIndex = order.indexOf(String(droppable.id))
		if (fromIndex === -1 || toIndex === -1) return
		const next = [...order]
		const [moved] = next.splice(fromIndex, 1)
		next.splice(toIndex, 0, moved)
		// Defer so Solid DnD can clear transforms before we re-render
		queueMicrotask(() => props.onReorder(next))
	}

	return (
		<DragDropProvider onDragEnd={handleDragEnd}>
			<DragDropSensors />
			<SortableProvider ids={ids()}>
				<ReorderableListInner {...props} />
			</SortableProvider>
		</DragDropProvider>
	)
}
