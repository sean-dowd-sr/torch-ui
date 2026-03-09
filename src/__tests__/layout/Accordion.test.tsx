import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import {
	AccordionRoot,
	AccordionItemStyled,
	AccordionTriggerStyled,
	AccordionContentStyled,
} from '../../components/layout/Accordion'
import { renderUI } from '../../test/test-utils'

function TestAccordion() {
	return (
		<AccordionRoot collapsible>
			<AccordionItemStyled value="item-1">
				<AccordionTriggerStyled>Section One</AccordionTriggerStyled>
				<AccordionContentStyled>Content of section one</AccordionContentStyled>
			</AccordionItemStyled>
			<AccordionItemStyled value="item-2">
				<AccordionTriggerStyled>Section Two</AccordionTriggerStyled>
				<AccordionContentStyled>Content of section two</AccordionContentStyled>
			</AccordionItemStyled>
		</AccordionRoot>
	)
}

describe('Accordion', () => {
	it('renders trigger labels', () => {
		renderUI(() => <TestAccordion />)
		expect(screen.getByText('Section One')).toBeInTheDocument()
		expect(screen.getByText('Section Two')).toBeInTheDocument()
	})

	it('content is not in DOM before clicking (lazy mount)', () => {
		renderUI(() => <TestAccordion />)
		expect(screen.queryByText('Content of section one')).not.toBeInTheDocument()
	})

	it('clicking trigger expands item', async () => {
		const user = userEvent.setup()
		renderUI(() => <TestAccordion />)
		await user.click(screen.getByText('Section One'))
		expect(screen.getByText('Content of section one')).toBeVisible()
	})

	it('clicking open trigger collapses item', async () => {
		const user = userEvent.setup()
		renderUI(() => <TestAccordion />)
		await user.click(screen.getByText('Section One'))
		expect(screen.getByText('Content of section one')).toBeInTheDocument()
		await user.click(screen.getByText('Section One'))
		const content = screen.queryByText('Content of section one')
		// After collapsing, Kobalte marks it data-closed or removes it
		if (content) {
			expect(content.closest('[data-closed]')).toBeTruthy()
		} else {
			expect(content).not.toBeInTheDocument()
		}
	})
})
