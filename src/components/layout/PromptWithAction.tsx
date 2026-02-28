import type { JSX } from 'solid-js'
import { cn } from '../lib/cn'

export interface PromptWithActionProps {
	/** Leading text (e.g. "Don't have an account?") */
	prompt: string
	/** Link or button label (e.g. "Sign up") */
	actionLabel: string
	/** Optional class for the wrapper */
	class?: string
	/** Optional class for the action link/button (e.g. primary link styling) */
	actionClass?: string
}

export interface PromptWithActionLinkProps extends PromptWithActionProps {
	/** Render as link with href */
	href: string
	onClick?: never
}

export interface PromptWithActionButtonProps extends PromptWithActionProps {
	/** Render as button with click handler */
	onClick: () => void
	href?: never
}

export type PromptWithActionAllProps = PromptWithActionLinkProps | PromptWithActionButtonProps

const defaultActionClass =
	'cursor-pointer font-medium text-primary-500 hover:underline focus:rounded focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:ring-offset-1 dark:text-primary-400 dark:focus:ring-primary-500/40'

/** One line: prompt text plus a link or button action. */
export function PromptWithAction(props: PromptWithActionAllProps): JSX.Element {
	const actionClass = () => cn(defaultActionClass, props.actionClass)
	return (
		<p class={cn('mb-7 text-[0.9375rem] text-ink-500 dark:text-ink-400', props.class)}>
			{props.prompt}{' '}
			{props.href != null ? (
				<a href={props.href} class={actionClass()}>
					{props.actionLabel}
				</a>
			) : (
				<button type="button" class={actionClass()} onClick={props.onClick}>
					{props.actionLabel}
				</button>
			)}
		</p>
	)
}
