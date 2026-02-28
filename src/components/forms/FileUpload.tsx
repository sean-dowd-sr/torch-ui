import type { JSX } from 'solid-js'
import { createUniqueId, createSignal, createEffect, onCleanup, Show, For, splitProps } from 'solid-js'
import { File as FileIcon, FileCode, FileImage, FilePlay, FileSpreadsheet, FileText, FileUp, FolderArchive, LoaderCircle, RefreshCw, Trash2, Eye, Loader2 } from 'lucide-solid'
import { cn } from '../../utilities/classNames'
import { mergeRefs } from '../../utilities/mergeRefs'
import { Progress } from '../feedback/Progress'
import { Dialog } from '../overlays/Dialog'

/** Single file entry with status and optional progress/error. Parent manages upload and updates these. */
export interface FileUploadItem {
	id: string
	file: File
	status: 'pending' | 'uploading' | 'done' | 'error'
	progress?: number
	error?: string
}

export type FileUploadVariant = 'button' | 'dropzone'

export interface FileUploadProps {
	/** Controlled list of files. Parent adds/removes and updates status/progress. */
	files: FileUploadItem[]
	/** Called when user selects or drops files. Parent should append with id and status (e.g. 'pending' or 'uploading'). */
	onAddFiles: (files: File[]) => void
	/** Called when user removes a file. */
	onRemove: (id: string) => void
	/** Called when user retries a failed file. */
	onRetry?: (id: string) => void
	/** Label above the control. */
	label?: string
	/** Helper text and/or limits (e.g. "PNG, JPG. Max 10 MB"). Shown below label or in dropzone. */
	description?: string
	/** Accept attribute (e.g. "image/png,image/jpeg"). */
	accept?: string
	/** When false, single file only (input multiple=false, maxFiles 1). Default true. */
	multiple?: boolean
	/** Max number of files. When multiple is false, defaults to 1. */
	maxFiles?: number
	/** Max file size in bytes. Validated before onAddFiles. */
	maxFileSize?: number
	/** 'button' = trigger only; 'dropzone' = large dashed area with drag & drop. */
	variant?: FileUploadVariant
	/** Form-level error (e.g. "No files attached"). */
	error?: string
	/** Disabled state. */
	disabled?: boolean
	/** Optional id for the hidden input. */
	id?: string
	/** Ref forwarded to the hidden file input. */
	ref?: (el: HTMLInputElement) => void
	/** Root class. */
	class?: string
	/** When true (dropzone only), show "Drag and drop..." + a prominent Browse button inside the zone. Default false = single clickable area. */
	browseButton?: boolean
	/** Footer actions (e.g. Done left, Upload right). Dropzone: footer bar; button variant: same row after the trigger. */
	actions?: JSX.Element
	/** Optional icon per file in the list. Receives the File; return a JSX element. When not set, a default icon is chosen by type (PDF→FileText, image→FileImage, video→FilePlay, spreadsheet/csv→FileSpreadsheet, archive→FolderArchive, code/txt→FileCode, else File). */
	fileIcon?: (file: File) => JSX.Element
	/** When true (button variant only), show the selected file(s) to the right of the button in the same row instead of below. */
	fileInline?: boolean
}

const DEFAULT_MAX_FILES = 10

const CODE_EXT = new Set(['txt', 'js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs', 'json', 'html', 'htm', 'css', 'scss', 'sass', 'less', 'md', 'xml', 'yml', 'yaml', 'sh', 'bash', 'py', 'rb', 'php', 'java', 'c', 'cpp', 'h', 'hpp', 'cs', 'go', 'rs', 'vue', 'svelte'])
const SPREADSHEET_EXT = new Set(['csv', 'xls', 'xlsx', 'xlsm', 'ods'])
const ARCHIVE_EXT = new Set(['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'zst'])

/** Default icon by file type: PDF, image, video, spreadsheet, archive, code/txt, else file. */
function defaultFileIcon(file: File): JSX.Element {
	const t = (file.type || '').toLowerCase()
	const ext = (file.name.split('.').pop() ?? '').toLowerCase()
	const cls = 'h-4 w-4 shrink-0 text-ink-400 dark:text-ink-500'
	if (t === 'application/pdf') return <FileText class={cls} aria-hidden="true" />
	if (t.startsWith('image/')) return <FileImage class={cls} aria-hidden="true" />
	if (t.startsWith('video/')) return <FilePlay class={cls} aria-hidden="true" />
	if (t === 'text/csv' || t.includes('spreadsheet') || t.includes('excel') || SPREADSHEET_EXT.has(ext))
		return <FileSpreadsheet class={cls} aria-hidden="true" />
	if (t.includes('zip') || t.includes('rar') || t.includes('gzip') || t.includes('compress') || ARCHIVE_EXT.has(ext))
		return <FolderArchive class={cls} aria-hidden="true" />
	if (t.startsWith('text/') || CODE_EXT.has(ext)) return <FileCode class={cls} aria-hidden="true" />
	return <FileIcon class={cls} aria-hidden="true" />
}

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function validateFiles(
	files: File[],
	accept: string | undefined,
	maxFileSize: number | undefined,
	maxFiles: number,
	currentCount: number
): { valid: File[]; errors: string[] } {
	const errors: string[] = []
	const valid: File[] = []
	const remaining = Math.max(0, maxFiles - currentCount)
	if (remaining === 0) {
		errors.push(maxFiles === 1 ? 'Maximum 1 file allowed.' : `Maximum ${maxFiles} files allowed.`)
		return { valid, errors }
	}
	const types = (accept?.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean) ?? [])
	for (let i = 0; i < files.length; i++) {
		const file = files[i]!
		if (valid.length >= remaining) {
			const skipped = files.length - i
			const limitMsg = maxFiles === 1 ? 'maximum 1 file' : `maximum of ${maxFiles}`
			errors.push(`${skipped} file${skipped > 1 ? 's' : ''} not added: ${limitMsg} reached.`)
			break
		}
		if (maxFileSize != null && file.size > maxFileSize) {
			errors.push(`${file.name}: exceeds ${formatFileSize(maxFileSize)}.`)
			continue
		}
		if (types.length > 0) {
			const mime = (file.type || '').toLowerCase()
			const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase()
			const allowed =
				types.some((t) => t === '*/*') ||
				types.some((t) => t.startsWith('.') && ext === t) ||
				types.some((t) => mime === t || (t.endsWith('/*') && mime && mime.startsWith(t.slice(0, -1))))
			if (!allowed) {
				errors.push(`${file.name}: type not accepted.`)
				continue
			}
		}
		valid.push(file)
	}
	return { valid, errors }
}

export function FileUpload(props: FileUploadProps) {
	const [local, rest] = splitProps(props, [
		'files',
		'onAddFiles',
		'onRemove',
		'onRetry',
		'label',
		'description',
		'accept',
		'maxFiles',
		'maxFileSize',
		'variant',
		'error',
		'disabled',
		'id',
		'ref',
		'class',
		'browseButton',
		'actions',
		'multiple',
		'fileIcon',
		'fileInline',
	])

	const uid = createUniqueId()
	const id = () => local.id ?? `file-upload-${uid}`
	const labelId = () => `${id()}-label`
	const descId = () => `${id()}-desc`
	const validationId = () => `${id()}-validation`
	const errorId = () => `${id()}-error`
	const variant = () => local.variant ?? 'dropzone'
	const isMultiple = () => local.multiple !== false
	const maxFiles = () =>
		local.maxFiles ?? (isMultiple() ? DEFAULT_MAX_FILES : 1)
	const fileIcon = (file: File) =>
		local.fileIcon ? local.fileIcon(file) : defaultFileIcon(file)
	const canAddMore = () => local.files.length < maxFiles()
	const atLimit = () => !canAddMore()
	const [dragDepth, setDragDepth] = createSignal(0)
	const dragOver = () => dragDepth() > 0
	const [validationErrors, setValidationErrors] = createSignal<string[]>([])
	const [viewModalOpen, setViewModalOpen] = createSignal(false)
	const zoneDisabled = () => local.disabled || atLimit()

	const isFileDrag = (e: DragEvent) =>
		Array.from(e.dataTransfer?.types ?? []).includes('Files')

	// Reset drag depth if the cursor leaves the window or the drag ends elsewhere
	createEffect(() => {
		if (typeof window === 'undefined') return
		const reset = () => setDragDepth(0)
		const onWinDragLeave = (e: DragEvent) => {
			if ((e as any).relatedTarget == null) reset()
		}
		window.addEventListener('drop', reset)
		window.addEventListener('dragend', reset)
		window.addEventListener('dragleave', onWinDragLeave as EventListener)
		document.addEventListener('drop', reset)
		document.addEventListener('dragend', reset)
		onCleanup(() => {
			window.removeEventListener('drop', reset)
			window.removeEventListener('dragend', reset)
			window.removeEventListener('dragleave', onWinDragLeave as EventListener)
			document.removeEventListener('drop', reset)
			document.removeEventListener('dragend', reset)
		})
	})

	const describedBy = () => {
		const parts: string[] = []
		if (local.description || limitsText()) parts.push(descId())
		if (validationErrors().length > 0) parts.push(validationId())
		if (local.error) parts.push(errorId())
		return parts.length > 0 ? parts.join(' ') : undefined
	}
	const hasAnyError = () => validationErrors().length > 0 || !!local.error
	const ariaErrorMessage = () =>
		validationErrors().length > 0 ? validationId()
		: local.error ? errorId()
		: undefined

	let inputEl: HTMLInputElement | undefined

	const handleInputChange = (e: Event) => {
		setValidationErrors([])
		const input = e.currentTarget as HTMLInputElement
		const list = input.files
		if (!list?.length) return
		const newFiles = Array.from(list)
		const { valid, errors } = validateFiles(
			newFiles,
			local.accept,
			local.maxFileSize,
			maxFiles(),
			local.files.length
		)
		setValidationErrors(errors)
		if (valid.length) local.onAddFiles(valid)
		input.value = ''
	}

	const handleDrop = (e: DragEvent) => {
		e.preventDefault()
		setDragDepth(0)
		setValidationErrors([])
		if (local.disabled || atLimit()) return
		const list = e.dataTransfer?.files
		if (!list?.length) return
		const newFiles = Array.from(list)
		const { valid, errors } = validateFiles(
			newFiles,
			local.accept,
			local.maxFileSize,
			maxFiles(),
			local.files.length
		)
		setValidationErrors(errors)
		if (valid.length) local.onAddFiles(valid)
	}

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault()
	}

	const handleDragEnter = (e: DragEvent) => {
		e.preventDefault()
		if (!isFileDrag(e) || local.disabled || atLimit()) return
		setDragDepth((d) => Math.min(1, d + 1))
	}

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault()
		const next = e.relatedTarget as Node | null
		if (next && (e.currentTarget as Node).contains(next)) return
		setDragDepth((d) => Math.max(0, d - 1))
	}

	const isSingleFileMode = () => local.multiple === false || maxFiles() === 1
	/** When single file and a file is selected, hide the dropzone/button so only the file row shows. */
	const hideTrigger = () => isSingleFileMode() && local.files.length > 0
	/** When button + fileInline and trigger visible, files show inline; otherwise show list below. When hideTrigger (single file + has file), list below is the only UI. */
	const showFileListBelow = () =>
		local.files.length > 0 &&
		(hideTrigger() || !(variant() === 'button' && local.fileInline))
	const limitsText = () => {
		const parts: string[] = []
		if (local.maxFileSize != null) parts.push(`Max ${formatFileSize(local.maxFileSize)}`)
		if (maxFiles() === 1) parts.push('1 file')
		else if (maxFiles() !== DEFAULT_MAX_FILES) parts.push(`Up to ${maxFiles()} files`)
		return parts.length ? parts.join('. ') : undefined
	}

	const summary = () => {
		const list = local.files
		const done = list.filter((f) => f.status === 'done').length
		const failed = list.filter((f) => f.status === 'error').length
		const uploading = list.filter((f) => f.status === 'uploading').length
		if (failed > 0) return `${done} uploaded, ${failed} failed`
		if (uploading > 0) return `Uploading ${uploading}…`
		if (done > 0) return done === 1 ? '1 file uploaded' : `${done} files uploaded`
		return undefined
	}

	return (
		<div class={cn('w-full', local.class)} {...rest}>
			<Show when={local.label}>
				<div
					id={labelId()}
					class="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300"
				>
					{local.label}
				</div>
			</Show>

			{variant() === 'dropzone' && (
				<Show when={!hideTrigger()}>
					<div
						role="group"
						aria-labelledby={local.label ? labelId() : undefined}
						aria-label={local.label ? undefined : 'File upload'}
						class={cn(
						'rounded-lg border-2 border-dashed transition-colors',
						dragOver()
							? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
							: 'border-surface-border bg-surface-base/50',
						(local.disabled || atLimit()) && 'pointer-events-none opacity-50'
					)}
						onDrop={handleDrop}
						onDragOver={handleDragOver}
						onDragEnter={handleDragEnter}
						onDragLeave={handleDragLeave}
					>
					<input
						ref={mergeRefs((el: HTMLInputElement) => (inputEl = el), local.ref)}
						id={id()}
						type="file"
						accept={local.accept}
						multiple={isMultiple()}
						onChange={handleInputChange}
						disabled={local.disabled || atLimit()}
						class="sr-only"
						aria-labelledby={local.label ? labelId() : undefined}
						aria-label={local.label ? undefined : (isMultiple() ? 'Choose files' : 'Choose file')}
						aria-describedby={describedBy()}
						aria-invalid={hasAnyError() ? 'true' : undefined}
						aria-errormessage={ariaErrorMessage()}
					/>
					<Show
						when={local.browseButton}
						fallback={
							<div
								role="button"
								tabIndex={zoneDisabled() ? -1 : 0}
								aria-disabled={zoneDisabled() ? 'true' : undefined}
								onClick={() => !zoneDisabled() && inputEl?.click()}
								onKeyDown={(e: KeyboardEvent) => {
									if (zoneDisabled()) return
									if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputEl?.click() }
								}}
								class="flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-1 px-4 py-6 text-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 rounded-lg"
							>
								<FileUp class="h-8 w-8 text-ink-400 dark:text-ink-500" />
								<span class="text-sm font-medium text-ink-700 dark:text-ink-200">
									Choose a file or drag & drop here
								</span>
								<Show when={limitsText()}>
									<span class="text-xs text-ink-500 dark:text-ink-400">{limitsText()}</span>
								</Show>
								<Show when={local.description && !limitsText()}>
									<span class="text-xs text-ink-500 dark:text-ink-400">{local.description}</span>
								</Show>
							</div>
						}
					>
						<div class="flex min-h-[140px] flex-col items-center justify-center gap-3 px-4 py-6">
							<div class="flex flex-col items-center justify-center gap-1 text-center">
								<FileUp class="h-10 w-10 text-ink-400 dark:text-ink-500" />
								<span class="text-sm font-medium text-ink-700 dark:text-ink-200">
									Drag and drop your files here
								</span>
								<span class="text-sm text-ink-500 dark:text-ink-400">
									or click Browse below
								</span>
								<Show when={limitsText()}>
									<span class="text-xs text-ink-500 dark:text-ink-400">{limitsText()}</span>
								</Show>
								<Show when={local.description && !limitsText()}>
									<span class="text-xs text-ink-500 dark:text-ink-400">{local.description}</span>
								</Show>
							</div>
							<button
								type="button"
								onClick={() => inputEl?.click()}
								disabled={local.disabled || atLimit()}
								class={cn(
									'inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-ink-900',
									(local.disabled || atLimit()) && 'opacity-50 cursor-not-allowed'
								)}
							>
								<FileUp class="h-4 w-4" />
								Browse
							</button>
						</div>
					</Show>
					<Show when={local.actions}>
						<div class="flex w-full items-center justify-between gap-2 border-t border-surface-border px-4 py-3">
							{local.actions}
						</div>
					</Show>
				</div>
				</Show>
			)}

			{variant() === 'button' && (
				<>
				<Show when={!hideTrigger()}>
				<div class="flex flex-wrap items-center gap-2">
					<input
						ref={mergeRefs((el: HTMLInputElement) => (inputEl = el), local.ref)}
						id={id()}
						type="file"
						accept={local.accept}
						multiple={isMultiple()}
						onChange={handleInputChange}
						disabled={local.disabled || atLimit()}
						class="sr-only"
						aria-labelledby={local.label ? labelId() : undefined}
						aria-label={local.label ? undefined : 'Browse files'}
						aria-describedby={describedBy()}
						aria-invalid={hasAnyError() ? 'true' : undefined}
						aria-errormessage={ariaErrorMessage()}
					/>
					<button
						type="button"
						onClick={() => inputEl?.click()}
						disabled={local.disabled || atLimit()}
						class={cn(
							'inline-flex items-center gap-2 rounded-lg border border-surface-border bg-surface-raised px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-200 hover:bg-surface-overlay transition-colors',
							(local.disabled || atLimit()) && 'opacity-50 cursor-not-allowed'
						)}
					>
						<FileUp class="h-4 w-4" />
						Browse Files
					</button>
					<Show when={local.description}>
						<span class="text-sm text-ink-500 dark:text-ink-400">{local.description}</span>
					</Show>
					<Show when={local.fileInline && local.files.length > 0}>
						<div class="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-surface-border bg-surface-raised px-3 py-2">
							<Show
								when={local.files.length === 1 && local.files[0]}
								fallback={
									<span class="min-w-0 flex-1 text-sm text-ink-900 dark:text-ink-100">
										{local.files.length === 1 ? '1 file' : `${local.files.length} files`}
									</span>
								}
							>
								<>
									{local.files[0] && fileIcon(local.files[0].file)}
									<span class="min-w-0 flex-1 truncate text-sm font-medium text-ink-900 dark:text-ink-100">
										{local.files[0]?.file.name}
									</span>
									<span class="shrink-0 text-xs text-ink-500 dark:text-ink-400">
										{local.files[0] && formatFileSize(local.files[0].file.size)}
									</span>
								</>
							</Show>
							<button
								type="button"
								onClick={() => setViewModalOpen(true)}
								class="shrink-0 rounded p-1.5 text-ink-500 hover:bg-ink-100 hover:text-ink-700 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-200"
								aria-label="View files"
							>
								<Eye class="h-4 w-4" />
							</button>
						</div>
					</Show>
					<Show when={local.actions}>{local.actions}</Show>
				</div>
				</Show>
				<Dialog
					open={viewModalOpen()}
					onClose={() => setViewModalOpen(false)}
					size="md"
					showCloseButton
				>
					<h2 class="text-lg font-semibold text-ink-900 dark:text-ink-100">
						{local.files.length === 1 ? '1 file' : `${local.files.length} files`}
					</h2>
					<ul class="mt-3 space-y-2" aria-label="Uploaded files">
						<For each={local.files}>
							{(item) => (
								<li class="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-base px-3 py-2">
									{fileIcon(item.file)}
									<span class="min-w-0 flex-1 truncate text-sm font-medium text-ink-900 dark:text-ink-100">
										{item.file.name}
									</span>
									<span class="shrink-0 text-xs text-ink-500 dark:text-ink-400">
										{formatFileSize(item.file.size)}
									</span>
									<span class="shrink-0 text-xs text-ink-500 dark:text-ink-400">
										{item.status === 'done' && 'Uploaded'}
										{item.status === 'uploading' && (item.progress != null ? `${item.progress}%` : '…')}
										{item.status === 'error' && (item.error ?? 'Failed')}
										{item.status === 'pending' && 'Pending'}
									</span>
									<div class="flex shrink-0 items-center gap-1">
										{item.status === 'error' && local.onRetry && (
											<button
												type="button"
												onClick={() => local.onRetry?.(item.id)}
												class="rounded p-1 text-ink-500 hover:bg-ink-100 hover:text-ink-700 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-200"
												aria-label={`Retry ${item.file.name}`}
											>
												<RefreshCw class="h-4 w-4" />
											</button>
										)}
										<button
											type="button"
											onClick={() => local.onRemove(item.id)}
											class="rounded p-1 text-ink-500 hover:bg-ink-100 hover:text-ink-700 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-200"
											aria-label={`Remove ${item.file.name}`}
										>
											<Trash2 class="h-4 w-4" />
										</button>
									</div>
								</li>
							)}
						</For>
					</ul>
				</Dialog>
				</>
			)}

			{/* File list below (when not button+fileInline, or when dropzone / single file with trigger hidden) */}
			<Show when={showFileListBelow()}>
				<ul class="mt-3 space-y-2" aria-label="Uploaded files">
					<For each={local.files}>
						{(item) => (
							<li class="flex flex-col gap-1.5 rounded-lg border border-surface-border bg-surface-raised px-3 py-2">
								<div class="flex items-center gap-2">
									{fileIcon(item.file)}
									<span class="min-w-0 flex-1 truncate text-sm font-medium text-ink-900 dark:text-ink-100">
										{item.file.name}
									</span>
									<span class="shrink-0 text-xs text-ink-500 dark:text-ink-400">
										{formatFileSize(item.file.size)}
									</span>
									<span class="shrink-0 text-xs text-ink-500 dark:text-ink-400">
										{item.status === 'uploading' && (item.progress != null ? `${item.progress}%` : '…')}
										{item.status === 'done' && 'Uploaded'}
										{item.status === 'error' && (item.error ?? 'Failed')}
										{item.status === 'pending' && 'Pending'}
									</span>
									<div class="flex shrink-0 items-center gap-1">
										{item.status === 'uploading' && (
											<LoaderCircle class="h-4 w-4 animate-spin text-ink-400" aria-hidden="true" />
										)}
										{item.status === 'error' && local.onRetry && (
											<button
												type="button"
												onClick={() => local.onRetry?.(item.id)}
												class="rounded p-1 text-ink-500 hover:bg-ink-100 hover:text-ink-700 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-200"
												aria-label={`Retry ${item.file.name}`}
											>
												<RefreshCw class="h-4 w-4" />
											</button>
										)}
										<button
											type="button"
											onClick={() => local.onRemove(item.id)}
											class="rounded p-1 text-ink-500 hover:bg-ink-100 hover:text-ink-700 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-200"
											aria-label={`Remove ${item.file.name}`}
										>
											<Trash2 class="h-4 w-4" />
										</button>
									</div>
								</div>
								<Show when={item.status === 'uploading' && item.progress != null}>
									<Progress
										value={item.progress}
										size="sm"
										showValueLabel={false}
										class="h-1.5"
										aria-label={`Upload progress for ${item.file.name}`}
									/>
								</Show>
							</li>
						)}
					</For>
				</ul>
			</Show>

			<Show when={summary() && !(variant() === 'button' && local.fileInline)}>
				<p class="mt-2 text-xs text-ink-500 dark:text-ink-400">{summary()}</p>
			</Show>

			<Show when={local.description || limitsText()}>
				<span id={descId()} class="sr-only">
					{/* In button variant, description is visible — only include limits here to avoid double-announce */}
					{variant() === 'button' ? limitsText() : <>{local.description}{local.description && limitsText() ? ' ' : ''}{limitsText()}</>}
				</span>
			</Show>

			<Show when={validationErrors().length > 0}>
				<ul id={validationId()} role="alert" class="mt-2 flex flex-col gap-0.5 text-sm text-danger-600 dark:text-danger-400">
					<For each={validationErrors()}>
						{(msg) => <li>{msg}</li>}
					</For>
				</ul>
			</Show>

			<Show when={local.error}>
				<p id={errorId()} class="mt-2 flex items-center gap-1.5 text-sm text-danger-600 dark:text-danger-400">
					{local.error}
				</p>
			</Show>
		</div>
	)
}
