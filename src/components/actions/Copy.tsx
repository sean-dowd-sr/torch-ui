import { type JSX, splitProps } from 'solid-js'
import { Copy as CopyIcon, Check } from 'lucide-solid'
import { Button } from './Button'
import type { ButtonVariant, ButtonSize } from './Button'
import { useCopyToClipboard } from './useCopyToClipboard'
import { cn } from '../../utilities/classNames'

export type CopyDisplay = 'text' | 'icon-and-text' | 'icon-only'

const filledVariants: ButtonVariant[] = ['primary', 'danger', 'success', 'warning']
const borderlessVariants: ButtonVariant[] = ['ghost', 'link', 'danger-link']

export interface CopyProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'href' | 'target' | 'rel'> {
	/** Text to copy to clipboard. */
	text: string
	/** How to show the button: "Copy" only, icon + "Copy", or icon only. */
	display?: CopyDisplay
	/** Label when not copied. Default: "Copy" */
	label?: string
	/** Label after copy. Default: "Copied" */
	copiedLabel?: string
	/** Button visual variant. Default: outlined */
	variant?: ButtonVariant
	size?: ButtonSize
	class?: string
	/** Called after successful copy. */
	onCopied?: () => void
}

/**
 * Button that copies the given text to the clipboard and shows visual feedback when copied.
 * Use display="text" | "icon-and-text" | "icon-only" for word only, icon + word, or icon only.
 */
export function Copy(props: CopyProps) {
	const [copy, copied] = useCopyToClipboard()
	const [local, rest] = splitProps(props, [
		'text',
		'display',
		'label',
		'copiedLabel',
		'variant',
		'size',
		'class',
		'onCopied',
	])
	const [, others] = splitProps(rest, ['onChange'])

	async function handleClick() {
		const ok = await copy(local.text)
		if (ok) local.onCopied?.()
	}

	const display = () => local.display ?? 'icon-and-text'
	const label = () => {
		const v = (local.label ?? 'Copy').trim()
		return v || 'Copy'
	}
	const copiedLabel = () => {
		const v = (local.copiedLabel ?? 'Copied').trim()
		return v || 'Copied'
	}
	const isIconOnly = () => display() === 'icon-only'
	const showIcon = () => display() === 'icon-and-text' || display() === 'icon-only'

	const checkIcon = () => (
		<Check class="h-4 w-4 shrink-0" aria-hidden />
	)
	const copyIcon = () => <CopyIcon class="h-4 w-4 shrink-0" aria-hidden />
	const currentVariant = () => local.variant ?? 'outlined'
	const resolvedVariant = (): ButtonVariant =>
		copied()
			? filledVariants.includes(currentVariant())
				? 'success'
				: 'success-outline'
			: currentVariant()
	/** When copied, ghost/link stay borderless (success-outline has a border; we remove it). */
	const copiedClass = () =>
		copied() && borderlessVariants.includes(currentVariant())
			? '!border-0'
			: ''

	return (
		<Button
			type="button"
			variant={resolvedVariant()}
			size={local.size ?? 'sm'}
			iconOnly={isIconOnly()}
			icon={isIconOnly() ? (copied() ? checkIcon() : copyIcon()) : undefined}
			startIcon={!isIconOnly() && showIcon() ? (copied() ? checkIcon() : copyIcon()) : undefined}
			label={copied() ? copiedLabel() : label()}
			class={cn('shrink-0', copiedClass(), local.class)}
			title={isIconOnly() ? (copied() ? copiedLabel() : label()) : undefined}
			aria-label={isIconOnly() ? (copied() ? copiedLabel() : label()) : undefined}
			onClick={handleClick}
			{...(others as Partial<import('./Button').ButtonProps>)}
		/>
	)
}
