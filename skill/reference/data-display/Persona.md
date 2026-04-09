# Persona

**Category:** data-display
**Import:** `@torch-ui/solid/data-display`
**Source:** `src/components/data-display/Persona.tsx`

## Exports

```ts
import {
  Persona,
  type PersonaProps
} from "@torch-ui/solid/data-display";
```

## Props

```ts
export interface PersonaProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Display name (primary text); also used for avatar initials. */
	name: string
	/** Optional image URL for the avatar. */
	imageUrl?: string | null
	/** Optional secondary line (e.g. role, email). */
	secondary?: string
	/** Avatar and text size. Default: md. */
	size?: SizeKey
	/** Avatar shape passed through to Avatar. Default: circle. */
	shape?: AvatarShape
	/** Avatar color passed through to Avatar. Default: neutral. */
	color?: AvatarColor
	/** Optional content after the text block (e.g. actions). */
	children?: JSX.Element
}
```
