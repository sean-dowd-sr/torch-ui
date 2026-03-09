import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import { WizardStepper } from '../../components/layout/WizardStepper'
import { renderUI } from '../../test/test-utils'

const LABELS = ['Account', 'Profile', 'Review']

describe('WizardStepper', () => {
	it('renders all step labels', () => {
		renderUI(() => <WizardStepper step={1} totalSteps={3} stepLabels={LABELS} />)
		expect(screen.getByText('Account')).toBeInTheDocument()
		expect(screen.getByText('Profile')).toBeInTheDocument()
		expect(screen.getByText('Review')).toBeInTheDocument()
	})

	it('renders current step indicator', () => {
		renderUI(() => <WizardStepper step={2} totalSteps={3} stepLabels={LABELS} />)
		expect(screen.getByText('Profile')).toBeInTheDocument()
	})

	it('renders all variants without throwing', () => {
		const variants = ['default', 'compact', 'chevrons'] as const
		for (const variant of variants) {
			renderUI(() => (
				<WizardStepper step={1} totalSteps={3} stepLabels={LABELS} variant={variant} />
			))
		}
	})

	it('renders both orientations without throwing', () => {
		renderUI(() => <WizardStepper step={1} totalSteps={3} stepLabels={LABELS} orientation="horizontal" />)
		renderUI(() => <WizardStepper step={1} totalSteps={3} stepLabels={LABELS} orientation="vertical" />)
	})
})
