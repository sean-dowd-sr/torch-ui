# FileUpload

**Category:** forms
**Import:** `@torch-ui/solid/forms`
**Source:** `src/components/forms/FileUpload.tsx`

## Exports

```ts
import {
  FileUpload,
  type FileUploadItem,
  type FileUploadVariant,
  type FileUploadProps,
  type FileUploadLabels
} from "@torch-ui/solid/forms";
```

## Props

```ts
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

	error?: JSX.Element

	/** Called when user interacts while a form-level error is shown, allowing the parent to clear it. */

	onErrorClear?: () => void

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

	/** Override any subset of the built-in UI strings for localisation. */

	labels?: FileUploadLabels

}
```

```ts
export type FileUploadVariant = 'button' | 'dropzone'
```

```ts
export interface FileUploadItem {

	id: string

	file: File

	status: 'pending' | 'uploading' | 'done' | 'error'

	progress?: number

	error?: string

}
```

```ts
export interface FileUploadLabels {

	/** Clickable area prompt in the simple dropzone. Default: "Choose a file or drag & drop here" */

	dropzonePrompt?: string

	/** Title inside the browse-button dropzone. Default: "Drag and drop your files here" */

	dropzoneDragTitle?: string

	/** Subtitle inside the browse-button dropzone. Default: "or click Browse below" */

	dropzoneDragSubtitle?: string

	/** Text on the Browse button inside the dropzone. Default: "Browse" */

	dropzoneBrowseButton?: string

	/** Text on the Browse Files trigger button. Default: "Browse Files" */

	browseFilesButton?: string

	/** aria-label for the file input (single file). Default: "Choose file" */

	ariaChooseFile?: string

	/** aria-label for the file input (multiple files). Default: "Choose files" */

	ariaChooseFiles?: string

	/** aria-label for the file input in button variant. Default: "Browse files" */

	ariaBrowseFiles?: string

	/** aria-label for the upload region when no label prop is set. Default: "File upload" */

	ariaFileUpload?: string

	/** aria-label for the view files button. Default: "View files" */

	ariaViewFiles?: string

	/** aria-label for the uploaded files list. Default: "Uploaded files" */

	ariaUploadedFiles?: string

	/** aria-label for the retry button. Receives the file name. */

	ariaRetry?: (fileName: string) => string

	/** aria-label for the remove button. Receives the file name. */

	ariaRemove?: (fileName: string) => string

	/** aria-label for the upload progress bar. Receives the file name. */

	ariaProgress?: (fileName: string) => string

	/** Status label shown next to done files. Default: "Uploaded" */

	statusDone?: string

	/** Status label shown next to pending files. Default: "Pending" */

	statusPending?: string

	/** Status label shown next to failed files when no error message. Default: "Failed" */

	statusFailed?: string

	/** Status label shown while uploading with no progress value. Default: "…" */

	statusUploading?: string

	/** Summary text while uploading. Receives the number of active uploads. */

	summaryUploading?: (count: number) => string

	/** Summary text when all files are done. Receives the number of uploaded files. */

	summaryDone?: (count: number) => string

	/** Summary text when some files failed. Receives uploaded and failed counts. */

	summaryFailed?: (uploaded: number, failed: number) => string

	/** Limits text for max file size. Receives the formatted size string. */

	limitsMaxSize?: (size: string) => string

	/** Limits text for a single-file constraint. Default: "1 file" */

	limitsOneFile?: string

	/** Limits text for a multi-file constraint. Receives the max count. */

	limitsMaxFiles?: (count: number) => string

	/** Validation error when the one-file limit is already reached. Default: "Maximum 1 file allowed." */

	errorMaxOneFile?: string

	/** Validation error when the N-file limit is already reached. Receives the limit. */

	errorMaxFiles?: (count: number) => string

	/** Validation error when some files were skipped over the limit. Receives skipped count and limit label. */

	errorOverLimit?: (skipped: number, limitLabel: string) => string

	/** Validation error when a file exceeds the max size. Receives file name and formatted max size. */

	errorTooLarge?: (fileName: string, maxSize: string) => string

	/** Validation error when a file's type is not accepted. Receives the file name. */

	errorBadType?: (fileName: string) => string

}
```
