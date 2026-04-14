export { B as BlockQuote, a as BlockQuoteJustify, b as BlockQuoteProps } from '../BlockQuote-BKLW0_Mz.js';
import { JSX } from 'solid-js';

type InlineProps = JSX.HTMLAttributes<HTMLElement> & {
    block?: false;
};
type BlockProps = JSX.HTMLAttributes<HTMLDivElement> & {
    block: true;
};
type Copyable = {
    copyable: true;
    text: string;
};
type NotCopyable = {
    copyable?: false;
    text?: string;
};
type BaseProps = {
    /** Inline or single-line code. */
    children?: JSX.Element;
    /** Optional class. */
    class?: string;
} & (Copyable | NotCopyable);
type CodeProps = (InlineProps | BlockProps) & BaseProps;
/**
 * Inline or single-line code. Use for variable names, commands, or short snippets in text.
 * Set block to get a one-line block with optional copy button.
 */
declare function Code(props: CodeProps): JSX.Element;

interface IconProps extends Omit<JSX.ImgHTMLAttributes<HTMLImageElement>, 'children' | 'width' | 'height'> {
    /** Image URL (local path or CDN). */
    src: string;
    /** Size in pixels (sets both width and height). Default: 16. */
    size?: number;
}
/**
 * Renders a custom icon image with consistent sizing and styling.
 * Point src at a local asset or CDN URL.
 *
 * Decorative by default (`alt=""`, `aria-hidden="true"`). To make the icon
 * meaningful to screen readers, pass both `alt="description"` and
 * `aria-hidden="false"` — the spread overrides both defaults.
 *
 * <Icon src="/images/icons/solid.svg" size={20} />
 */
declare function Icon(props: IconProps): JSX.Element;

export { Code, type CodeProps, Icon, type IconProps };
