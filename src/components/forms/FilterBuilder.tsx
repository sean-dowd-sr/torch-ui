import type { JSX } from 'solid-js'

export interface FilterBuilderProps {
	value: () => any
	onChange: (group: any) => void
	fields: any[]
	getOperators: (type: string) => any[]
}

export function FilterBuilder(props: FilterBuilderProps): JSX.Element {
	return (
		<div class="p-4 border rounded-md">
			<div class="text-sm text-gray-600">FilterBuilder placeholder</div>
		</div>
	)
}
