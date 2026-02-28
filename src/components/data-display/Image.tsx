import { type JSX, Show, splitProps, createSignal, onCleanup, createEffect } from 'solid-js'
import { Image as KobalteImage } from '@kobalte/core/image'
import { cn } from '../../utilities/classNames'

export interface ImageProps extends Omit<JSX.ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
	/** Image source URL */
	src: string
	/** Alternative text for accessibility */
	alt: string
	/** Fallback source to try if main src fails */
	fallbackSrc?: string
	/** Show loading skeleton while image loads */
	showSkeleton?: boolean
	/** Custom fallback content (overrides skeleton) */
	fallback?: JSX.Element
	/** Delay before showing fallback to avoid flash */
	fallbackDelay?: number
	/** Aspect ratio class (e.g. 'aspect-square', 'aspect-video') */
	aspectRatio?: string
	/** Object fit class */
	objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
	/** Intuitive scaling aliases - easier to remember than objectFit */
	scale?: 'contain' | 'cover' | 'stretch' | 'none' | 'scale-down' | 'portrait' | 'landscape' | 'square'
	/** Smart scaling constraints */
	scalingConstraints?: {
		/** Maximum width the image should scale to */
		maxWidth?: string
		/** Maximum height the image should scale to */
		maxHeight?: string
	}
	/** Object position class */
	objectPosition?: string
	/** Border radius class */
	rounded?: string
	/** Whether to lazy load the image */
	lazy?: boolean
	/** Content to overlay on top of the image */
	overlay?: JSX.Element
	/** Overlay position class */
	overlayPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'full'
	/** Show overlay on hover only */
	overlayOnHover?: boolean
	/** Callback when image loads successfully */
	onLoad?: () => void
	/** Callback when image fails to load */
	onError?: () => void
}

/**
 * Image component with loading states, error handling, and accessibility features.
 * Built on top of Kobalte's Image primitive for enhanced accessibility.
 */
export function Image(props: ImageProps) {
	const [local, others] = splitProps(props, [
		'src',
		'alt',
		'fallbackSrc',
		'showSkeleton',
		'fallback',
		'fallbackDelay',
		'aspectRatio',
		'objectFit',
		'scale',
		'scalingConstraints',
		'objectPosition',
		'rounded',
		'lazy',
		'overlay',
		'overlayPosition',
		'overlayOnHover',
		'onLoad',
		'onError',
		'class',
	])

	const [showFallback, setShowFallback] = createSignal(false)
	const [imageLoaded, setImageLoaded] = createSignal(false)
	const [activeSrc, setActiveSrc] = createSignal(local.src)
	const [hasTriedFallback, setHasTriedFallback] = createSignal(false)
	let fallbackTimeout: ReturnType<typeof setTimeout> | undefined

	// React to src prop changes
	createEffect(() => {
		const newSrc = local.src
		setActiveSrc(newSrc)
		setImageLoaded(false)
		setShowFallback(false)
		setHasTriedFallback(false)
		
		// Clear any pending timeout when src changes
		if (fallbackTimeout) {
			clearTimeout(fallbackTimeout)
			fallbackTimeout = undefined
		}
	})

	// Cleanup timeout on unmount
	onCleanup(() => {
		if (fallbackTimeout) {
			clearTimeout(fallbackTimeout)
		}
	})

	// Scaling logic - convert scale aliases to object-fit values
	const effectiveObjectFit = () => {
		// Priority: scale > objectFit
		if (local.scale) {
			return mapScaleToObjectFit(local.scale)
		}
		
		return local.objectFit
	}

	const mapScaleToObjectFit = (scale: 'contain' | 'cover' | 'stretch' | 'none' | 'scale-down' | 'portrait' | 'landscape' | 'square'): 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' => {
		switch (scale) {
			case 'stretch':
				return 'fill'
			case 'portrait':
				return 'cover' // Typically want to cover portrait area
			case 'landscape':
				return 'contain' // Typically want to contain landscape
			case 'square':
				return 'cover' // Force to fill square area
			default:
				return scale
		}
	}

	// Generate inline styles for constraints (Tailwind JIT won't see dynamic classes)
	const constraintStyles = () => {
		if (!local.scalingConstraints) return {}
		
		const styles: JSX.CSSProperties = {}
		if (local.scalingConstraints.maxWidth) {
			styles['max-width'] = local.scalingConstraints.maxWidth
		}
		if (local.scalingConstraints.maxHeight) {
			styles['max-height'] = local.scalingConstraints.maxHeight
		}
		
		return styles
	}

	const handleLoad = () => {
		setImageLoaded(true)
		setShowFallback(false)
		if (fallbackTimeout) {
			clearTimeout(fallbackTimeout)
			fallbackTimeout = undefined
		}
		local.onLoad?.()
	}

	const handleError = () => {
		// Try fallback source if available and we haven't tried it yet
		if (local.fallbackSrc && !hasTriedFallback() && activeSrc() !== local.fallbackSrc) {
			setHasTriedFallback(true)
			setImageLoaded(false)  // Reset loading state for proper transitions
			setShowFallback(false) // Hide fallback UI while fallback loads
			setActiveSrc(local.fallbackSrc)
			// Let the image try loading the fallback
			return
		}

		// Show fallback after delay (applies to both custom and default fallback)
		if (local.fallbackDelay) {
			fallbackTimeout = setTimeout(() => setShowFallback(true), local.fallbackDelay)
		} else {
			setShowFallback(true)
		}
		local.onError?.()
	}

	const containerClass = () =>
		cn(
			'relative overflow-hidden',
			local.overlayOnHover && 'group',
			local.aspectRatio || 'w-full h-auto',
			local.rounded || 'rounded-lg',
			local.class
		)

	const imageClass = () => {
		const fit = effectiveObjectFit()
		return cn(
			'w-full h-full transition-opacity duration-300',
			imageLoaded() ? 'opacity-100' : 'opacity-0',
			fit && `object-${fit}`,
			local.objectPosition
		)
	}

	const skeletonClass = () =>
		cn(
			'absolute inset-0 bg-ink-200 dark:bg-ink-800 animate-pulse',
			local.rounded || 'rounded-lg'
		)

	const overlayPositionClass = () => {
		const position = local.overlayPosition || 'bottom-right'
		const baseClasses = 'absolute pointer-events-none'
		
		switch (position) {
			case 'top-left':
				return `${baseClasses} top-2 left-2`
			case 'top-right':
				return `${baseClasses} top-2 right-2`
			case 'bottom-left':
				return `${baseClasses} bottom-2 left-2`
			case 'bottom-right':
				return `${baseClasses} bottom-2 right-2`
			case 'center':
				return `${baseClasses} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`
			case 'full':
				return 'absolute inset-0'
			default:
				return `${baseClasses} bottom-2 right-2`
		}
	}

	const overlayClass = () =>
		cn(
			overlayPositionClass(),
			local.overlayOnHover && 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
			!local.overlayOnHover && 'opacity-100'
		)

	return (
		<div class={containerClass()} style={constraintStyles()}>
			{/* Independent skeleton overlay - shows during initial load and fallback retry */}
			<Show when={local.showSkeleton && !imageLoaded() && !showFallback()}>
				<div class={skeletonClass()} />
			</Show>
			
			<KobalteImage>
				<KobalteImage.Img
					{...others}
					src={activeSrc()}
					alt={local.alt}
					loading={local.lazy ? 'lazy' : 'eager'}
					class={imageClass()}
					onLoad={handleLoad}
					onError={handleError}
				/>
				<KobalteImage.Fallback>
					<Show when={showFallback()}>
						{local.fallback || (
							<div class="flex items-center justify-center w-full h-full bg-surface-dim border border-surface-border">
								<div class="text-center p-4">
									<svg class="w-12 h-12 mx-auto mb-2 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
									<p class="text-sm text-ink-500 dark:text-ink-400">Failed to load image</p>
								</div>
							</div>
						)}
					</Show>
				</KobalteImage.Fallback>
			</KobalteImage>
			<Show when={local.overlay && imageLoaded()}>
				<div class={overlayClass()}>
					{local.overlay}
				</div>
			</Show>
		</div>
	)
}
