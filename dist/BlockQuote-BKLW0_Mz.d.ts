import { JSX } from 'solid-js';

type BlockQuoteJustify = 'start' | 'center' | 'end';
interface BlockQuoteProps {
    /** Quote content (paragraph(s) or text). */
    children: JSX.Element | string;
    /** Optional attribution (e.g. "— Author Name"). Rendered in a footer. */
    citation?: string | JSX.Element;
    /** Optional cite URL for the blockquote source. Maps to the cite attribute on <blockquote>. */
    cite?: string;
    /** Optional icon shown at the start of the quote. */
    icon?: JSX.Element;
    /** Optional avatar (e.g. Avatar or img) shown to the left of the quote. */
    avatar?: JSX.Element;
    /** Text alignment: start (left), center, or end (right). Default: start. */
    justify?: BlockQuoteJustify;
    /** When true, omit the left border. Default: false. */
    noBorder?: boolean;
    /** Optional class for the blockquote root. */
    class?: string;
}
/** Semantic blockquote with optional icon, avatar, citation, and justification. */
declare function BlockQuote(props: BlockQuoteProps): JSX.Element;

export { BlockQuote as B, type BlockQuoteJustify as a, type BlockQuoteProps as b };
