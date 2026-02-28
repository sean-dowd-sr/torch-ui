import { type JSX, splitProps } from 'solid-js'
import * as PopoverPrimitive from '@kobalte/core/popover'
import { cn } from '../../utilities/classNames'

const SIDES = ['top', 'bottom', 'left', 'right'] as const
const ALIGNMENTS = ['start', 'center', 'end'] as const

export type PopoverSide = (typeof SIDES)[number]
export type PopoverAlign = (typeof ALIGNMENTS)[number]
type NonCenterAlign = Exclude<PopoverAlign, 'center'>
type DerivedPlacement = PopoverSide | `${PopoverSide}-${NonCenterAlign}`

// Valid placement combinations derived from SIDES and ALIGNMENTS
export type PopoverPlacement = DerivedPlacement

export interface PopoverRootProps extends Omit<PopoverPrimitive.PopoverRootProps, 'placement'> {
	/** Horizontal alignment relative to trigger. Use 'end' to right-align panel to trigger. Ignored if placement is set. */
	align?: PopoverAlign
	/** Side of the trigger the panel appears on. Ignored if placement is set. Default 'bottom'. */
	side?: PopoverSide
	/** Override placement. If not provided, derived from side + align. */
	placement?: PopoverPlacement
}

/** Root with align/side support; placement is derived as side + align (e.g. bottom-end). */
export function PopoverRoot(props: PopoverRootProps) {
	const [local, others] = splitProps(props, ['align', 'side', 'placement'])

	const side = () => local.side ?? 'bottom'
	const align = () => local.align ?? 'center'

	const placement = (): PopoverPlacement => {
		if (local.placement) return local.placement
		const s = side()
		const a = align()
		return a === 'center' ? s : `${s}-${a}`
	}

	return (
		<PopoverPrimitive.Root
			{...others}
			placement={placement()}
		/>
	)
}

export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverAnchor = PopoverPrimitive.Anchor
export const PopoverPortal = PopoverPrimitive.Portal
export const PopoverContentPrimitive = PopoverPrimitive.Content
export const PopoverCloseButton = PopoverPrimitive.CloseButton
export const PopoverTitle = PopoverPrimitive.Title
export const PopoverDescription = PopoverPrimitive.Description
export const PopoverArrow = PopoverPrimitive.Arrow

export interface PopoverContentProps extends PopoverPrimitive.PopoverContentProps {
	class?: string
	children?: JSX.Element
}

export function PopoverContent(props: PopoverContentProps) {
	const [local, others] = splitProps(props, ['class', 'children'])
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content
				class={cn(
					'z-50 min-w-[180px] rounded-lg border border-surface-border bg-surface-raised p-2 shadow-lg',
					local.class
				)}
				{...others}
			>
				{local.children}
			</PopoverPrimitive.Content>
		</PopoverPrimitive.Portal>
	)
}
