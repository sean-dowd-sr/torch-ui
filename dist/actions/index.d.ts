import * as solid_js from 'solid-js';
import { JSX } from 'solid-js';
import { C as ComponentSize } from '../component-size-BIaRRIRi.js';
import { DropdownMenuRootProps } from '@kobalte/core/dropdown-menu';

type ButtonVariant = 'primary' | 'primary-outline' | 'secondary' | 'outlined' | 'ghost' | 'link' | 'danger' | 'danger-outline' | 'danger-link' | 'success' | 'success-outline' | 'warning' | 'warning-outline' | 'info' | 'info-outline';
interface ButtonProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement> & JSX.AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'onChange' | 'shape'> {
    /** Visual style of the button. Default: "primary" */
    variant?: ButtonVariant;
    /** Button size. Default: "md" */
    size?: ComponentSize;
    /** Stretch to fill the parent width. */
    fullWidth?: boolean;
    /** Show a spinner and disable interaction. */
    loading?: boolean;
    /** Remove the subtle box-shadow on filled variants. */
    disableElevation?: boolean;
    /** Render as a square icon-only button (uses `icon` or `startIcon`). */
    iconOnly?: boolean;
    /** Corner radius. Default: "rounded" (or "circle" when iconOnly). */
    radius?: 'circle' | 'rounded' | 'square';
    /** Icon element for icon-only mode. Falls back to `startIcon`. */
    icon?: JSX.Element;
    /** Icon placed before the label. */
    startIcon?: JSX.Element;
    /** Icon placed after the label. */
    endIcon?: JSX.Element;
    /** Text label. When set, takes priority over `children`. */
    label?: string;
    /** When set, renders as an anchor (`<a>`) with button styling. */
    href?: string;
    /** Controlled pressed state for toggle mode (requires `onValueChange`). */
    pressed?: boolean;
    /** Toggle callback. Setting both `pressed` and `onValueChange` enables toggle mode. */
    onValueChange?: (pressed: boolean) => void;
    children?: JSX.Element;
}
/**
 * Polymorphic button: renders as a standard button, anchor link, or toggle
 * depending on props. Supports loading spinners, icons, and multiple variants.
 */
declare function Button(props: ButtonProps): JSX.Element;

interface ToggleGroupOption {
    /** Value passed to `onChange` when this option is selected. */
    value: string;
    /** Display text rendered inside the toggle item. */
    label: string;
}
type ButtonGroupPropsBase = Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> & Partial<Pick<DropdownMenuRootProps, 'open' | 'onOpenChange'>> & {
    class?: string;
    children?: JSX.Element;
    /** Enable split-button mode (main action + dropdown trigger). */
    split?: boolean;
    /** Button size inherited by split-mode children. Default: "md" */
    size?: ComponentSize;
    /** Button variant inherited by split-mode children. Default: "primary" */
    variant?: ButtonVariant;
    /** Use filled-variant child dividers (white/20 instead of ink borders). */
    filled?: boolean;
    /** Toggle-group mode: array of selectable options. Requires `value` and `onValueChange`. */
    options?: ToggleGroupOption[];
    /** Toggle-group layout direction. Default: "horizontal" */
    orientation?: 'horizontal' | 'vertical';
    /** Disable all buttons in the group. */
    disabled?: boolean;
    /** Split mode: aria-label for the role="group" wrapper. Default: "Split button" */
    splitButtonAriaLabel?: string;
};
type ButtonGroupProps = (ButtonGroupPropsBase & {
    multiple?: false;
    value?: string;
    onValueChange?: (value: string) => void;
}) | (ButtonGroupPropsBase & {
    multiple: true;
    value?: string[];
    onValueChange?: (value: string[]) => void;
});
declare const BUTTON_GROUP_MENU_SYMBOL: unique symbol;
interface ButtonGroupMenuSlot {
    [BUTTON_GROUP_MENU_SYMBOL]: true;
    render: () => JSX.Element;
}
/**
 * Groups buttons into a single visual unit. Supports three modes:
 * default (inline group), split (primary action + dropdown), and
 * toggle (single/multi-select option bar via `options`).
 */
declare function ButtonGroupRoot(props: ButtonGroupProps): JSX.Element;
interface ButtonGroupMainProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Override the variant inherited from ButtonGroup. */
    variant?: ButtonVariant;
    /** Override the size inherited from ButtonGroup. */
    size?: ComponentSize;
    class?: string;
    children?: JSX.Element;
}
/** Primary action button in split mode. Inherits size/variant from the parent ButtonGroup. */
declare function ButtonGroupMain(props: ButtonGroupMainProps): JSX.Element;
interface ButtonGroupMenuProps {
    /** Dropdown content rendered when the split trigger is clicked. Accepts JSX or a render function. */
    children?: JSX.Element | (() => JSX.Element);
}
/** Returns a plain object (slot), not JSX — used as second child of ButtonGroup when split. Cast to JSX.Element so TS accepts <ButtonGroup.Menu> in JSX. */
declare function ButtonGroupMenu(props: ButtonGroupMenuProps): JSX.Element;
declare const ButtonGroup: typeof ButtonGroupRoot & {
    Main: typeof ButtonGroupMain;
    Menu: typeof ButtonGroupMenu;
};

type CopyDisplay = 'text' | 'icon-and-text' | 'icon-only';
interface CopyProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'href' | 'target' | 'rel'> {
    /** Text to copy to clipboard. */
    text: string;
    /** How to show the button: "Copy" only, icon + "Copy", or icon only. */
    display?: CopyDisplay;
    /** Label when not copied. Default: "Copy" */
    label?: string;
    /** Label after copy. Default: "Copied" */
    copiedLabel?: string;
    /** Button visual variant. Default: outlined */
    variant?: ButtonVariant;
    size?: ComponentSize;
    class?: string;
    /** Called after successful copy. */
    onCopied?: () => void;
}
/**
 * Button that copies the given text to the clipboard and shows visual feedback when copied.
 * Use display="text" | "icon-and-text" | "icon-only" for word only, icon + word, or icon only.
 */
declare function Copy(props: CopyProps): JSX.Element;

/**
 * Copy text to clipboard and show "copied" feedback for a short time.
 * Returns [copy, copied, status] where status is 'idle' | 'copied' | 'error'.
 */
declare function useCopyToClipboard(): [
    (text: string) => Promise<boolean>,
    () => boolean,
    () => 'idle' | 'copied' | 'error'
];

type LinkVariant = 'primary' | 'muted';
interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
    /** Visual style. Default: "primary" */
    variant?: LinkVariant;
    children?: JSX.Element;
    /** Icon rendered before the text. */
    iconStart?: JSX.Element;
    /** Icon rendered after the text. */
    iconEnd?: JSX.Element;
}
/** Styled anchor link with primary and muted variants. */
declare function Link(props: LinkProps): JSX.Element;

type ColorScheme = 'light' | 'dark';
interface DarkModeToggleProps {
    variant?: 'icon' | 'switch';
    /** Controlled value. When provided, internal state is bypassed. */
    value?: ColorScheme;
    /** Called when the user toggles. Use with `value` for controlled mode. */
    onValueChange?: (scheme: ColorScheme) => void;
    /** Element to toggle the `dark` class on. Default: `document.documentElement`. */
    target?: () => HTMLElement;
    /** localStorage key for persistence. Set to `false` to disable. Default `'torch-theme'`. */
    storageKey?: string | false;
    /** Set `data-switching-theme` on body during toggle to suppress CSS transitions. Default: true. */
    suppressTransitions?: boolean;
    class?: string;
}
declare function DarkModeToggle(props: DarkModeToggleProps): solid_js.JSX.Element;

export { Button, ButtonGroup, type ButtonGroupMainProps, type ButtonGroupMenuProps, type ButtonGroupMenuSlot, type ButtonGroupProps, type ButtonProps, type ButtonVariant, type ColorScheme, Copy, type CopyDisplay, type CopyProps, DarkModeToggle, type DarkModeToggleProps, Link, type LinkProps, type LinkVariant, type ToggleGroupOption, useCopyToClipboard };
