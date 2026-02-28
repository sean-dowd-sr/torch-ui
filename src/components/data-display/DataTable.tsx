import { type JSX, Show, For, createMemo, splitProps } from 'solid-js'
import { Plus } from 'lucide-solid'
import { Button } from '../actions'
import { Input } from '../forms'
import { Dialog, AlertDialog } from '../layout'
import { EmptyState } from './EmptyState'
import { cn } from '../lib/cn'
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from './Table'
import { Pagination } from '../navigation/Pagination'
import type { PaginationProps } from '../navigation/Pagination'

/** Shared table container styling: white background, border, rounded. Use with overflow-x-auto or overflow-hidden. */
export const TABLE_CONTAINER_CLASS =
	'rounded-xl border border-surface-border bg-surface-raised'

export interface DataTableSearchProps {
	value: string
	onChange: (value: string) => void
	placeholder: string
}

export interface DataTableButtonProps {
	label: string
	onClick: () => void
	startIcon?: JSX.Element
}

export interface DataTableAddRowProps {
	showAddForm: boolean
	onToggleAddForm: () => void
	addButtonLabel: string
	renderAddCells: () => JSX.Element
	addError?: string
}

export interface DataTableEditModalProps {
	open: boolean
	title: string
	onClose: () => void
	children: JSX.Element
	editError?: string
	onSave: () => void
	saving?: boolean
}

export interface DataTableDeleteDialogProps {
	open: boolean
	title: string
	description: string
	onClose: () => void
	onConfirm: () => void
}

export interface ColumnDef<T> {
	id: string
	/** Column header label or JSX. */
	header: JSX.Element | string
	/** Class applied to the <TableHead>. */
	headClass?: string
	/** Class applied to each <TableCell> in this column (data rows and skeleton). */
	cellClass?: string
	/** Return cell content; DataTable wraps it in <TableCell class={cellClass}>. */
	cell: (item: T) => JSX.Element | string | number | null
	/** Custom skeleton element for loading state. Defaults to a pulse bar. */
	skeleton?: JSX.Element
}

export interface DataTableGroupByProps<T> {
	/** Return group key for each item; null = uncategorized. When set, rows are rendered in groups with a header row per group. */
	groupBy: (item: T) => string | null
	/** Render the group header row (one cell with colSpan). Required when groupBy is set. */
	renderGroupHeader: (groupKey: string | null) => JSX.Element
	/** Sort group keys: null (uncategorized) first, then others by key. Override for custom order. */
	groupOrder?: (a: string | null, b: string | null) => number
}

export type DataTablePagination = Pick<
	PaginationProps,
	'totalItems' | 'page' | 'totalPages' | 'pageSize' | 'onPageChange' | 'onPageSizeChange' | 'pageSizeOptions' | 'maxPages' | 'showFirstLast'
>

export type DataTablePagingProps =
	| { pagination: DataTablePagination; loadMore?: never }
	| { loadMore: { hasMore: boolean; onLoadMore: () => void; loading?: boolean }; pagination?: never }
	| { pagination?: undefined; loadMore?: undefined }

export type DataTableProps<T> = JSX.HTMLAttributes<HTMLDivElement> & DataTablePagingProps & {
	description?: JSX.Element
	search?: DataTableSearchProps
	toolbarContent?: JSX.Element
	toolbarActions?: JSX.Element
	primaryButton?: DataTableButtonProps
	secondaryButton?: DataTableButtonProps
	addRow?: DataTableAddRowProps
	editModal?: DataTableEditModalProps
	deleteDialog?: DataTableDeleteDialogProps
	groupBy?: DataTableGroupByProps<T>
	/** When true, the table header row is not rendered. */
	hideHeader?: boolean
	emptyState?: {
		title: string
		description?: string
		icon?: JSX.Element
		actions?: JSX.Element
	}
	loading?: boolean
	error?: Error | unknown
	items: T[]
	/** Column definitions. Drives header, body cells, skeleton, and colSpan automatically. */
	columns: ColumnDef<T>[]
	/** Escape hatch: return a complete <TableRow> to override, or null/undefined for column-based default. Returning anything else (fragment, bare text, false) produces invalid table markup. */
	renderRowOverride?: (item: T) => JSX.Element | null | undefined
	emptyMessage: string
	/** Number of skeleton rows to show while loading. Default: 5. */
	skeletonRows?: number
}

/** Default group order: null (uncategorized) first, then keys by localeCompare. */
function defaultGroupOrder(a: string | null, b: string | null): number {
	if (a === b) return 0
	if (a == null) return -1
	if (b == null) return 1
	return a.localeCompare(b, undefined, { sensitivity: 'base' })
}

/**
 * Data table with optional toolbar, inline add row, edit modal, delete dialog, and row grouping.
 * Use groupBy to render rows in groups with a header row per group. All action buttons use type="button" so the table can be used inside a form without causing submit.
 */
export function DataTable<T>(props: DataTableProps<T>) {
	const [local, others] = splitProps(props, [
		'description', 'search', 'toolbarContent', 'toolbarActions',
		'primaryButton', 'secondaryButton', 'addRow', 'editModal',
		'deleteDialog', 'groupBy', 'pagination', 'hideHeader',
		'emptyState', 'loadMore', 'loading', 'error', 'items',
		'columns', 'renderRowOverride', 'emptyMessage',
		'skeletonRows', 'class',
	])

	if (import.meta.env.DEV && local.columns.length === 0) {
		console.warn('DataTable: columns must not be empty')
	}

	const colSpan = () => local.columns.length
	const skeletonRowCount = createMemo(() => Array.from({ length: local.skeletonRows ?? 5 }))
	const hasToolbar = () =>
		local.description != null ||
		local.search != null ||
		local.toolbarContent != null ||
		local.toolbarActions != null ||
		local.primaryButton != null ||
		local.secondaryButton != null ||
		local.addRow != null

	const groupedRows = createMemo((): { key: string | null; items: T[] }[] | null => {
		const g = local.groupBy
		if (!g) return null
		if (local.items.length === 0) return []
		const order = g.groupOrder ?? defaultGroupOrder
		const map = new Map<string | null, T[]>()
		for (const item of local.items) {
			const key = g.groupBy(item)
			const list = map.get(key)
			if (list) list.push(item)
			else map.set(key, [item])
		}
		const keys = [...map.keys()].sort(order)
		return keys.map((key) => ({ key, items: map.get(key)! }))
	})

	function renderEmptyRow() {
		return (
			<Show when={!local.addRow?.showAddForm}>
				<TableRow hover={false}>
					<TableCell colSpan={colSpan()} class="p-0 align-top">
						{local.emptyState ? (
							<EmptyState
								title={local.emptyState.title}
								description={local.emptyState.description}
								icon={local.emptyState.icon}
								actions={local.emptyState.actions}
							/>
						) : (
							<div class="py-8 text-center text-sm text-ink-500 dark:text-ink-400">
								{local.emptyMessage}
							</div>
						)}
					</TableCell>
				</TableRow>
			</Show>
		)
	}

	function renderItem(item: T) {
		const overridden = local.renderRowOverride?.(item)
		if (import.meta.env.DEV && overridden != null && (typeof overridden !== 'object' || Array.isArray(overridden))) {
			console.warn('DataTable: renderRowOverride must return a single <TableRow> element or null/undefined, not an array or fragment')
		}
		return overridden ?? (
			<TableRow>
				<For each={local.columns}>
					{(col) => <TableCell class={col.cellClass}>{col.cell(item)}</TableCell>}
				</For>
			</TableRow>
		)
	}

	function FlatRows() {
		return (
			<Show when={local.items.length > 0} fallback={renderEmptyRow()}>
				<For each={local.items}>{(item) => renderItem(item)}</For>
			</Show>
		)
	}

	return (
		<div {...others} class={cn('space-y-4', local.class)}>
			{local.description}
			<Show when={hasToolbar()}>
				<div class="flex flex-wrap items-center gap-2">
					<Show when={local.search}>
						{(search) => (
							<div class="min-w-[200px] flex-1">
								<Input
									bare
									compact
									value={search().value}
									onValueChange={search().onChange}
									placeholder={search().placeholder}
									class="w-full"
									inputClass="rounded-lg"
								/>
							</div>
						)}
					</Show>
					<Show when={local.toolbarContent}>
						{local.toolbarContent}
					</Show>
					<Show when={local.toolbarActions}>
						<div class="flex items-center gap-2 shrink-0">
							{local.toolbarActions}
						</div>
					</Show>
					<Show when={local.addRow || local.primaryButton || local.secondaryButton}>
						<div class="ml-auto flex items-center gap-2 shrink-0">
							<Show when={local.addRow}>
								{(addRow) => (
									<Button
										type="button"
										variant="primary"
										size="sm"
										class="shrink-0 rounded-lg"
										label={addRow().addButtonLabel}
										startIcon={<Plus size={16} />}
										onClick={() => addRow().onToggleAddForm()}
									/>
								)}
							</Show>
							<Show when={!local.addRow && local.primaryButton}>
								{(btn) => (
									<Button
										type="button"
										variant="primary"
										size="sm"
										class="shrink-0 rounded-lg"
										label={btn().label}
										startIcon={btn().startIcon}
										onClick={() => btn().onClick()}
									/>
								)}
							</Show>
							<Show when={local.secondaryButton}>
								{(btn) => (
									<Button
										type="button"
										variant="outlined"
										size="sm"
										class="shrink-0 rounded-lg"
										label={btn().label}
										startIcon={btn().startIcon}
										onClick={() => btn().onClick()}
									/>
								)}
							</Show>
						</div>
					</Show>
				</div>
			</Show>

			<Show when={local.error}>
				<p class="text-sm text-red-600 dark:text-red-400">
					{local.error instanceof Error ? local.error.message : 'Failed to load'}
				</p>
			</Show>
			<Show when={local.loading}>
				<div role="status" aria-live="polite" class="sr-only">Loading</div>
			</Show>
			<div class={cn('overflow-x-auto', TABLE_CONTAINER_CLASS)}>
				<Table class="min-w-full">
					<Show when={!local.hideHeader}>
						<TableHeader>
							<TableRow>
								<For each={local.columns}>
									{(col) => (
									<TableHead class={col.headClass}>
										{typeof col.header === 'string' ? col.header : col.header}
									</TableHead>
								)}
								</For>
							</TableRow>
						</TableHeader>
					</Show>
					<TableBody aria-busy={local.loading ? true : undefined}>
						<Show
							when={!local.loading}
							fallback={
								<For each={skeletonRowCount()}>
									{() => (
										<TableRow hover={false}>
											<For each={local.columns}>
												{(col) => (
													<TableCell class={cn('py-3', col.cellClass)}>
														{col.skeleton ?? (
															<div class="h-4 w-full max-w-48 animate-pulse rounded bg-ink-200 dark:bg-ink-700" />
														)}
													</TableCell>
												)}
											</For>
										</TableRow>
									)}
								</For>
							}
						>
							<Show when={local.addRow?.showAddForm}>
								<TableRow class="bg-primary-50/50 dark:bg-primary-950/20" hover={false}>
									{local.addRow!.renderAddCells()}
								</TableRow>
							</Show>
							<Show when={groupedRows()} fallback={<FlatRows />}>
								{(groups) => (
									<Show when={groups().length > 0} fallback={renderEmptyRow()}>
										<For each={groups()}>
										{({ key, items: groupItems }) => [
											<TableRow class="bg-ink-50 dark:bg-ink-800/50 font-medium text-ink-700 dark:text-ink-300" hover={false}>
												<TableCell colSpan={colSpan()} class="py-2 pl-4 text-sm font-medium" role="rowheader">
													{local.groupBy!.renderGroupHeader(key)}
												</TableCell>
											</TableRow>,
											...groupItems.map((item) => renderItem(item)),
										]}
									</For>
									</Show>
								)}
							</Show>
							<Show when={local.addRow?.addError && local.addRow?.showAddForm}>
								<TableRow hover={false}>
									<TableCell colSpan={colSpan()} class="bg-red-50/80 dark:bg-red-950/30 text-sm text-red-600 dark:text-red-400">
										{local.addRow!.addError}
									</TableCell>
								</TableRow>
							</Show>
						</Show>
					</TableBody>
				</Table>
				<Show when={local.loadMore?.hasMore}>
					<div class="flex justify-center border-t border-surface-border bg-surface-raised px-6 py-4">
						<Button
							type="button"
							variant="outlined"
							size="sm"
							class="rounded-lg"
							label="Load more"
							loading={local.loadMore!.loading}
							onClick={() => local.loadMore!.onLoadMore()}
						/>
					</div>
				</Show>
				<Show when={local.pagination}>
					{(pagination) => (
						<Pagination
							{...pagination()}
							class="border-t border-surface-border bg-surface-raised px-6 py-3"
						/>
					)}
				</Show>
			</div>

			<Show when={local.editModal}>
				{(modal) => (
					<Dialog
						open={modal().open}
						onClose={modal().onClose}
						size="md"
						header={<h3 class="text-lg font-semibold text-ink-900 dark:text-ink-100">{modal().title}</h3>}
						footer={
							<div class="flex justify-end gap-2">
								<Button type="button" variant="link" size="sm" onClick={modal().onClose} class="rounded-lg">
									Cancel
								</Button>
								<Button
									type="button"
									variant="primary"
									size="sm"
									onClick={modal().onSave}
									loading={modal().saving}
									class="rounded-lg"
								>
									Save
								</Button>
							</div>
						}
					>
						<div class="space-y-4">{modal().children}</div>
						<Show when={modal().editError}>
							<p class="mt-3 text-sm text-red-600 dark:text-red-400">{modal().editError}</p>
						</Show>
					</Dialog>
				)}
			</Show>

			<Show when={local.deleteDialog}>
				{(dialog) => (
					<AlertDialog
						open={dialog().open}
						onOpenChange={(open) => !open && dialog().onClose()}
						title={dialog().title}
						description={dialog().description}
						confirmLabel="Delete"
						destructive
						onConfirm={dialog().onConfirm}
					/>
				)}
			</Show>
		</div>
	)
}
