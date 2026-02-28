import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { X } from 'lucide-solid'
import { Autocomplete } from './Autocomplete'
import { Select } from './Select'
import { cn } from '../../utilities/classNames'

export interface FilterRuleOption {
	value: string
	label: string
}

export interface FilterRuleRowProps extends JSX.HTMLAttributes<HTMLDivElement> {
	fieldValue: string
	fieldOptions: FilterRuleOption[]
	operatorValue: string
	operatorOptions: FilterRuleOption[]
	onFieldChange: (value: string) => void
	onOperatorChange: (value: string) => void
	onRemove: () => void
	children?: JSX.Element
}

export function FilterRuleRow(props: FilterRuleRowProps) {
	const [local, others] = splitProps(props, [
		'fieldValue',
		'fieldOptions',
		'operatorValue',
		'operatorOptions',
		'onFieldChange',
		'onOperatorChange',
		'onRemove',
		'class',
		'children',
	])

	return (
		<div
			class={cn('rounded-lg border border-surface-border bg-surface-raised p-4 space-y-3', local.class)}
			{...others}
		>
			<div class="grid gap-3 sm:grid-cols-[1.4fr_1fr_auto]">
				<Autocomplete
					label="Field"
					value={local.fieldValue}
					onValueChange={local.onFieldChange}
					options={local.fieldOptions}
					placeholder="Search fields..."
				/>
				<Select
					label="Operator"
					options={local.operatorOptions}
					value={local.operatorValue}
					onValueChange={local.onOperatorChange}
				/>
				<button
					type="button"
					class="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-ink-200 text-ink-500 hover:bg-ink-100"
					aria-label="Remove filter"
					onClick={local.onRemove}
				>
					<X class="h-4 w-4" />
				</button>
			</div>
			{local.children && <div>{local.children}</div>}
		</div>
	)
}
