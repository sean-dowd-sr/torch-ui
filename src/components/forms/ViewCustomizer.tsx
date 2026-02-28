import type { JSX } from 'solid-js'

export interface ViewCustomizerField {
	id: string
	label: string
	type: string
}

export interface ViewCustomizerProps {
	allFields: ViewCustomizerField[]
	fields: ViewCustomizerField[]
	value: any[]
	onChange: (value: any[]) => void
	viewName: string
	onViewNameChange: (name: string) => void
	usedFields: string[]
	onUsedFieldsChange: (fields: string[]) => void
	groupBy: string
	onGroupByChange: (value: string) => void
	mode: string
	editingViewLabel?: string
	onSaveChanges: () => void
	onSaveAsNew: () => void
	saveError?: string | null
	onCancel: () => void
	onClose: () => void
	canDelete: boolean
	onDelete: () => void
	scope: string
	onScopeChange: (scope: string) => void
	canSetGlobalScope: boolean
	pinned: boolean
	onPinnedChange: (pinned: boolean) => void
	title: string
	description: string
}

export function ViewCustomizer(props: ViewCustomizerProps): JSX.Element {
	return (
		<div class="p-4 border rounded-md">
			<div class="text-sm text-gray-600">ViewCustomizer placeholder</div>
		</div>
	)
}
