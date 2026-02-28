import type { JSX } from 'solid-js'
import { Show, For } from 'solid-js'
import { cn } from '../../utilities/classNames'
import { Alert } from './Alert'

export interface FormProps extends Omit<JSX.FormHTMLAttributes<HTMLFormElement>, 'class'> {
	/** Optional class for the form element */
	class?: string
	/** Form content (fields, sections, actions) */
	children: JSX.Element
	/** Optional form-level validation summary. When set, rendered at the top. Alert component provides alert semantics. Use for listing all field errors. */
	errorSummary?: string[] | JSX.Element
}

/** Form wrapper with consistent spacing. Use with layout primitives and WizardActions for the button row. Supports errorSummary for validation summary. */
export function Form(props: FormProps): JSX.Element {
	const { class: className, children, errorSummary, ...rest } = props
	return (
		<form class={cn('flex flex-col gap-6', className)} {...rest}>
			<Show when={errorSummary && (Array.isArray(errorSummary) ? errorSummary.length > 0 : true)}>
				<>
					{Array.isArray(errorSummary) ? (
						<Alert status="error" class="mb-0">
							<p class="font-medium">Please fix the following:</p>
							<ul class="mt-1 list-inside list-disc">
								<For each={errorSummary}>
									{(msg) => <li>{msg}</li>}
								</For>
							</ul>
						</Alert>
					) : (
						errorSummary
					)}
				</>
			</Show>
			{children}
		</form>
	)
}
