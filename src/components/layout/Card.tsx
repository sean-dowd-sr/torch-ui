import type { JSX, ParentComponent } from 'solid-js'
import { splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { Avatar } from '../data-display/Avatar'
import { cn } from '../../utilities/classNames'

const cardBase =
	'rounded-xl border border-surface-border bg-surface-raised shadow-sm dark:text-ink-100'

export interface CardProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	children: JSX.Element
	/** Horizontal layout: image (or first block) on the left, content on the right. Use with Card.Image (horizontal) + Card.Content. */
	horizontal?: boolean
}

export type CardComponent = ParentComponent<CardProps> & {
	Header: typeof CardHeader
	Image: typeof CardImage
	AvatarTitle: typeof CardAvatarTitle
	Content: typeof CardContent
	Body: typeof CardBody
}

/** Card root: rounded border, background, optional horizontal layout. Use with Card.Header, Card.Image, Card.AvatarTitle, Card.Body, Card.Content. */
export const Card: CardComponent = (props) => {
	const [local, others] = splitProps(props, ['children', 'horizontal', 'class', 'ref'])
	return (
		<div
			ref={local.ref}
			class={cn(
				cardBase,
				local.horizontal ? 'flex flex-row overflow-hidden' : 'flex flex-col',
				local.class,
			)}
			{...others}
		>
			{local.children}
		</div>
	)
}

export interface CardHeaderProps {
	title: string
	/** Optional action (e.g. button) on the right. */
	action?: JSX.Element
	/** Heading element to render. Default 'h3'. Use to maintain proper document outline in different contexts. */
	as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
	class?: string
}

/** Card header: title and optional action. Renders a bordered bottom. */
export function CardHeader(props: CardHeaderProps): JSX.Element {
	const headingTag = () => props.as ?? 'h3'
	return (
		<div
			class={cn(
				'flex shrink-0 items-center justify-between gap-3 border-b border-surface-border px-6 py-4',
				props.class,
			)}
		>
			<Dynamic
				component={headingTag()}
				class="text-base font-semibold text-ink-900 dark:text-ink-100"
			>
				{props.title}
			</Dynamic>
			{props.action}
		</div>
	)
}

export interface CardImageProps {
	src: string
	alt: string
	/** Use for horizontal cards so the image has a fixed width and doesn't stretch. */
	horizontal?: boolean
	class?: string
	imgClass?: string
}

/** Full-width image at top (or left when horizontal). Use horizontal=true inside a Card with horizontal. */
export function CardImage(props: CardImageProps): JSX.Element {
	return (
		<div
			class={cn(
				'shrink-0 overflow-hidden',
				props.horizontal ? 'w-36 self-stretch' : 'w-full rounded-t-xl',
				props.class,
			)}
		>
			<img
				src={props.src}
				alt={props.alt}
				class={cn(
					'object-cover',
					props.horizontal ? 'h-full min-h-0 w-full' : 'h-auto w-full',
					props.imgClass,
				)}
			/>
		</div>
	)
}

export interface CardAvatarTitleProps {
	/** Display name shown next to the avatar. */
	name: string
	/** Optional image URL for the avatar. */
	imageUrl?: string | null
	/** Avatar size. */
	avatarSize?: 'sm' | 'md'
	class?: string
}

/** Row with Avatar and name. Use for "card with avatar and user name". */
export function CardAvatarTitle(props: CardAvatarTitleProps): JSX.Element {
	return (
		<div
			class={cn(
				'flex shrink-0 items-center gap-3 px-6 pt-4 pb-0',
				props.class,
			)}
		>
			<Avatar
				name={props.name}
				imageUrl={props.imageUrl}
				size={props.avatarSize ?? 'md'}
			/>
			<span class="font-medium text-ink-900 dark:text-ink-100">
				{props.name}
			</span>
		</div>
	)
}

export interface CardContentProps {
	children: JSX.Element
	/** Use when card is horizontal so this block fills the remaining space. */
	class?: string
}

/** Wrapper for the main content column. Use as the second child in horizontal cards (after Card.Image) so content fills remaining space. */
export const CardContent: ParentComponent<CardContentProps> = (props) => {
	return (
		<div class={cn('flex min-w-0 flex-1 flex-col', props.class)}>
			{props.children}
		</div>
	)
}

export interface CardBodyProps {
	children: JSX.Element
	class?: string
}

/** Card body: padded content area. */
export const CardBody: ParentComponent<CardBodyProps> = (props) => {
	return (
		<div class={cn('flex-1 p-6 sm:p-8', props.class)}>{props.children}</div>
	)
}

Card.Header = CardHeader
Card.Image = CardImage
Card.AvatarTitle = CardAvatarTitle
Card.Content = CardContent
Card.Body = CardBody
