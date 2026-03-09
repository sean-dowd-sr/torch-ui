import { describe, expect, it } from 'vitest'
import { axe } from 'jest-axe'
import { renderUI } from '../../test/test-utils'
import { Input } from '../../components/forms/Input'
import { Checkbox } from '../../components/forms/Checkbox'
import { Switch } from '../../components/forms/Switch'
import { RadioGroup } from '../../components/forms/RadioGroup'
import { TextArea } from '../../components/forms/TextArea'
import { NumberField } from '../../components/forms/NumberField'
import { Button } from '../../components/actions/Button'

const RADIO_OPTIONS = [
	{ value: 'a', label: 'Alpha' },
	{ value: 'b', label: 'Beta' },
]

describe('Accessibility: form components have no axe violations', () => {
	it('Input — default', async () => {
		const { container } = renderUI(() => <Input label="Email" />)
		expect(await axe(container)).toHaveNoViolations()
	})

	it('Input — error state', async () => {
		const { container } = renderUI(() => (
			<Input label="Email" error="Enter a valid email" />
		))
		expect(await axe(container)).toHaveNoViolations()
	})

	it('Input — disabled', async () => {
		const { container } = renderUI(() => <Input label="Email" disabled />)
		expect(await axe(container)).toHaveNoViolations()
	})

	it('Checkbox — default', async () => {
		const { container } = renderUI(() => <Checkbox label="Accept terms" />)
		expect(await axe(container)).toHaveNoViolations()
	})

	it('Checkbox — error state', async () => {
		const { container } = renderUI(() => (
			<Checkbox label="Accept terms" error="You must accept the terms" />
		))
		expect(await axe(container)).toHaveNoViolations()
	})

	it('Switch — default', async () => {
		const { container } = renderUI(() => <Switch label="Dark mode" />)
		expect(await axe(container)).toHaveNoViolations()
	})

	it('RadioGroup — default', async () => {
		const { container } = renderUI(() => (
			<RadioGroup label="Choose" options={RADIO_OPTIONS} />
		))
		expect(await axe(container)).toHaveNoViolations()
	})

	it('RadioGroup — error state', async () => {
		const { container } = renderUI(() => (
			<RadioGroup label="Choose" options={RADIO_OPTIONS} error="Required" />
		))
		expect(await axe(container)).toHaveNoViolations()
	})

	it('TextArea — default', async () => {
		const { container } = renderUI(() => <TextArea label="Message" />)
		expect(await axe(container)).toHaveNoViolations()
	})

	it('NumberField — default', async () => {
		const { container } = renderUI(() => <NumberField label="Quantity" />)
		expect(await axe(container)).toHaveNoViolations()
	})

	it('Button — primary', async () => {
		const { container } = renderUI(() => <Button>Submit</Button>)
		expect(await axe(container)).toHaveNoViolations()
	})

	it('Button — disabled', async () => {
		const { container } = renderUI(() => <Button disabled>Submit</Button>)
		expect(await axe(container)).toHaveNoViolations()
	})
})
