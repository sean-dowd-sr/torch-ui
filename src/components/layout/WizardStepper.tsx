import { Check, ChevronRight } from 'lucide-solid'
import { cn } from '../../utilities/classNames'

export type WizardStepperVariant = 'default' | 'compact' | 'pills' | 'chevrons'

export interface WizardStepperProps {
	/** Current step (1-based) */
	step: number
	/** Total number of steps */
	totalSteps: number
	/** Step labels (e.g. ['About you', 'Your company']) */
	stepLabels: string[]
	/** 'horizontal' | 'vertical' */
	orientation?: 'horizontal' | 'vertical'
	/** Visual style: default (circles + line), compact (smaller), pills (tag-style + progress bar), or chevrons (chevron separators). Default: default. */
	variant?: WizardStepperVariant
	/** Optional class for the root */
	class?: string
}

/** Reusable stepper: numbered steps with labels and connector. */
export function WizardStepper(props: WizardStepperProps) {
	const orientation = () => props.orientation ?? 'horizontal'
	const currentStep = () => props.step
	const variant = () => props.variant ?? 'default'
	const isCompact = () => variant() === 'compact'
	const isPills = () => variant() === 'pills'
	const isChevrons = () => variant() === 'chevrons'

	// Pills: horizontal only, tag-style labels with progress bar underneath
	if (isPills() && orientation() === 'horizontal') {
		const progressPercent = (currentStep() / props.stepLabels.length) * 100
		return (
			<nav class={cn('wizard-stepper wizard-stepper--pills', props.class)} aria-label="Progress">
				<div class="flex flex-col gap-3">
					<ol class="m-0 flex list-none gap-2 p-0">
						{props.stepLabels.map((label, index) => {
							const stepNum = index + 1
							const isActive = currentStep() === stepNum
							const isCompleted = currentStep() > stepNum
							return (
								<li
									class="flex min-w-0 flex-1 flex-col items-stretch gap-1.5"
									aria-current={isActive ? 'step' : undefined}
								>
									<div class="flex h-5 w-full shrink-0 items-center justify-center">
										{isCompleted ? (
											<span class="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white" aria-hidden="true">
												<Check size={12} strokeWidth={2.5} />
											</span>
										) : isActive ? (
											<span class="h-2 w-2 shrink-0 rounded-full bg-primary-500" aria-hidden="true" />
										) : (
											<span class="h-2 w-2 shrink-0 rounded-full bg-transparent" aria-hidden="true" />
										)}
									</div>
									<span
										class={cn(
											'w-full rounded-full px-3 py-1.5 text-center text-sm font-medium',
											isActive && 'bg-primary-500/15 text-primary-700 dark:bg-primary-400/20 dark:text-primary-300',
											isCompleted && 'bg-surface-overlay text-ink-700 dark:text-ink-300',
											!isActive && !isCompleted && 'bg-surface-overlay text-ink-500 dark:text-ink-500'
										)}
									>
										{label}
									</span>
								</li>
							)
						})}
					</ol>
					<div class="h-1.5 w-full overflow-hidden rounded-full bg-surface-dim">
						<div
							class="h-full rounded-full bg-primary-500 transition-[width] duration-300 ease-out"
							style={{ width: `${progressPercent}%` }}
							aria-hidden
						/>
					</div>
				</div>
			</nav>
		)
	}

	return (
		<nav class={cn('wizard-stepper', props.class)} aria-label="Progress">
			<ol
				class={cn(
					'm-0 flex list-none items-center p-0',
					orientation() === 'vertical' && 'flex-col items-stretch gap-0',
					orientation() === 'horizontal' && isChevrons() && 'w-full gap-2 sm:gap-6'
				)}
			>
				{props.stepLabels.map((label, index) => {
					const stepNum = index + 1
					const isActive = currentStep() === stepNum
					const isCompleted = currentStep() > stepNum
					return (
						<li
							class={cn(
								'flex items-center',
								orientation() === 'horizontal' &&
									(isChevrons()
										? 'min-w-0 flex-1 flex-shrink-0 basis-0 justify-center gap-2 sm:gap-3'
										: 'min-w-0 flex-1 first:min-w-0 first:flex-initial'),
								orientation() === 'vertical' && 'flex-col items-start gap-0'
							)}
							aria-current={isActive ? 'step' : undefined}
						>
							{orientation() === 'horizontal' && index > 0 &&
								(isChevrons() ? (
									<span class="flex shrink-0 items-center text-ink-300 dark:text-ink-600" aria-hidden="true">
										<ChevronRight size={isCompact() ? 16 : 20} />
									</span>
								) : (
									<span
										class={cn(
											'h-0.5 min-w-[1rem] flex-1 shrink rounded transition-colors',
											isCompact() ? 'ml-2 mr-2 sm:ml-2.5 sm:mr-2.5' : 'ml-3 mr-3 sm:ml-4 sm:mr-4',
											isCompleted ? 'bg-primary-500' : 'bg-surface-dim'
										)}
										aria-hidden="true"
									/>
								))
							}
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
										!isActive && !isCompleted && 'bg-ink-200 text-ink-500 dark:bg-ink-700 dark:text-ink-400'
									)}
								>
									{isCompleted ? <Check size={isCompact() ? 12 : 16} strokeWidth={2.5} /> : stepNum}
								</span>
								<span
									class={cn(
										'font-medium',
										isCompact() ? 'text-sm' : 'text-xs sm:text-sm',
										orientation() === 'vertical' && !isCompact() && 'text-sm',
										isActive && 'text-ink-900 dark:text-ink-100',
										isCompleted && 'text-ink-600 dark:text-ink-300',
										!isActive && !isCompleted && 'text-ink-400 dark:text-ink-500'
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
					)
				})}
			</ol>
		</nav>
	)
}
