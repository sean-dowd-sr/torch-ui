import { createSignal, createMemo, Show, For, splitProps, createEffect } from 'solid-js'
import { Pipette, X } from 'lucide-solid'
import { Popover as KobaltePopover } from '@kobalte/core/popover'
import { ColorArea as KobalteColorArea } from '@kobalte/core/color-area'
import { ColorSlider as KobalteColorSlider } from '@kobalte/core/color-slider'
import { ColorChannelField as KobalteColorChannelField } from '@kobalte/core/color-channel-field'
import { parseColor as KobalteParseColor } from '@kobalte/core/colors'
import type { Color as KobalteColor } from '@kobalte/core/colors'
import { Button } from '../../actions'
import { cn } from '../../lib/cn'
import { normalizeHex, hexToHslString, rgbaToHex } from './color-utils'

const DEFAULT_PRESETS = [
	'#000000',
	'#374151',
	'#6b7280',
	'#9ca3af',
	'#d1d5db',
	'#ffffff',
	'#ef4444',
	'#f97316',
	'#eab308',
	'#22c55e',
	'#3b82f6',
	'#8b5cf6',
	'#ec4899',
] as const

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsb'

export interface ColorPickerProps {
	/** Current value as hex (e.g. #3b82f6). */
	value?: string
	onValueChange?: (hex: string) => void
	/** Preset hex colors shown as swatches. Defaults to a built-in set. */
	presets?: string[]
	/** Optional label above the control. */
	label?: string
	/** If true, only show the trigger + modal (no preset strip). */
	compact?: boolean
	disabled?: boolean
	class?: string
	/** Max number of "last used" colors to keep. 0 to hide. Default 9. */
	lastUsedCount?: number
	/** Which format(s) to show in the custom panel. Default ['hex']. Use more for Hex/RGB/HSL/HSB tabs. */
	allowedFormats?: ColorFormat[]
	/** Predefined hex colors shown at the bottom of the custom panel, below last used. Use for theme presets etc. */
	predefined?: string[]
}

/** Returns 6-digit hex only. Used for Apply and public value (alpha not persisted). */
function colorToHex(c: KobalteColor): string {
	const rgb = c.toFormat('rgb')
	const r = Math.round(rgb.getChannelValue('red'))
	const g = Math.round(rgb.getChannelValue('green'))
	const b = Math.round(rgb.getChannelValue('blue'))
	return rgbaToHex(r, g, b, 1)
}

function safeParseColor(hex: string): KobalteColor {
	const normalized = normalizeHex(hex)
	if (!normalized) return KobalteParseColor('#000000')
	try {
		return KobalteParseColor(hexToHslString(normalized))
	} catch {
		return KobalteParseColor('#000000')
	}
}

export function ColorPicker(props: ColorPickerProps) {
	const [local, rest] = splitProps(props, [
		'value',
		'onValueChange',
		'presets',
		'label',
		'compact',
		'disabled',
		'class',
		'lastUsedCount',
		'allowedFormats',
		'predefined',
	])

	const presets = () => local.presets ?? [...DEFAULT_PRESETS]
	const lastUsedMax = () => local.lastUsedCount ?? 9

	const [customOpen, setCustomOpen] = createSignal(false)
	const [lastUsed, setLastUsed] = createSignal<string[]>([])

	const currentHex = () => {
		const v = local.value?.trim()
		if (!v) return ''
		return normalizeHex(v)
	}

	const addToLastUsed = (hex: string) => {
		const n = normalizeHex(hex)
		if (!n) return
		setLastUsed((prev) => {
			const next = [n, ...prev.filter((c) => c !== n)].slice(0, lastUsedMax())
			return next
		})
	}

	const handlePresetClick = (hex: string) => {
		const n = normalizeHex(hex)
		if (n) {
			local.onValueChange?.(n)
			addToLastUsed(n)
		}
	}

	const handleCustomApply = (hex: string) => {
		const n = normalizeHex(hex)
		if (!n) return
		local.onValueChange?.(n)
		addToLastUsed(n)
		setCustomOpen(false)
	}

	const presetSet = createMemo(() => new Set(presets().map(normalizeHex).filter(Boolean)))
	const isPreset = (hex: string) => presetSet().has(normalizeHex(hex))

	return (
		<div class={cn('w-full', local.class)} {...rest}>
			<Show when={local.label}>
				<label class="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">{local.label}</label>
			</Show>

			<div class="flex flex-wrap items-center gap-2">
				{/* Current color swatch + trigger for custom */}
				<KobaltePopover open={customOpen()} onOpenChange={setCustomOpen}>
					<KobaltePopover.Trigger
						as="button"
						type="button"
						disabled={local.disabled}
						class={cn(
							'h-10 w-10 shrink-0 rounded-lg border-2 border-surface-border shadow-sm transition hover:border-ink-300 dark:hover:border-ink-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 focus:ring-offset-surface-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
						)}
						style={{ 'background-color': currentHex() || 'transparent' }}
						title="Choose color"
						aria-label="Choose color"
					/>
					<KobaltePopover.Portal>
						<KobaltePopover.Content
							class="z-[200] outline-none"
						>
							<ColorPickerCustomPanel
								value={currentHex()}
								isOpen={customOpen()}
								onApply={handleCustomApply}
								onCancel={() => setCustomOpen(false)}
								lastUsed={lastUsed()}
								onLastUsedClick={(hex) => {
									handleCustomApply(hex)
								}}
								allowedFormats={local.allowedFormats ?? ['hex']}
								predefined={local.predefined}
							/>
						</KobaltePopover.Content>
					</KobaltePopover.Portal>
				</KobaltePopover>

				<Show when={!local.compact}>
					{/* Preset swatches */}
					<div class="flex flex-wrap gap-1.5">
						<For each={presets()}>
							{(hex) => (
								<button
									type="button"
									class={cn(
										'h-8 w-8 shrink-0 rounded-full border-2 shadow-sm transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500',
										normalizeHex(hex) === currentHex()
											? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-500/30'
											: 'border-surface-border hover:border-ink-300 dark:hover:border-ink-600',
									)}
									style={{ 'background-color': hex }}
									title={hex}
									aria-label={`Set color to ${hex}`}
									onClick={() => handlePresetClick(hex)}
									disabled={local.disabled}
								/>
							)}
						</For>
						{/* Custom button */}
						<button
							type="button"
							class={cn(
								'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-ink-300 dark:border-ink-600 bg-ink-50 dark:bg-ink-800 text-ink-500 dark:text-ink-400 transition hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:bg-primary-500/20 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500',
								!isPreset(currentHex()) && currentHex()
									? 'border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400'
									: '',
							)}
							title="Custom color"
							aria-label="Custom color"
							onClick={() => setCustomOpen(true)}
							disabled={local.disabled}
						>
							<Pipette class="h-4 w-4" />
						</button>
					</div>
				</Show>
			</div>
		</div>
	)
}

/** Matches 3, 6, or 8 digit hex (with optional leading #). 8-digit = #RRGGBBAA (CSS Color Level 4). */
function isValidHex(v: string): boolean {
	const hex = v.trim().replace(/^#/, '')
	return /^[0-9a-fA-F]{3}$/.test(hex) || /^[0-9a-fA-F]{6}$/.test(hex) || /^[0-9a-fA-F]{8}$/.test(hex)
}

interface ColorPickerCustomPanelProps {
	value: string
	/** When true, panel is visible. Used to sync color from value when popover opens. */
	isOpen?: boolean
	onApply: (hex: string) => void
	onCancel: () => void
	lastUsed: string[]
	onLastUsedClick: (hex: string) => void
	allowedFormats: ColorFormat[]
	/** Predefined colors shown below last used. */
	predefined?: string[]
}

function ColorPickerCustomPanel(props: ColorPickerCustomPanelProps) {
	const formats = () => props.allowedFormats
	const defaultFormat = () => (formats().includes('hex') ? 'hex' : formats()[0] ?? 'hex')
	const [format, setFormat] = createSignal<ColorFormat>(defaultFormat())

	// Reset format if current selection is no longer in allowedFormats
	createEffect(() => {
		if (!props.allowedFormats.includes(format())) setFormat(defaultFormat())
	})

	const initialColor = () => {
		const v = props.value
		if (v && isValidHex(v)) return safeParseColor(normalizeHex(v))
		return KobalteParseColor('#000000')
	}

	const [color, setColor] = createSignal<KobalteColor>(initialColor())
	const [hexText, setHexText] = createSignal(colorToHex(initialColor()))
	let prevOpen = false

	// When popover opens (false -> true), sync panel color from current value so it shows the selected color
	createEffect(() => {
		const open = props.isOpen ?? false
		if (open && !prevOpen && props.value && isValidHex(props.value)) {
			const c = safeParseColor(normalizeHex(props.value))
			setColor(c)
			setHexText(colorToHex(c))
		}
		prevOpen = open
	})

	const hex = () => colorToHex(color())

	// Sync hexText when color changes via area/slider/channel fields (not hex input)
	createEffect(() => { setHexText(hex()) })

	const formatTabs: { id: ColorFormat; label: string }[] = [
		{ id: 'hex', label: 'Hex' },
		{ id: 'rgb', label: 'RGB' },
		{ id: 'hsl', label: 'HSL' },
		{ id: 'hsb', label: 'HSB' },
	]
	const visibleFormatTabs = () => formatTabs.filter((tab) => props.allowedFormats.includes(tab.id))
	const showFormatTabs = () => visibleFormatTabs().length > 1

	return (
		<div class="w-[320px] overflow-hidden rounded-xl border border-surface-border bg-surface-raised p-4 shadow-xl">
			<div class="mb-3 flex items-center justify-between">
				<span class="text-sm font-semibold text-ink-900 dark:text-ink-100">Color Picker</span>
				<button
					type="button"
					class="rounded p-1 text-ink-400 dark:text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-200 hover:text-ink-600 dark:hover:text-ink-200"
					onClick={props.onCancel}
					aria-label="Close"
				>
					<X class="h-4 w-4" />
				</button>
			</div>

			{/* 2D saturation/brightness area (HSB). Use Kobalte default gradient so brightness (dark/light) axis matches interaction. */}
			<div class="mb-3">
				<KobalteColorArea
					value={color()}
					onChange={setColor}
					colorSpace="hsb"
					xChannel="saturation"
					yChannel="brightness"
					class="relative block w-full"
				>
					<KobalteColorArea.Background class="relative block h-32 w-full rounded-lg border border-surface-border cursor-crosshair touch-none" />
					<KobalteColorArea.Thumb class="pointer-events-none absolute h-4 w-4 rounded-full border-2 border-white dark:border-ink-200 shadow-md [transform:translate(-50%,-50%)]">
						<KobalteColorArea.HiddenInputX />
						<KobalteColorArea.HiddenInputY />
					</KobalteColorArea.Thumb>
				</KobalteColorArea>
			</div>

			{/* Hue slider */}
			<div class="mb-3">
				<KobalteColorSlider channel="hue" value={color()} onChange={setColor} colorSpace="hsb">
					<KobalteColorSlider.Track class="relative block h-6 w-full rounded-full border border-surface-border cursor-pointer touch-none">
						<KobalteColorSlider.Thumb class="absolute h-6 w-6 rounded-full border-2 border-white dark:border-ink-200 shadow [transform:translate(-50%,-50%)] touch-none">
							<KobalteColorSlider.Input class="sr-only" />
						</KobalteColorSlider.Thumb>
					</KobalteColorSlider.Track>
				</KobalteColorSlider>
			</div>

			{/* Format tabs (only when more than one format allowed) */}
			<Show when={showFormatTabs()}>
				<div class="mb-3 flex gap-1 rounded-lg bg-ink-100 dark:bg-ink-200 p-1">
					<For each={visibleFormatTabs()}>
						{(tab) => (
							<button
								type="button"
								class={cn(
									'flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition',
									format() === tab.id
										? 'bg-surface-raised text-ink-900 dark:text-ink-100 shadow-sm'
										: 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100',
								)}
								onClick={() => setFormat(tab.id)}
							>
								{tab.label}
							</button>
						)}
					</For>
				</div>
			</Show>

			{/* Channel fields based on format */}
			<div class="mb-4 flex flex-wrap items-center gap-2">
				<Show when={format() === 'hex'}>
					<div class="flex flex-1 items-center gap-2">
						<Pipette class="h-4 w-4 shrink-0 text-ink-400 dark:text-ink-500" aria-hidden="true" />
						<input
							type="text"
							value={hexText()}
							onInput={(e) => {
								const v = (e.target as HTMLInputElement).value
								setHexText(v)
								if (isValidHex(v)) setColor(safeParseColor(v))
							}}
							aria-label="Hex color value"
							class="w-full rounded-lg border border-surface-border bg-surface-raised px-2 py-1.5 font-mono text-sm text-ink-900 dark:text-ink-100"
						/>
					</div>
				</Show>
				<Show when={format() === 'hsl'}>
					<KobalteColorChannelField value={color()} onChange={setColor} channel="hue" colorSpace="hsl">
						<div class="flex items-center gap-1">
							<KobalteColorChannelField.Label class="sr-only">H</KobalteColorChannelField.Label>
							<KobalteColorChannelField.Input class="w-14 rounded border border-surface-border bg-surface-raised px-1.5 py-1 text-sm text-ink-900 dark:text-ink-100" />
						</div>
					</KobalteColorChannelField>
					<KobalteColorChannelField value={color()} onChange={setColor} channel="saturation" colorSpace="hsl">
						<div class="flex items-center gap-1">
							<KobalteColorChannelField.Label class="sr-only">S</KobalteColorChannelField.Label>
							<KobalteColorChannelField.Input class="w-14 rounded border border-surface-border bg-surface-raised px-1.5 py-1 text-sm text-ink-900 dark:text-ink-100" />
						</div>
					</KobalteColorChannelField>
					<KobalteColorChannelField value={color()} onChange={setColor} channel="lightness" colorSpace="hsl">
						<div class="flex items-center gap-1">
							<KobalteColorChannelField.Label class="sr-only">L</KobalteColorChannelField.Label>
							<KobalteColorChannelField.Input class="w-14 rounded border border-surface-border bg-surface-raised px-1.5 py-1 text-sm text-ink-900 dark:text-ink-100" />
						</div>
					</KobalteColorChannelField>
				</Show>
				<Show when={format() === 'rgb'}>
					<KobalteColorChannelField value={color()} onChange={setColor} channel="red" colorSpace="rgb">
						<div class="flex items-center gap-1">
							<KobalteColorChannelField.Label class="sr-only">R</KobalteColorChannelField.Label>
							<KobalteColorChannelField.Input class="w-14 rounded border border-surface-border bg-surface-raised px-1.5 py-1 text-sm text-ink-900 dark:text-ink-100" />
						</div>
					</KobalteColorChannelField>
					<KobalteColorChannelField value={color()} onChange={setColor} channel="green" colorSpace="rgb">
						<div class="flex items-center gap-1">
							<KobalteColorChannelField.Label class="sr-only">G</KobalteColorChannelField.Label>
							<KobalteColorChannelField.Input class="w-14 rounded border border-surface-border bg-surface-raised px-1.5 py-1 text-sm text-ink-900 dark:text-ink-100" />
						</div>
					</KobalteColorChannelField>
					<KobalteColorChannelField value={color()} onChange={setColor} channel="blue" colorSpace="rgb">
						<div class="flex items-center gap-1">
							<KobalteColorChannelField.Label class="sr-only">B</KobalteColorChannelField.Label>
							<KobalteColorChannelField.Input class="w-14 rounded border border-surface-border bg-surface-raised px-1.5 py-1 text-sm text-ink-900 dark:text-ink-100" />
						</div>
					</KobalteColorChannelField>
				</Show>
				<Show when={format() === 'hsb'}>
					<KobalteColorChannelField value={color()} onChange={setColor} channel="hue" colorSpace="hsb">
						<div class="flex items-center gap-1">
							<KobalteColorChannelField.Label class="sr-only">H</KobalteColorChannelField.Label>
							<KobalteColorChannelField.Input class="w-14 rounded border border-surface-border bg-surface-raised px-1.5 py-1 text-sm text-ink-900 dark:text-ink-100" />
						</div>
					</KobalteColorChannelField>
					<KobalteColorChannelField value={color()} onChange={setColor} channel="saturation" colorSpace="hsb">
						<div class="flex items-center gap-1">
							<KobalteColorChannelField.Label class="sr-only">S</KobalteColorChannelField.Label>
							<KobalteColorChannelField.Input class="w-14 rounded border border-surface-border bg-surface-raised px-1.5 py-1 text-sm text-ink-900 dark:text-ink-100" />
						</div>
					</KobalteColorChannelField>
					<KobalteColorChannelField value={color()} onChange={setColor} channel="brightness" colorSpace="hsb">
						<div class="flex items-center gap-1">
							<KobalteColorChannelField.Label class="sr-only">B</KobalteColorChannelField.Label>
							<KobalteColorChannelField.Input class="w-14 rounded border border-surface-border bg-surface-raised px-1.5 py-1 text-sm text-ink-900 dark:text-ink-100" />
						</div>
					</KobalteColorChannelField>
				</Show>
			</div>

			{/* Last used */}
			<Show when={props.lastUsed.length > 0}>
				<div class="mb-4">
					<p class="mb-1.5 text-xs font-medium text-ink-500 dark:text-ink-400">Last used</p>
					<div class="flex flex-wrap gap-1.5">
						<For each={props.lastUsed}>
							{(hex) => (
								<button
									type="button"
									class="h-7 w-7 shrink-0 rounded-md border border-surface-border shadow-sm transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500"
									style={{ 'background-color': hex }}
									title={hex}
									aria-label={`Set color to ${hex}`}
									onClick={() => props.onLastUsedClick(hex)}
								/>
							)}
						</For>
					</div>
				</div>
			</Show>

			{/* Predefined (e.g. theme presets) */}
			<Show when={props.predefined && props.predefined.length > 0}>
				<div class="mb-4">
					<p class="mb-1.5 text-xs font-medium text-ink-500 dark:text-ink-400">Presets</p>
					<div class="flex flex-wrap gap-1.5">
						<For each={props.predefined!}>
							{(hex) => (
								<button
									type="button"
									class="h-7 w-7 shrink-0 rounded-md border border-surface-border shadow-sm transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500"
									style={{ 'background-color': hex }}
									title={hex}
									aria-label={`Set color to ${hex}`}
									onClick={() => { const n = normalizeHex(hex); if (n) props.onApply(n) }}
								/>
							)}
						</For>
					</div>
				</div>
			</Show>

			<div class="flex justify-end gap-2">
				<Button variant="outlined" size="sm" onClick={props.onCancel}>
					Cancel
				</Button>
				<Button variant="primary" size="sm" onClick={() => props.onApply(hex())} aria-label="Apply selected color">
					Apply
				</Button>
			</div>
		</div>
	)
}
