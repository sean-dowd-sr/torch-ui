import { useIcons } from '../../icons'
import { cn } from '../../utilities/classNames'

export type WizardStepperVariant = 'default' | 'compact' | 'chevrons'

export interface WizardStepperProps {
	/** Current step (1-based) */
	step: number
	/** Total number of steps */
	totalSteps: number
	/** Step labels (e.g. ['About you', 'Your company']) */
	stepLabels: string[]
	/** 'horizontal' | 'vertical' */
	orientation?: 'horizontal' | 'vertical'
	/** Visual style: default (circles + line), compact (smaller), or chevrons (chevron separators). Default: default. */
	variant?: WizardStepperVariant
	/** Optional class for the root */
	class?: string
}

/** Reusable stepper: numbered steps with labels and connector. */
export function WizardStepper(props: WizardStepperProps) {
	const icons = useIcons()
	const orientation = () => props.orientation ?? 'horizontal'
	const currentStep = () => props.step
	const variant = () => props.variant ?? 'default'
	const isCompact = () => variant() === 'compact'
	const isChevrons = () => variant() === 'chevrons'

	return (
		<nav class={cn('wizard-stepper', props.class)} aria-label="Progress">
			<ol class={cn('m-0 flex list-none items-center p-0', orientation() === 'vertical' && 'flex-col items-stretch gap-0')}>
				{props.stepLabels.map((label, index) => {
					const stepNum = index + 1
					const isActive = currentStep() === stepNum
					const isCompleted = currentStep() > stepNum
					return (
						<>
							{orientation() === 'horizontal' && index > 0 && isChevrons() && (
								<li class="flex shrink-0 items-center text-ink-300" aria-hidden="true">
									<icons.chevronRight width={isCompact() ? 16 : 20} height={isCompact() ? 16 : 20} />
								</li>
							)}
							<li
								class={cn(
									'flex items-center',
									orientation() === 'horizontal' &&
										(isChevrons()
											? 'min-w-0 flex-1 basis-0 justify-center'
											: 'min-w-0 flex-1 first:min-w-0 first:flex-initial'),
									orientation() === 'vertical' && 'flex-col items-start gap-0'
								)}
								aria-current={isActive ? 'step' : undefined}
							>
								{orientation() === 'horizontal' && index > 0 && !isChevrons() && (
									<span
										class={cn(
											'h-0.5 min-w-[1rem] flex-1 shrink rounded transition-colors',
											isCompact() ? 'ml-2 mr-2 sm:ml-2.5 sm:mr-2.5' : 'ml-3 mr-3 sm:ml-4 sm:mr-4',
											isCompleted ? 'bg-primary-500' : 'bg-surface-dim'
										)}
										aria-hidden="true"
									/>
								)}
								<div
									class={cn(
										'flex shrink-0 items-center gap-3',
										isCompact() && 'gap-2',
										orientation() === 'vertical' && 'py-2 first:pt-0',
										isCompact() && orientation() === 'vertical' && 'py-1.5 first:pt-0'
									)}
								>
									<span
										class={cn(
											'flex shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors',
											isCompact() ? 'h-6 w-6 text-xs' : 'h-8 w-8',
											isCompleted && 'bg-primary-500 text-white',
											isActive && 'bg-primary-500 text-white ring-4 ring-primary-500/20 dark:ring-primary-500/30',
											isCompact() && isActive && 'ring-2',
											!isActive && !isCompleted && 'bg-ink-200 text-ink-500'
										)}
									>
										{isCompleted ? <icons.check width={isCompact() ? 12 : 16} height={isCompact() ? 12 : 16} stroke-width={2.5} /> : stepNum}
									</span>
									<span
										class={cn(
											'font-medium',
											isCompact() ? 'text-sm' : 'text-xs sm:text-sm',
											orientation() === 'vertical' && !isCompact() && 'text-sm',
											isActive && 'text-ink-900',
											isCompleted && 'text-ink-600',
											!isActive && !isCompleted && 'text-ink-400'
										)}
									>
										{label}
									</span>
								</div>
								{orientation() === 'vertical' && index < props.stepLabels.length - 1 && (
									<span
										class={cn(
											'shrink-0 rounded transition-colors',
											isCompact() ? 'ml-3 h-3 w-0.5' : 'ml-4 h-4 w-0.5',
											isCompleted ? 'bg-primary-500' : 'bg-surface-dim'
										)}
										aria-hidden="true"
									/>
								)}
							</li>
						</>
					)
				})}
			</ol>
		</nav>
	)
}
