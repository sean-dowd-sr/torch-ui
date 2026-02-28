import type { FilterGroup } from '../../lib/filter-types'
import type { ViewCustomizerField } from '../../forms/ViewCustomizer'
import type { FilterFieldConfig } from '../../forms/FilterBuilder/FilterGroupBlock'

export interface ViewConfig {
	id: string
	label: string
	fields: string[]
	groupBy: string
	filters: FilterGroup
	scope: 'user' | 'tenant'
	/** When true, this view is used as the default when opening. System default view is fallback when no view is pinned. */
	pinned?: boolean
}

/** API for persisting views. When provided, TableView fetches/saves views via these methods. */
export interface TableViewsApi {
	fetchViews: (entityType: string) => Promise<ViewConfig[]>
	createView: (entityType: string, view: Omit<ViewConfig, 'id'>) => Promise<ViewConfig>
	updateView: (entityType: string, view: ViewConfig) => Promise<void>
	deleteView: (entityType: string, viewId: string) => Promise<void>
}

export interface TableViewConfig {
	/** Entity type for API (e.g. 'contacts', 'jobs'). Required when viewsApi is provided. */
	entityType?: string
	/** Default/system views. Must include the system default view (e.g. id: 'all'). */
	defaultViews: ViewConfig[]
	/** ID of the system default view shown when no view is pinned (e.g. 'all') */
	systemDefaultViewId: string
	/** All fields available for columns (used in ViewCustomizer) */
	allFields: ViewCustomizerField[]
	/** Fields for the filter builder */
	filterFields: FilterFieldConfig[]
	/** Get operator options for a filter field type */
	getOperatorsForType: (type: string) => { value: string; label: string }[]
	/** Initial field IDs for new views */
	initialFields: string[]
	/** Row count for the count badge on tabs (fallback when getFilteredCountForView not provided) */
	rowCount?: number
	/** Return filtered row count for a specific view. When provided, each tab shows its own filtered count. */
	getFilteredCountForView?: (view: ViewConfig) => number
	/** Customize drawer title */
	customizeTitle?: string
	/** Customize drawer description */
	customizeDescription?: string
	/** Filter drawer title */
	filterTitle?: string
	/** Filter drawer description */
	filterDescription?: string
}
