import { describe, test, expect, vi } from 'vitest'
import { screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { FileUpload } from '../../components/forms/FileUpload'
import { renderUI } from '../../test/test-utils'

function makeFile(name: string, type = 'image/png', size = 1024): File {
	return new File(['x'.repeat(size)], name, { type })
}

describe('FileUpload', () => {
	test('renders label', () => {
		renderUI(() => (
			<FileUpload
				label="Upload documents"
				files={[]}
				onAddFiles={vi.fn()}
				onRemove={vi.fn()}
			/>
		))
		expect(screen.getByText('Upload documents')).toBeInTheDocument()
	})

	test('shows form-level error when error prop is set', () => {
		renderUI(() => (
			<FileUpload
				label="Upload"
				files={[]}
				onAddFiles={vi.fn()}
				onRemove={vi.fn()}
				error="At least one file is required"
			/>
		))
		expect(screen.getByText('At least one file is required')).toBeInTheDocument()
	})

	test('calls onErrorClear when user selects a file while error is shown', async () => {
		const user = userEvent.setup()
		const onAddFiles = vi.fn()
		const onErrorClear = vi.fn()
		const { container } = renderUI(() => (
			<FileUpload
				label="Upload"
				files={[]}
				onAddFiles={onAddFiles}
				onRemove={vi.fn()}
				error="Required"
				onErrorClear={onErrorClear}
				variant="button"
			/>
		))
		const input = container.querySelector('input[type="file"]') as HTMLInputElement
		await user.upload(input, makeFile('test.png'))
		expect(onErrorClear).toHaveBeenCalledTimes(1)
	})

	test('calls onAddFiles with valid file on input change', async () => {
		const user = userEvent.setup()
		const onAddFiles = vi.fn()
		const { container } = renderUI(() => (
			<FileUpload
				label="Upload"
				files={[]}
				onAddFiles={onAddFiles}
				onRemove={vi.fn()}
				variant="button"
			/>
		))
		const input = container.querySelector('input[type="file"]') as HTMLInputElement
		const file = makeFile('doc.png')
		await user.upload(input, file)
		expect(onAddFiles).toHaveBeenCalledTimes(1)
		expect(onAddFiles).toHaveBeenCalledWith([file])
	})

	test('rejects files exceeding maxFileSize and does not call onAddFiles', async () => {
		const user = userEvent.setup()
		const onAddFiles = vi.fn()
		const { container } = renderUI(() => (
			<FileUpload
				label="Upload"
				files={[]}
				onAddFiles={onAddFiles}
				onRemove={vi.fn()}
				maxFileSize={100}
				variant="button"
			/>
		))
		const input = container.querySelector('input[type="file"]') as HTMLInputElement
		await user.upload(input, makeFile('big.png', 'image/png', 200))
		expect(onAddFiles).not.toHaveBeenCalled()
	})

	test('is disabled when disabled=true', () => {
		const { container } = renderUI(() => (
			<FileUpload
				label="Upload"
				files={[]}
				onAddFiles={vi.fn()}
				onRemove={vi.fn()}
				disabled
			/>
		))
		const input = container.querySelector('input[type="file"]')
		expect(input).toBeDisabled()
	})
})
