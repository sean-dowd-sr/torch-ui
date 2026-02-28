import type { JSX } from 'solid-js'
import { createSignal, createUniqueId, For, Show, splitProps } from 'solid-js'
import { Check, ChevronDown, GripVertical, X } from 'lucide-solid'
import { Select as KobalteSelect } from '@kobalte/core/select'
import {
	DragDropProvider,
	DragDropSensors,
	SortableProvider,
	createSortable,
} from '@thisbeyond/solid-dnd'
import { cn } from '../lib/cn'

export interface MultiSelectOption {
	value: string
	label: string
	icon?: JSX.Element
}

export interface MultiSelectProps {
	label?: string
	/** Hint text below the control. Prefer helperText; description is supported for backward compatibility. */
	description?: string
	/** Hint text below the control (same as description). */
	helperText?: string
	/** Error message and invalid styling. */
	error?: string
	/** When true, never render label row or error/helper text (control only). */
	bare?: boolean
	/** When true, show required indicator on label. */
	required?: boolean
	/** When true, show "optional" on the label row when not required. Default false. */
	optional?: boolean
	options: MultiSelectOption[]
	value: string[]
	onChange: (value: string[]) => void
	placeholder?: string
	class?: string
	/** When true, selected chips can be reordered via drag. Default false. */
	reorderable?: boolean
	/** When true, show a search input to filter options. Default false. */
	searchable?: boolean
	/** When true, the control is non-interactive and shows placeholder only. */
	disabled?: boolean
	/** When true, use compact trigger height (36px). Default is standard (40px). Aligns with Input, Select, Autocomplete. */
	compact?: boolean
	/** Ref forwarded to the root wrapper div. */
	ref?: (el: HTMLDivElement) => void
}

function ChipContent(props: {
	opt: MultiSelectOption
	onRemove: (opt: MultiSelectOption) => void
	showGrip?: boolean
	gripActivators?: Record<string, unknown>
	isDragging?: boolean
}) {
	return (
		<span
			class={cn(
				'inline-flex max-w-[200px] shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium',
				'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200',
				props.isDragging && 'shadow-md',
			)}
		>
			<Show when={props.showGrip}>
				<button
					type="button"
					class="cursor-grab shrink-0 text-ink-400 hover:text-ink-600 dark:text-ink-500 dark:hover:text-ink-300 active:cursor-grabbing"
					aria-label="Drag to reorder"
					{...(props.gripActivators ?? {})}
				>
					<GripVertical class="h-3.5 w-3.5" aria-hidden="true" />
				</button>
			</Show>
			<Show when={props.opt.icon}>
				<span class="shrink-0 text-current opacity-70">{props.opt.icon}</span>
			</Show>
			<span class="min-w-0 truncate">{props.opt.label}</span>
			<button
				type="button"
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					props.onRemove(props.opt)
				}}
				onPointerDown={(e) => e.stopPropagation()}
				class="rounded p-0.5 hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-ink-400 dark:focus:ring-ink-500"
				aria-label={`Remove ${props.opt.label}`}
			>
				<X class="h-3.5 w-3.5" aria-hidden="true" />
			</button>
		</span>
	)
}

function SortableChip(props: { opt: MultiSelectOption; onRemove: (opt: MultiSelectOption) => void }) {
	const sortable = createSortable(props.opt.value)
	const style = () => ({
		transform: sortable.transform ? `translate3d(${sortable.transform.x}px, ${sortable.transform.y}px, 0)` : undefined,
	})
	return (
		<span ref={sortable.ref} style={style()}>
			<ChipContent
				opt={props.opt}
				onRemove={props.onRemove}
				showGrip
				gripActivators={sortable.dragActivators}
				isDragging={sortable.isActiveDraggable}
			/>
		</span>
	)
}

function ChipsList(props: {
	selectedOptions: MultiSelectOption[]
	onRemove: (opt: MultiSelectOption) => void
	reorderable: boolean
	onReorder: (newOrder: string[]) => void
}) {
	const ids = () => props.selectedOptions.map((o) => o.value)
	const handleDragEnd = ({
		draggable,
		droppable,
	}: {
		draggable: { id: string }
		droppable?: { id: string } | null
	}) => {
		if (!droppable || draggable.id === droppable.id) return
		const fromIndex = props.selectedOptions.findIndex((o) => o.value === draggable.id)
		const toIndex = props.selectedOptions.findIndex((o) => o.value === droppable!.id)
		if (fromIndex === -1 || toIndex === -1) return
		const next = [...props.selectedOptions]
		const [moved] = next.splice(fromIndex, 1)
		next.splice(toIndex, 0, moved)
		props.onReorder(next.map((o) => o.value))
	}

	if (props.reorderable && props.selectedOptions.length > 0) {
		return (
			<DragDropProvider onDragEnd={handleDragEnd as (e: unknown) => void}>
				<DragDropSensors />
				<SortableProvider ids={ids()}>
					<For each={props.selectedOptions}>
						{(opt) => <SortableChip opt={opt} onRemove={props.onRemove} />}
					</For>
				</SortableProvider>
			</DragDropProvider>
		)
	}
	return (
		<For each={props.selectedOptions}>
			{(opt) => <ChipContent opt={opt} onRemove={props.onRemove} />}
		</For>
	)
}

export function MultiSelect(props: MultiSelectProps) {
	const [local] = splitProps(props, [
		'label',
		'description',
		'helperText',
		'error',
		'bare',
		'required',
		'optional',
		'options',
		'value',
		'onChange',
		'placeholder',
		'class',
		'reorderable',
		'searchable',
		'disabled',
		'compact',
		'ref',
	])
	const helperOrDescription = () => local.helperText ?? local.description
	const uid = createUniqueId()
	const helperId = () => helperOrDescription() ? `ms-${uid}-help` : undefined
	const errorId = () => local.error ? `ms-${uid}-error` : undefined
	const describedBy = () => [helperId(), errorId()].filter(Boolean).join(' ') || undefined
	const [searchQuery, setSearchQuery] = createSignal('')

	const filteredOptions = (): MultiSelectOption[] => {
		if (!local.searchable) return local.options
		const q = searchQuery().trim().toLowerCase()
		if (!q) return local.options
		return local.options.filter((o) => o.label.toLowerCase().includes(q))
	}

	// Kobalte multiple mode uses option objects for value/onChange; we expose string[].
	const selectedOptions = (): MultiSelectOption[] =>
		local.value
			.map((v) => local.options.find((o) => o.value === v))
			.filter((o): o is MultiSelectOption => o != null)

	const handleChange = (opts: MultiSelectOption | MultiSelectOption[] | null) => {
		const arr = opts == null ? [] : Array.isArray(opts) ? opts : [opts]
		local.onChange(arr.map((o) => o.value))
	}

	// Always include selected items in options so selection doesn't vanish when search filters them out
	const optionsForSelect = (): MultiSelectOption[] => {
		const base = filteredOptions()
		const selected = selectedOptions()
		const missing = selected.filter((s) => !base.some((o) => o.value === s.value))
		return missing.length ? [...missing, ...base] : base
	}

	let searchInputRef: HTMLInputElement | undefined
	const handleOpenChange = (open: boolean) => {
		if (!open) setSearchQuery('')
		else if (local.searchable) {
			requestAnimationFrame(() => searchInputRef?.focus())
		}
	}

	return (
		<div ref={local.ref} class={cn('w-full', local.class)}>
			<KobalteSelect<MultiSelectOption>
				multiple
				options={optionsForSelect()}
				optionValue="value"
				optionTextValue="label"
				value={selectedOptions()}
				onChange={handleChange}
				placeholder={local.placeholder ?? 'Select...'}
				disabled={local.disabled}
				closeOnSelection={false}
				onOpenChange={handleOpenChange}
				itemComponent={(itemProps) => (
					<KobalteSelect.Item
						item={itemProps.item}
						class="relative flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer outline-none text-ink-900 dark:text-ink-100 data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-900 dark:data-[highlighted]:bg-primary-500/20 dark:data-[highlighted]:text-primary-200 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
					>
						<KobalteSelect.ItemLabel class="flex-1">
							<span class="flex items-center gap-2">
								<Show when={itemProps.item.rawValue.icon}>
									<span class="flex-shrink-0 text-ink-500">{itemProps.item.rawValue.icon}</span>
								</Show>
								<span class="truncate">{itemProps.item.rawValue.label}</span>
							</span>
						</KobalteSelect.ItemLabel>
						<KobalteSelect.ItemIndicator class="inline-flex items-center">
							<Check class="w-4 h-4 text-primary-500" />
						</KobalteSelect.ItemIndicator>
					</KobalteSelect.Item>
				)}
			>
				<Show when={!local.bare && local.label}>
					<div class="flex items-center justify-between mb-2">
						<KobalteSelect.Label class="block text-md font-medium text-ink-700 dark:text-ink-300">
							{local.label}
							<Show when={local.required}>
								<span class="text-danger-500 ml-0.5" aria-hidden="true">*</span>
							</Show>
						</KobalteSelect.Label>
						<Show when={local.label && !local.required && local.optional}>
							<span class="text-xs text-ink-500 dark:text-ink-400">optional</span>
						</Show>
					</div>
				</Show>

				<div
					class={cn(
						'w-full flex flex-col min-h-0 rounded-lg border transition-all overflow-hidden',
						local.compact ? 'min-h-[36px]' : 'min-h-[40px]',
						local.value.length === 0 && (local.compact ? 'h-[36px]' : 'h-[40px]'),
						local.error ? 'border-danger-500' : 'border-ink-300 dark:border-ink-800',
						'bg-surface-raised',
					)}
				>
						<KobalteSelect.Trigger
						as="button"
						type="button"
						aria-invalid={local.error ? 'true' : undefined}
						aria-describedby={describedBy()}
						aria-errormessage={local.error ? errorId() : undefined}
						class={cn(
							'w-full h-full min-h-0 min-w-0 flex items-center gap-2 rounded-lg transition-all outline-none bg-transparent text-ink-900 dark:text-ink-100 text-left border-0 py-2 cursor-pointer',
							local.compact ? 'px-3 text-sm' : 'px-4 text-base',
							'hover:bg-ink-50 dark:hover:bg-ink-800/50',
							'data-[expanded]:ring-2 data-[expanded]:ring-inset data-[expanded]:ring-primary-500',
							'data-[expanded]:hover:bg-transparent dark:data-[expanded]:hover:bg-transparent',
							local.error
								? 'focus:ring-2 focus:ring-inset focus:ring-danger-500 focus:border-transparent'
								: 'focus:ring-2 focus:ring-inset focus:ring-primary-500 focus:border-transparent',
							'data-[disabled]:bg-ink-50 dark:data-[disabled]:bg-ink-900 data-[disabled]:text-ink-500 dark:data-[disabled]:text-ink-500 data-[disabled]:cursor-not-allowed',
							'data-[placeholder-shown]:text-ink-400 dark:data-[placeholder-shown]:text-ink-500',
						)}
					>
						<KobalteSelect.Value<MultiSelectOption> class="min-w-0 flex-1 flex flex-wrap items-center gap-2 basis-0">
							{(state) => {
								const selected = state.selectedOptions()
								if (selected.length === 0) {
									return (
										<span class="text-ink-400 dark:text-ink-500">
											{local.placeholder ?? 'Select...'}
										</span>
									)
								}
								return (
									<ChipsList
										selectedOptions={selected}
										onRemove={(opt) => state.remove(opt)}
										reorderable={local.reorderable ?? false}
										onReorder={(newOrder) => local.onChange(newOrder)}
									/>
								)
							}}
						</KobalteSelect.Value>
						<KobalteSelect.Icon class="inline-flex shrink-0 w-4 items-center justify-center text-ink-400 dark:text-ink-500 transition-transform data-[expanded]:rotate-180">
							<ChevronDown class="h-3.5 w-3.5" aria-hidden="true" />
						</KobalteSelect.Icon>
					</KobalteSelect.Trigger>
				</div>

				<Show when={!local.bare && !local.error && helperOrDescription()}>
					<KobalteSelect.Description id={helperId()} class="mt-2 text-sm text-ink-500 dark:text-ink-400">
						{helperOrDescription()}
					</KobalteSelect.Description>
				</Show>

				<Show when={!local.bare && local.error}>
					<p id={errorId()} class="mt-2 text-sm text-danger-600">{local.error}</p>
				</Show>

				<KobalteSelect.Portal>
					<KobalteSelect.Content
						class={cn(
							'bg-surface-raised rounded-lg border border-surface-border shadow-lg mt-2 z-[100] flex flex-col max-h-60',
							local.searchable ? 'py-0 overflow-hidden' : 'py-1 overflow-auto',
						)}
					>
						<Show when={local.searchable}>
							<div
								class="shrink-0 border-b border-surface-border p-2"
								onKeyDown={(e) => e.stopPropagation()}
								onPointerDown={(e) => e.stopPropagation()}
								onMouseDown={(e) => e.stopPropagation()}
							>
								<input
									ref={(el) => (searchInputRef = el)}
									type="text"
									value={searchQuery()}
									onInput={(e) => setSearchQuery(e.currentTarget.value)}
									placeholder="Search..."
									class="h-9 w-full rounded-md border border-surface-border bg-surface-raised px-3 py-1.5 text-sm text-ink-900 dark:text-ink-100 placeholder:text-ink-400 dark:placeholder:text-ink-500 outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
								/>
							</div>
						</Show>
						<div class={cn('outline-none min-h-0', local.searchable && 'flex-1 overflow-auto py-1')}>
							<KobalteSelect.Listbox class="outline-none" />
						</div>
					</KobalteSelect.Content>
				</KobalteSelect.Portal>
			</KobalteSelect>
		</div>
	)
}
