import { type JSX, splitProps, Show, createMemo } from 'solid-js'
import { cn } from '../lib/cn'

export type TagVariant =
	| 'neutral'
	| 'primary'
	| 'success'
	| 'warning'
	| 'danger'
	| 'info'

export type TagSize = 'sm' | 'md'

export interface TagProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'color'> {
	/** Semantic color variant. Ignored when color is set. Default: neutral. */
	variant?: TagVariant
	/** Tag size. Default: md. */
	size?: TagSize
	/** CSS color for a status indicator dot before children (e.g. "#22c55e"). */
	statusColor?: string
	/** Accessible label for the status dot (e.g. "Active"). Rendered as sr-only text. When omitted, the dot is purely decorative. */
	statusLabel?: string
	/** Arbitrary CSS color for a fully custom tag. Sets bg (10% opacity), border (25% opacity), and text color. Overrides variant. */
	color?: string
}

const tagVariants: Record<TagVariant, string> = {
	neutral:
		'bg-ink-100 text-ink-700 border-ink-200 dark:bg-ink-700 dark:text-ink-200 dark:border-ink-600',
	primary:
		'bg-primary-50 text-primary-700 border-primary-100 dark:bg-primary-500/20 dark:text-primary-200 dark:border-primary-500/40',
	success:
		'bg-green-50 text-green-700 border-green-100 dark:bg-green-500/20 dark:text-green-200 dark:border-green-500/40',
	warning:
		'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-500/40',
	danger:
		'bg-red-50 text-red-700 border-red-100 dark:bg-red-500/20 dark:text-red-200 dark:border-red-500/40',
	info:
		'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-500/20 dark:text-sky-200 dark:border-sky-500/40',
}

const tagSizes: Record<TagSize, string> = {
	sm: 'px-2 py-0.5 text-[11px]',
	md: 'px-2.5 py-0.5 text-xs',
}

export function Tag(props: TagProps) {
	const [local, others] = splitProps(props, ['variant', 'size', 'statusColor', 'statusLabel', 'color', 'class', 'style', 'children'])
	const variant = () => local.variant ?? 'neutral'
	const size = () => local.size ?? 'md'

	const customStyle = createMemo((): JSX.CSSProperties => {
		const c = local.color
		if (!c) return {}
		return {
			'background-color': `color-mix(in srgb, ${c} 10%, transparent)`,
			'border-color': `color-mix(in srgb, ${c} 25%, transparent)`,
			color: c,
		}
	})

	const mergedStyle = createMemo((): JSX.CSSProperties => {
		const base = customStyle()
		const s = local.style
		return typeof s === 'object' && s != null ? { ...base, ...s } as JSX.CSSProperties : base
	})

	return (
		<span
			class={cn(
				'inline-flex items-center gap-1 rounded-full border font-medium',
				!local.color && tagVariants[variant()],
				tagSizes[size()],
				local.class,
			)}
			style={mergedStyle()}
			{...others}
		>
			<Show when={local.statusColor}>
				<span
					class="size-2 shrink-0 rounded-full ring-1 ring-ink-200/80 dark:ring-ink-500/80"
					style={{ 'background-color': local.statusColor }}
					aria-hidden={local.statusLabel ? undefined : 'true'}
					role={local.statusLabel ? 'img' : undefined}
					aria-label={local.statusLabel}
				/>
			</Show>
			{local.children}
		</span>
	)
}
