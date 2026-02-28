import { type JSX, splitProps } from 'solid-js'
import { cn } from '../lib/cn'

export type LinkVariant = 'primary' | 'muted'

export interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
	/** Visual style. Default: "primary" */
	variant?: LinkVariant
	children?: JSX.Element
}

const linkVariants: Record<LinkVariant, string> = {
	primary:
		'text-primary-500 font-medium hover:text-primary-600 hover:underline hover:underline-offset-4 focus-visible:ring-primary-500/50 dark:text-primary-400 dark:hover:text-primary-300',
	muted:
		'text-ink-500 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-300 hover:underline hover:underline-offset-4 focus-visible:ring-ink-300/50 dark:focus-visible:ring-ink-500/50',
}

/** Styled anchor link with primary and muted variants. */
export function Link(props: LinkProps) {
	const [local, others] = splitProps(props, ['variant', 'class', 'children'])

	const variant = () => local.variant ?? 'primary'

	return (
		<a
			class={cn(
				'inline outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-base rounded',
				linkVariants[variant()],
				local.class
			)}
			{...others}
		>
			{local.children}
		</a>
	)
}
