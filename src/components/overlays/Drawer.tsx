import { Show, onMount, type JSX, splitProps, createEffect, createSignal, on, onCleanup } from 'solid-js'
import { Dialog as KobalteDialog } from '@kobalte/core/dialog'
import { Button } from '../actions'
import { cn } from '../../utilities/classNames'

export type DrawerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
export type DrawerSide = 'start' | 'end' | 'top' | 'bottom'

/** Where to place the action buttons (Cancel/Save). Default bottom. */
export type DrawerActionsPosition = 'bottom' | 'top-end' | 'top-start'

export interface DrawerProps extends JSX.HTMLAttributes<HTMLElement> {
	open: boolean
	onClose?: () => void
	/** Called when open state changes */
	onOpenChange?: (open: boolean) => void
	size?: DrawerSize
	side?: DrawerSide
	overlay?: boolean
	closeOnOverlayClick?: boolean
	overlayClass?: string
	/** Dark semi-transparent overlay; default true. Set false to keep background visible (e.g. reference data). */
	overlayDim?: boolean
	/** Backdrop blur on overlay; default true. Set false for no blur. */
	overlayBlur?: boolean
	/** Show a circular close (X) button when onClose is provided */
	showCloseButton?: boolean
	/** Cancel action. Also used as overlay/outside-click fallback before onClose. */
	onCancel?: () => void
	/** Primary action (e.g. Save) */
	onSave?: () => void
	cancelLabel?: string
	saveLabel?: string
	/** Where to place Cancel/Save actions. Default bottom. */
	actionsPosition?: DrawerActionsPosition
	/** Disable page scroll (hide body scrollbar) while drawer is open. Default true. */
	lockScroll?: boolean
	/** Inset from viewport edges (Tailwind spacing: 0, 2=0.5rem, 4=1rem, 6=1.5rem). No offset when size is full. Default 0. */
	offset?: '0' | '2' | '4' | '6'
	/** Called after the exit animation completes. Use this instead of onClose to defer clearing state so content doesn't change mid-animation. */
	onCloseComplete?: () => void
	/** Remove default p-6 padding from the content area. Use when children provide their own full-bleed layout. */
	noPadding?: boolean
	/** Optional class applied to the inner scrollable content div (the direct parent of children). */
	contentClass?: string
}

// Width for start/end; height for top/bottom
const sizeWidthClasses: Record<DrawerSize, string> = {
	xs: 'w-[280px]',
	sm: 'w-[320px]',
	md: 'w-[384px]',
	lg: 'w-[448px]',
	xl: 'w-[512px]',
	'2xl': 'w-[42rem]',
	full: 'w-full',
}

const sizeHeightClasses: Record<DrawerSize, string> = {
	xs: 'h-[280px]',
	sm: 'h-[320px]',
	md: 'h-[384px]',
	lg: 'h-[448px]',
	xl: 'h-[512px]',
	'2xl': 'h-[42rem]',
	full: 'h-full',
}

export type DrawerOffset = '0' | '2' | '4' | '6'

// Inset from viewport (top/right/bottom/left) so height/width are constrained. When offset 0, panel is flush to edges.
const insetClassesBySide: Record<'start' | 'end' | 'top' | 'bottom', Record<DrawerOffset, string>> = {
	end: { '0': 'right-0 top-0 bottom-0', '2': 'top-2 right-2 bottom-2', '4': 'top-4 right-4 bottom-4', '6': 'top-6 right-6 bottom-6' },
	start: { '0': 'left-0 top-0 bottom-0', '2': 'top-2 left-2 bottom-2', '4': 'top-4 left-4 bottom-4', '6': 'top-6 left-6 bottom-6' },
	top: { '0': 'left-0 right-0 top-0', '2': 'left-2 right-2 top-2', '4': 'left-4 right-4 top-4', '6': 'left-6 right-6 top-6' },
	bottom: { '0': 'left-0 right-0 bottom-0', '2': 'left-2 right-2 bottom-2', '4': 'left-4 right-4 bottom-4', '6': 'left-6 right-6 bottom-6' },
}

const decorationBySide: Record<'start' | 'end' | 'top' | 'bottom', string> = {
	start: 'rounded-r-lg border-r',
	end: 'rounded-l-lg border-l',
	top: 'rounded-b-lg border-b',
	bottom: 'rounded-t-lg border-t',
}

const drawerStyles = `
@keyframes torchui-drawer-fade-in {
	from { opacity: 0; }
	to { opacity: 1; }
}
@keyframes torchui-drawer-fade-out {
	from { opacity: 1; }
	to { opacity: 0; }
}
@keyframes torchui-drawer-slide-in-end {
	from { transform: translateX(100%); }
	to { transform: translateX(0); }
}
@keyframes torchui-drawer-slide-in-start {
	from { transform: translateX(-100%); }
	to { transform: translateX(0); }
}
@keyframes torchui-drawer-slide-in-top {
	from { transform: translateY(-100%); }
	to { transform: translateY(0); }
}
@keyframes torchui-drawer-slide-in-bottom {
	from { transform: translateY(100%); }
	to { transform: translateY(0); }
}
@keyframes torchui-drawer-slide-out-end {
	from { transform: translateX(0); }
	to { transform: translateX(100%); }
}
@keyframes torchui-drawer-slide-out-start {
	from { transform: translateX(0); }
	to { transform: translateX(-100%); }
}
@keyframes torchui-drawer-slide-out-top {
	from { transform: translateY(0); }
	to { transform: translateY(-100%); }
}
@keyframes torchui-drawer-slide-out-bottom {
	from { transform: translateY(0); }
	to { transform: translateY(100%); }
}
.torchui-drawer-overlay {
	opacity: 0;
	animation: torchui-drawer-fade-out 0.2s ease-in forwards;
}
.torchui-drawer-overlay[data-expanded] {
	opacity: 1;
	animation: torchui-drawer-fade-in 0.25s ease-out forwards;
}
.torchui-drawer-panel[data-side="end"] {
	transform: translateX(100%);
	animation: torchui-drawer-slide-out-end 0.2s ease-in forwards;
}
.torchui-drawer-panel[data-side="end"][data-expanded] {
	transform: translateX(0);
	animation: torchui-drawer-slide-in-end 0.25s ease-out forwards;
}
.torchui-drawer-panel[data-side="start"] {
	transform: translateX(-100%);
	animation: torchui-drawer-slide-out-start 0.2s ease-in forwards;
}
.torchui-drawer-panel[data-side="start"][data-expanded] {
	transform: translateX(0);
	animation: torchui-drawer-slide-in-start 0.25s ease-out forwards;
}
.torchui-drawer-panel[data-side="top"] {
	transform: translateY(-100%);
	animation: torchui-drawer-slide-out-top 0.2s ease-in forwards;
}
.torchui-drawer-panel[data-side="top"][data-expanded] {
	transform: translateY(0);
	animation: torchui-drawer-slide-in-top 0.25s ease-out forwards;
}
.torchui-drawer-panel[data-side="bottom"] {
	transform: translateY(100%);
	animation: torchui-drawer-slide-out-bottom 0.2s ease-in forwards;
}
.torchui-drawer-panel[data-side="bottom"][data-expanded] {
	transform: translateY(0);
	animation: torchui-drawer-slide-in-bottom 0.25s ease-out forwards;
}
`

// ID-based DOM guard: prevents duplicate style tags even across multiple module loads
// (e.g., microfrontends, test setups, different bundles)
const STYLE_ID = 'torchui-drawer-styles'
function ensureDrawerStyles() {
	if (typeof document === 'undefined') return
	if (document.getElementById(STYLE_ID)) return
	
	const style = document.createElement('style')
	style.id = STYLE_ID
	style.textContent = drawerStyles
	document.head.appendChild(style)
}

export function Drawer(props: DrawerProps) {
	const [local, others] = splitProps(props, [
		'open',
		'onClose',
		'onOpenChange',
		'size',
		'side',
		'overlay',
		'closeOnOverlayClick',
		'overlayClass',
		'overlayDim',
		'overlayBlur',
		'showCloseButton',
		'onCancel',
		'onSave',
		'cancelLabel',
		'saveLabel',
		'actionsPosition',
		'lockScroll',
		'offset',
		'onCloseComplete',
		'noPadding',
		'contentClass',
		'class',
		'children',
	])

	onMount(ensureDrawerStyles)

	const side = () => local.side ?? 'end'
	const isHorizontal = () => side() === 'start' || side() === 'end'
	const sizeClass = () =>
		isHorizontal() ? sizeWidthClasses[effectiveSize()] : sizeHeightClasses[effectiveSize()]
	const showOverlay = () => local.overlay !== false
	const closeOnOverlay = () => local.closeOnOverlayClick !== false
	const hasFooter = () => showCancel() || local.onSave != null
	const actionsPosition = () => local.actionsPosition ?? 'bottom'

	// Track close reason to distinguish between cancel and close actions
	let closeReason: 'cancel' | 'close' | null = null

	// Single source of truth for open state changes
	const handleOpenChange = (isOpen: boolean) => {
		local.onOpenChange?.(isOpen)

		if (!isOpen) {
			if (closeReason === 'cancel') local.onCancel?.()
			closeReason = null
			local.onClose?.()
		}
	}

	// For user intent cancel (overlay click / cancel button)
	const setCancelReason = () => {
		closeReason = 'cancel'
	}

	// For "just close" (X button) - let Kobalte drive the close event
	const setCloseReason = () => {
		closeReason = 'close'
	}

	// Check if drawer can be closed (either onOpenChange or onClose is sufficient)
	const canClose = () => local.onOpenChange != null || local.onClose != null

	// Show Cancel button and close button only when drawer is closable
	const showCancel = () => canClose()

	// Freeze size during exit animation so sizeClass doesn't snap to md when parent clears state.
	const [effectiveSize, setEffectiveSize] = createSignal<DrawerSize>(local.size ?? 'md')
	createEffect(on(
		() => [local.open, local.size] as const,
		([open, size]) => { if (open) setEffectiveSize(size ?? 'md') }
	))
	// Fire onCloseComplete after the 200ms exit animation completes.
	createEffect(on(() => local.open, (isOpen, wasOpen) => {
		if (wasOpen === true && !isOpen) {
			const t = setTimeout(() => local.onCloseComplete?.(), 200)
			onCleanup(() => clearTimeout(t))
		}
	}))
	const currentSize = () => effectiveSize()
	const isFull = () => currentSize() === 'full'
	const offset = (): DrawerOffset => local.offset ?? '0'
	const hasInsetOffset = () => !isFull() && offset() !== '0'
	const panelInsetClasses = () => insetClassesBySide[side()][offset()]
	const panelDecorationClasses = () => (hasInsetOffset() ? 'rounded-lg' : decorationBySide[side()])
	// When offset is set, height/width come from insets; otherwise use h-full/w-full
	const panelSizeStretch = () =>
		hasInsetOffset() ? '' : isHorizontal() ? 'h-full' : 'w-full'

	const closeButtonEl = () => (
		<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M18 6 6 18M6 6l12 12" />
		</svg>
	)

	const actionsBlock = () => (
		<div class="flex items-center justify-end gap-3">
			<Show when={showCancel()} fallback={<span />}>
				<KobalteDialog.CloseButton
					as={Button}
					variant="ghost"
					size="sm"
					onClick={setCancelReason}
				>
					{local.cancelLabel ?? 'Cancel'}
				</KobalteDialog.CloseButton>
			</Show>
			<Show when={local.onSave}>
				<Button
					variant="primary"
					size="sm"
					class="rounded-lg"
					onClick={local.onSave}
				>
					{local.saveLabel ?? 'Save'}
				</Button>
			</Show>
		</div>
	)

	return (
		<KobalteDialog
			open={local.open}
			onOpenChange={handleOpenChange}
			modal
			preventScroll={local.lockScroll !== false}
		>
			<KobalteDialog.Portal>
				<Show when={showOverlay()}>
					<KobalteDialog.Overlay
						class={cn(
							'torchui-drawer-overlay fixed inset-0 z-[60] min-h-screen',
							local.overlayDim !== false && 'bg-black/30 dark:bg-black/60',
							local.overlayBlur !== false && 'backdrop-blur-md dark:backdrop-blur-md',
							local.overlayClass,
						)}
						onPointerDown={() => { if (closeOnOverlay()) setCancelReason() }}
					/>
				</Show>
				<KobalteDialog.Content
					as="aside"
					class={cn(
						'torchui-drawer-panel fixed z-[70] flex flex-col bg-surface-raised text-ink-900 shadow-[0_20px_50px_-12px_rgba(0,0,0,.15)]',
						'border border-surface-border dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,.5)]',
						panelInsetClasses(),
						panelDecorationClasses(),
						sizeClass(),
						panelSizeStretch(),
						local.class,
					)}
					data-side={side()}
					onInteractOutside={(e) => {
						if (!closeOnOverlay()) {
							e.preventDefault()
							return
						}
						// allow default so Kobalte emits onOpenChange(false)
						setCancelReason()
					}}
					{...others}
				>
					{/* Header bar for top-end / top-start: inline buttons to avoid nested Show-in-function issues */}
					<Show when={actionsPosition() === 'top-end' || actionsPosition() === 'top-start'}>
						<div class={cn('flex shrink-0 items-center gap-2 border-b border-surface-border px-6 py-4', actionsPosition() === 'top-start' ? 'justify-start' : 'justify-end')}>
							<Show when={showCancel()}>
								<KobalteDialog.CloseButton
									as={Button}
									variant="ghost"
									size="sm"
									onClick={setCancelReason}
								>
									{local.cancelLabel ?? 'Cancel'}
								</KobalteDialog.CloseButton>
							</Show>
							<Show when={local.onSave}>
								<Button variant="primary" size="sm" class="rounded-lg" onClick={local.onSave}>
									{local.saveLabel ?? 'Save'}
								</Button>
							</Show>
							<Show when={canClose() && local.showCloseButton !== false}>
								<KobalteDialog.CloseButton
									aria-label="Close"
									class="flex h-9 w-9 items-center justify-center rounded-full bg-surface-overlay text-ink-500 hover:bg-surface-dim hover:text-ink-700"
									onClick={setCloseReason}
								>
									{closeButtonEl()}
								</KobalteDialog.CloseButton>
							</Show>
						</div>
					</Show>

					<div class={cn('relative flex flex-1 flex-col overflow-hidden', !local.noPadding && 'p-6')}>
						{/* Close button in content area when actions are at bottom */}
						<Show when={actionsPosition() === 'bottom' && canClose() && local.showCloseButton !== false}>
							<KobalteDialog.CloseButton
								aria-label="Close"
								class="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-surface-overlay text-ink-500 hover:bg-surface-dim hover:text-ink-700"
								onClick={setCloseReason}
							>
								{closeButtonEl()}
							</KobalteDialog.CloseButton>
						</Show>
						<div class={cn('flex min-h-0 flex-1 flex-col overflow-y-auto', actionsPosition() === 'bottom' && canClose() && local.showCloseButton !== false && 'pr-10', hasFooter() && actionsPosition() === 'bottom' && 'min-h-0', local.contentClass)}>
							{local.children}
						</div>
					</div>

					<Show when={actionsPosition() === 'bottom' && hasFooter()}>
						<div class="flex shrink-0 items-center justify-end gap-3 border-t border-surface-border px-6 py-4">
							{actionsBlock()}
						</div>
					</Show>
				</KobalteDialog.Content>
			</KobalteDialog.Portal>
		</KobalteDialog>
	)
}
