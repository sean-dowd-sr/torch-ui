import type { JSX } from 'solid-js'
import { createContext, createEffect, createSignal, on, onMount, Show, useContext } from 'solid-js'
import { Plus } from 'lucide-solid'
import { ViewCustomizer } from '../../forms'
import { FilterBuilder } from '../../forms/FilterBuilder'
import {
	formatFilterSummary,
	formatFilterCode,
	assignRuleNumbers,
	hasRulesWithEmptyField,
	type FilterGroup,
} from '../../lib/filter-types'
import { Drawer } from '../../overlays/Drawer'
import { ViewSwitcher } from '../../navigation/ViewSwitcher'
import type { TableViewConfig, TableViewsApi, ViewConfig } from './types'

const createFilterId = (prefix: string) =>
	`${prefix}-${Math.random().toString(36).slice(2, 9)}`

export const emptyFilterGroup = (): FilterGroup => ({
	id: createFilterId('group'),
	type: 'and',
	logic: 'and',
	children: [],
})

function getDefaultViewId(views: ViewConfig[], systemDefaultId: string): string {
	const pinned = views.find((v) => v.pinned)
	return pinned?.id ?? systemDefaultId
}


export interface TableViewContextValue {
	views: () => ViewConfig[]
	activeView: () => string
	setActiveView: (id: string) => void
	activeViewConfig: () => ViewConfig | undefined
	/** False when viewing the system default view (e.g. All contacts) - use to disable Customize button */
	canCustomize: () => boolean
	openCustomize: () => void
	openFilters: () => void
	openCustomizeForEdit: () => void
	openCustomizeForCreate: () => void
	/** Compact single-line summary of active filters (e.g. "Status is any of Active, Inactive") */
	activeFilterSummary: () => string
	/** Current filter group - use to filter displayed data */
	activeFilterGroup: () => FilterGroup
	/** Report filtered row count for badge display. Call from table/content when filters are applied. */
	setFilteredRowCount: (count: number | null) => void
}

const TableViewContext = createContext<TableViewContextValue>()

export function useTableView() {
	const ctx = useContext(TableViewContext)
	if (!ctx) {
		throw new Error('useTableView must be used within TableView')
	}
	return ctx
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
function isDbViewId(id: string) {
	return UUID_REGEX.test(id)
}

export interface TableViewProps {
	config: TableViewConfig
	/** When provided, views are fetched from and saved to the API. Requires config.entityType. */
	viewsApi?: TableViewsApi
	/** Toolbar content. Receives API with openCustomizeForEdit, openFilters, etc. */
	toolbar?: (api: TableViewContextValue) => JSX.Element
	/** Main table/content area */
	children: JSX.Element
	class?: string
}

export function TableView(props: TableViewProps) {
	const config = () => props.config
	const [showCustomize, setShowCustomize] = createSignal(false)
	const [customizeMode, setCustomizeMode] = createSignal<'edit' | 'create'>('edit')
	const [showFilters, setShowFilters] = createSignal(false)
	const [views, setViews] = createSignal(config().defaultViews)
	const [activeView, setActiveView] = createSignal(
		getDefaultViewId(config().defaultViews, config().systemDefaultViewId),
	)
	const [saveError, setSaveError] = createSignal<string | null>(null)
	const [filterSaveError, setFilterSaveError] = createSignal<string | null>(null)

	onMount(() => {
		const api = props.viewsApi
		const entityType = config().entityType
		if (!api || !entityType) return
		api.fetchViews(entityType).then(
			(fetched: ViewConfig[]) => {
				const systemIds = new Set(config().defaultViews.map((v) => v.id))
				const merged = [
					...config().defaultViews,
					...fetched.filter((v: ViewConfig) => !systemIds.has(v.id)),
				]
				setViews(merged)
				setActiveView(getDefaultViewId(merged, config().systemDefaultViewId))
			},
			(err: unknown) => {
				console.error('[TableView] Failed to fetch views:', err)
			},
		)
	})
	const [viewName, setViewName] = createSignal('')
	const [usedFields, setUsedFields] = createSignal([...config().initialFields])
	const [groupBy, setGroupBy] = createSignal('none')
	const [filterGroup, setFilterGroup] = createSignal<FilterGroup>(emptyFilterGroup())
	const [filteredRowCount, setFilteredRowCount] = createSignal<number | null>(null)
	const [scope, setScope] = createSignal<'user' | 'tenant'>('user')
	const [pinned, setPinned] = createSignal(false)

	const createViewId = (name: string) => {
		const base = name.toLowerCase().replace(/\s+/g, '-')
		let candidate = base
		let counter = 2
		while (views().some((view) => view.id === candidate)) {
			candidate = `${base}-${counter}`
			counter += 1
		}
		return candidate
	}

	const updateView = async () => {
		const name = viewName().trim()
		if (!name) return
		const entityType = config().entityType
		const api = props.viewsApi
		const viewId = activeView()

		if (api && entityType && isDbViewId(viewId)) {
			setSaveError(null)
			try {
				await api.updateView(entityType, {
					id: viewId,
					label: name,
					fields: [...usedFields()],
					groupBy: groupBy(),
					filters: { ...filterGroup() },
					scope: scope(),
					pinned: pinned(),
				})
			} catch (err) {
				setSaveError(err instanceof Error ? err.message : 'Failed to save view')
				return
			}
		}

		setViews((current) =>
			current.map((view) =>
				view.id === viewId
					? {
							...view,
							label: name,
							fields: [...usedFields()],
							groupBy: groupBy(),
							filters: { ...filterGroup() },
							scope: scope(),
							pinned: pinned(),
						}
					: view,
			),
		)
		setShowCustomize(false)
	}

	const saveViewAsNew = async () => {
		const name = viewName().trim()
		if (!name) return
		const entityType = config().entityType
		const api = props.viewsApi

		if (api && entityType) {
			setSaveError(null)
			try {
				const created = await api.createView(entityType, {
					label: name,
					fields: [...usedFields()],
					groupBy: groupBy(),
					filters: { ...filterGroup() },
					scope: scope(),
					pinned: pinned(),
				})
				setViews((current) => [...current, created])
				setActiveView(created.id)
				setShowCustomize(false)
				return
			} catch (err) {
				setSaveError(err instanceof Error ? err.message : 'Failed to create view')
				return
			}
		}

		const id = createViewId(name)
		setViews((current) => [
			...current,
			{
				id,
				label: name,
				fields: [...usedFields()],
				groupBy: groupBy(),
				filters: { ...filterGroup() },
				scope: scope(),
				pinned: pinned(),
			},
		])
		setActiveView(id)
		setShowCustomize(false)
	}

	const openCustomizeForEdit = () => {
		if (activeView() === config().systemDefaultViewId) return
		setCustomizeMode('edit')
		setShowCustomize(true)
	}

	const openCustomizeForCreate = () => {
		setCustomizeMode('create')
		setViewName('New view')
		setUsedFields([...config().initialFields])
		setGroupBy('none')
		// Keep current filters so user can create a view from their filtered results (e.g. "Active contacts SMS")
		// Use deep copy to avoid state mutation bugs
		setFilterGroup(JSON.parse(JSON.stringify(filterGroup())))
		setScope('user')
		setPinned(false)
		setShowCustomize(true)
	}

	const closeCustomize = () => {
		setSaveError(null)
		setShowCustomize(false)
	}

	/** Save editingFilterGroup to filterGroup and active view */
	const saveFiltersToView = async (): Promise<boolean> => {
		const group = editingFilterGroup()
		if (!group) return true

		const viewId = activeView()
		const current = views().find((v) => v.id === viewId)
		if (!current) return true

		const filtersCopy = JSON.parse(JSON.stringify(group))
		const originalFilters = current.filters // Store original for revert

		// Update local views first for optimistic UI
		setViews((prev) =>
			prev.map((v) => (v.id === viewId ? { ...v, filters: filtersCopy } : v))
		)

		// Only commit to live filterGroup after successful API save
		const api = props.viewsApi
		const entityType = config().entityType
		if (api && entityType && isDbViewId(viewId)) {
			setFilterSaveError(null)
			try {
				await api.updateView(entityType, {
					...current,
					filters: filtersCopy,
				})
				// Success: now commit to live filterGroup
				setFilterGroup(filtersCopy)
			} catch (err) {
				// Failure: revert views to original filters and show error
				setViews((prev) =>
					prev.map((v) => (v.id === viewId ? { ...v, filters: originalFilters } : v))
				)
				setFilterSaveError(err instanceof Error ? err.message : 'Failed to save filters')
				return false
			}
		} else {
			// Non-db view: commit immediately
			setFilterGroup(filtersCopy)
		}

		return true
	}

	const saveFilters = async () => {
		const group = editingFilterGroup()
		if (!group) return
		if (hasRulesWithEmptyField(group)) {
			setFilterSaveError('Please select a field for each condition.')
			return
		}
		const ok = await saveFiltersToView()
		if (ok) {
			setFilterSaveError(null)
			setEditingFilterGroup(null)
			setShowFilters(false)
		}
	}

	/** Local editing state for filter drawer - isolated from filterGroup to avoid sync/reactivity issues */
	const [editingFilterGroup, setEditingFilterGroup] = createSignal<FilterGroup | null>(null)

	const cancelFilters = () => {
		setEditingFilterGroup(null)
		setFilterSaveError(null)
		setTimeout(() => setShowFilters(false), 0)
	}

	// Initialize local editing state ONLY when drawer opens; never overwrite during editing
	createEffect(
		on(showFilters, (open) => {
			if (open) {
				setEditingFilterGroup(JSON.parse(JSON.stringify(filterGroup())))
			} else {
				setEditingFilterGroup(null)
			}
		}),
	)

	const deleteView = async () => {
		const current = views().find((v) => v.id === activeView())
		if (!current || current.scope !== 'user') return
		const entityType = config().entityType
		const api = props.viewsApi

		if (api && entityType && isDbViewId(current.id)) {
			setSaveError(null)
			try {
				await api.deleteView(entityType, current.id)
			} catch (err) {
				setSaveError(err instanceof Error ? err.message : 'Failed to delete view')
				return
			}
		}

		const remaining = views().filter((v) => v.id !== current.id)
		setViews(remaining)
		setActiveView(getDefaultViewId(remaining, config().systemDefaultViewId))
		setShowCustomize(false)
	}

	// Sync filterGroup when active view changes (so Filter drawer shows correct filters)
	createEffect(() => {
		if (showFilters()) return // Don't overwrite while user is editing in the filter drawer
		const viewId = activeView()
		const current = views().find((view) => view.id === viewId)
		if (!current) return
		setFilterGroup(JSON.parse(JSON.stringify(current.filters)))
	})


	// Load view data into Customize form when opening for edit
	createEffect(() => {
		if (!showCustomize() || customizeMode() !== 'edit') return
		const current = views().find((view) => view.id === activeView())
		if (!current) return
		setViewName(current.label)
		setUsedFields([...current.fields])
		setGroupBy(current.groupBy)
		setScope(current.scope)
		setPinned(current.pinned ?? false)
		setFilterGroup(JSON.parse(JSON.stringify(current.filters)))
	})

	const activeViewConfig = () => views().find((v) => v.id === activeView())
	const canCustomize = () => activeView() !== config().systemDefaultViewId

	const activeFilterSummary = () => {
		const group = filterGroup()
		if (!group.children.length) return ''
		return formatFilterSummary(group, {
			fields: config().filterFields,
			getOperators: config().getOperatorsForType,
		})
	}

	const contextValue: TableViewContextValue = {
		views,
		activeView,
		setActiveView,
		activeViewConfig,
		canCustomize,
		openCustomize: openCustomizeForEdit,
		openFilters: () => setShowFilters(true),
		openCustomizeForEdit,
		openCustomizeForCreate,
		activeFilterSummary,
		activeFilterGroup: filterGroup,
		setFilteredRowCount,
	}

	const sortedViews = () =>
		[...views()].sort((a, b) => {
			if (a.pinned && !b.pinned) return -1
			if (!a.pinned && b.pinned) return 1
			return 0
		})

	return (
		<TableViewContext.Provider value={contextValue}>
			<div class={props.class}>
				<div class="min-w-0 w-full bg-ink-100/60">
					<ViewSwitcher
						views={sortedViews().map((view) => ({
							id: view.id,
							label: view.label,
							count:
								config().getFilteredCountForView?.(view) ??
								(activeView() === view.id ? filteredRowCount() : null) ??
								config().rowCount ??
								0,
							scope: view.scope,
							pinned: view.pinned,
						}))}
						activeId={activeView()}
						onChange={setActiveView}
						variant="embedded"
						class="w-full"
						addIcon={<Plus size={20} strokeWidth={2} />}
						onAdd={openCustomizeForCreate}
					/>
				</div>
				{props.toolbar && (
					<div class="border-b border-surface-border bg-surface-raised px-4 py-4">
						{props.toolbar(contextValue)}
					</div>
				)}
				<div class={config().rowCount === 0 ? 'p-10' : 'p-0'}>{props.children}</div>
			</div>

			<Drawer open={showCustomize()} onClose={closeCustomize} size="xl">
				<ViewCustomizer
					fields={config().allFields}
					value={usedFields()}
					onChange={setUsedFields}
					allFields={config().allFields}
					viewName={viewName()}
					onViewNameChange={setViewName}
					usedFields={usedFields()}
					onUsedFieldsChange={setUsedFields}
					groupBy={groupBy()}
					onGroupByChange={setGroupBy}
					mode={customizeMode()}
					editingViewLabel={activeViewConfig()?.label}
					onSaveChanges={updateView}
					onSaveAsNew={saveViewAsNew}
					saveError={saveError()}
					onCancel={closeCustomize}
					onClose={closeCustomize}
					canDelete={activeViewConfig()?.scope === 'user'}
					onDelete={deleteView}
					scope={scope()}
					onScopeChange={setScope}
					canSetGlobalScope={true}
					pinned={pinned()}
					onPinnedChange={setPinned}
					title={config().customizeTitle ?? 'Customize table'}
					description={config().customizeDescription ?? 'Manage fields, grouping, and saved views.'}
				/>
			</Drawer>

			<Drawer
				open={showFilters()}
				onClose={cancelFilters}
				onCancel={cancelFilters}
				onSave={saveFilters}
				size="2xl"
			>
				<div>
					<h2 class="text-lg font-semibold text-ink-900">
						{config().filterTitle ?? 'Filter'}
					</h2>
					<div class="mt-2 text-sm text-ink-500">
						{config().filterDescription ?? 'Build filter rules with And/Or logic.'}
					</div>
				</div>
				<Show when={filterSaveError()}>
					<div role="alert" class="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
						{filterSaveError()}
					</div>
				</Show>
				<div class="mt-6 flex-1 overflow-y-auto overflow-x-visible min-h-0">
					<Show when={editingFilterGroup()}>
						<FilterBuilder
							value={() => editingFilterGroup()!}
							onChange={(g: any) => setEditingFilterGroup(g)}
							fields={config().filterFields}
							getOperators={config().getOperatorsForType}
						/>
					</Show>
				</div>
				<Show when={editingFilterGroup() && editingFilterGroup()!.children.length > 0}>
					<div class="mt-6 space-y-2 border-t border-ink-200 pt-4">
						<div class="text-sm font-medium text-ink-700">Filter logic</div>
						<code class="block rounded-md bg-ink-100 px-3 py-2 text-sm font-mono text-ink-800">
							{formatFilterCode(editingFilterGroup()!, assignRuleNumbers(editingFilterGroup()!))}
						</code>
						<div class="text-sm font-medium text-ink-700">Summary</div>
						<p class="text-sm text-ink-600">
							{formatFilterSummary(editingFilterGroup()!, {
								fields: config().filterFields,
								getOperators: config().getOperatorsForType,
							})}
						</p>
					</div>
				</Show>
			</Drawer>
		</TableViewContext.Provider>
	)
}
