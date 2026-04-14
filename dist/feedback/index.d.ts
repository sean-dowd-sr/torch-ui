export { A as Alert, a as AlertAppearance, b as AlertProps, c as AlertStatus } from '../Alert-DkSFD4Ke.js';
import * as solid_js from 'solid-js';
import { JSX } from 'solid-js';
export { A as AlertDialog, a as AlertDialogProps } from '../AlertDialog-BhMAi-uk.js';
import '@kobalte/core/alert-dialog';

type BannerStatus = 'primary' | 'info' | 'success' | 'warning' | 'error';
type BannerAppearance = 'solid' | 'subtle';
interface BannerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Semantic status. Default: info. */
    status?: BannerStatus;
    /** Visual style: solid (default) or subtle. */
    appearance?: BannerAppearance;
    /** Optional icon shown at the start. */
    icon?: JSX.Element;
    /** Optional call-to-action (e.g. a link or small Button) rendered after the message. */
    action?: JSX.Element;
    /** When true, shows a dismiss button and calls onClose on click. */
    closeable?: boolean;
    /** Called when the dismiss button is clicked. Required when closeable is true. */
    onClose?: () => void;
    /** Make the banner sticky to the top or bottom of its scroll container. */
    sticky?: 'top' | 'bottom';
    /** Override default status colors with custom Tailwind classes. */
    colorClass?: string;
    class?: string;
    children?: JSX.Element;
}
/** Full-width notification strip. Use for site-wide announcements, maintenance notices, or top-of-page alerts. For inline feedback use Alert. */
declare function Banner(props: BannerProps): JSX.Element;

type PasswordStrength = 'empty' | 'poor' | 'fair' | 'good' | 'excellent';
interface PasswordStrengthDetail {
    name: string;
    passed: boolean;
    optional?: boolean;
}
interface PasswordStrengthMessages {
    empty?: {
        label?: string;
        helperText?: string;
    };
    poor?: {
        label?: string;
        helperText?: string;
    };
    fair?: {
        label?: string;
        helperText?: string;
    };
    good?: {
        label?: string;
        helperText?: string;
    };
    excellent?: {
        label?: string;
        helperText?: string;
    };
}
interface PasswordStrengthIndicatorProps {
    /** Current strength level */
    strength: PasswordStrength;
    /** Score for the progress bar (0-100) */
    score?: number;
    /** Optional details about what passed/failed */
    details?: PasswordStrengthDetail[];
    class?: string;
    /** Show helper text below the bar. Default: true. */
    showHelperText?: boolean;
    /** Custom labels and helper text for each strength level */
    messages?: PasswordStrengthMessages;
    /** Custom title for the indicator */
    title?: string;
    /** Number of segments for the progress bar. Default: 8 */
    segments?: number;
}
declare function PasswordStrengthIndicator(props: PasswordStrengthIndicatorProps): solid_js.JSX.Element;

interface PasswordValidationResult {
    valid: boolean;
    error?: string;
}
/** Validate a password for form submission. Checks minimum length (8) and blocked patterns. */
declare function validatePassword(password: string): PasswordValidationResult;
/**
 * Check if a password contains blocked patterns (sequential, keyboard walks, etc.).
 * Does NOT check length — use this for strength indicators, not form validation.
 */
declare function isPasswordWeak(password: string): boolean;

type ProgressSize = 'sm' | 'md' | 'lg';
type ProgressColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type ProgressRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
interface ProgressClassNames {
    base?: string;
    labelWrapper?: string;
    label?: string;
    track?: string;
    value?: string;
    indicator?: string;
}
interface ProgressProps {
    /** Current value (between minValue and maxValue) */
    value?: number;
    /** Minimum value */
    minValue?: number;
    /** Maximum value */
    maxValue?: number;
    /** Label above the bar; also used for aria-label when aria-label not set and label is a string */
    label?: JSX.Element | string;
    /** Custom value label (e.g. "3/10"). When not set, value is shown as percentage if showValueLabel. */
    valueLabel?: JSX.Element;
    /** Size of the track */
    size?: ProgressSize;
    /** Color of the indicator */
    color?: ProgressColor;
    /** Track and indicator radius */
    radius?: ProgressRadius;
    /** Intl.NumberFormat options for default value display (e.g. { style: 'percent' }) */
    formatOptions?: Intl.NumberFormatOptions;
    /** Whether to show the value label (default true when determinate and no valueLabel) */
    showValueLabel?: boolean;
    /** Indeterminate animation when total progress is unknown */
    isIndeterminate?: boolean;
    /** Striped indicator */
    isStriped?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Disable fill animation */
    disableAnimation?: boolean;
    /** When set, render as segmented bar (e.g. password strength) */
    segments?: number;
    /** Animate from 0 to 100 over this duration (ms). Use for indeterminate-duration progress. */
    durationMs?: number;
    /** Accessible label (required when label prop is not provided) */
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-valuetext'?: string;
    'aria-valuenow'?: number;
    'aria-valuemin'?: number;
    'aria-valuemax'?: number;
    /** Slot class overrides */
    classNames?: ProgressClassNames;
    class?: string;
    trackClass?: string;
    fillClass?: string;
}
/**
 * Progress bar. Supports determinate (value), indeterminate, segmented, or duration-based fill.
 * Aligned with common Progress APIs (label, size, color, radius, valueLabel, isIndeterminate, etc.).
 */
declare function Progress(props: ProgressProps): JSX.Element;

type LoadingVariant = 'spinner' | 'dashboard' | 'tablePage' | 'admin' | 'generic';
interface LoadingProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /** Spinner (default) or skeleton layout for full-page loading. Omit for spinner. */
    variant?: LoadingVariant;
    /** For spinner: message (default "Loading…"). Omit or set iconOnly for no message. */
    message?: string;
    /** For spinner: when true, show only the spinner (no message). */
    iconOnly?: boolean;
    /** For spinner: size of the icon. Ignored when icon is provided. */
    size?: 'sm' | 'md' | 'lg';
    /** For spinner: custom icon element. Add animate-spin and size classes. */
    icon?: JSX.Element;
    /** For spinner: minimum height (default 200px when not iconOnly). */
    minHeight?: string | number;
}
/** Single loading component: spinner (for Suspense/panels) or skeleton layout (for full-page). */
declare function Loading(props: LoadingProps): JSX.Element;

interface SkeletonProps {
    /** Extra class for the wrapper (or the standalone block). */
    class?: string;
    /** Use "full" for circular (e.g. avatar), "lg" for large radius, or omit for default. Matches the wrapped child's shape when you pass the same as the child (e.g. round="full" for rounded-full). */
    round?: 'full' | 'lg' | 'md' | 'sm' | 'none';
    /** Use block layout instead of inline-block. Needed when wrapping children that depend on parent width (w-full, flex-1, %-based). Default: false. */
    block?: boolean;
    /** When true, children are revealed directly (loading complete). When false/undefined, shimmer is shown over the children's shape.
     * Pair with children to wrap real content: <Skeleton loaded={isLoaded} round="full"><Avatar /></Skeleton> */
    loaded?: boolean;
    /** Wrap content to take its shape; omit for a standalone block you size with class.
     * Note: wrap mode works best with intrinsic-size children. For layout-dependent children
     * (w-full, flex-1, %-widths), set block={true} so the wrapper participates in flow layout.
     * Skeleton is always aria-hidden — pair with a Loading status region for screen reader announcements. */
    children?: JSX.Element;
}
/**
 * Skeleton takes the shape of its children by default (wrap mode), or use as a standalone
 * block by omitting children and sizing with class. Use the round prop to match your
 * child (e.g. round="full" for avatars so the skeleton is a circle).
 */
declare function Skeleton(props: SkeletonProps): JSX.Element;

/**
 * Composable skeleton blocks for common layouts (Card, Table, Section, etc.).
 * These do NOT set role="status" or aria-label — they are intended to be
 * wrapped by a container that provides accessibility (e.g. <Loading>).
 */

/** Skeleton that matches Card layout: optional header, body with N lines. Compose to match your Card structure. */
interface SkeletonCardProps {
    /** Show a header bar (like Card.Header). Default true. */
    header?: boolean;
    /** Number of body lines. Default 2. */
    bodyLines?: number;
    /** Horizontal layout: image/avatar placeholder on left (like Card horizontal). */
    horizontal?: boolean;
    class?: string;
}
declare function SkeletonCard(props: SkeletonCardProps): JSX.Element;
/** Skeleton that matches Table layout: header row + N body rows × M cells. Compose to match your Table structure. */
interface SkeletonTableProps {
    /** Number of body rows. Default 5. */
    rows?: number;
    /** Number of columns (header + each row). Default 4. */
    columns?: number;
    class?: string;
}
declare function SkeletonTable(props: SkeletonTableProps): JSX.Element;
/** Skeleton that matches Section / PageHeading: title bar + optional description + content block. Compose to match your Section structure. */
interface SkeletonSectionProps {
    /** Show a description line under the title. Default true. */
    description?: boolean;
    /** Show a content block below (e.g. form or card placeholder). Default true. */
    content?: boolean;
    /** Content block lines. Default 3. */
    contentLines?: number;
    class?: string;
}
declare function SkeletonSection(props: SkeletonSectionProps): JSX.Element;
/** Skeleton block for a simple title + one line (e.g. PageHeading only, no section content). */
interface SkeletonHeadingProps {
    /** Show description line. Default true. */
    description?: boolean;
    class?: string;
}
declare function SkeletonHeading(props: SkeletonHeadingProps): JSX.Element;
/** Skeleton for a form-like block: label lines + inputs + buttons. */
interface SkeletonFormProps {
    fields?: number;
    buttons?: number;
    class?: string;
}
declare function SkeletonForm(props: SkeletonFormProps): JSX.Element;
/** Skeleton for a sidebar nav block: section label + list of items. */
interface SkeletonNavBlockProps {
    items?: number;
    class?: string;
}
declare function SkeletonNavBlock(props: SkeletonNavBlockProps): JSX.Element;

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
type ToastAppearance = 'subtle' | 'solid';
interface ToastItem {
    id: string;
    title?: string;
    description?: string;
    /** Legacy: for backward compatibility */
    message?: string;
    variant?: ToastVariant;
    /** Visual style. Default inherited from ToastProvider defaultAppearance, which defaults to 'subtle'. */
    appearance?: ToastAppearance;
    /** Auto-dismiss duration in ms. Default 5000. Set to 0 to disable auto-dismiss. */
    duration?: number;
    /** Show progress bar for countdown. Default true when duration > 0. */
    showProgress?: boolean;
    /** Show the status icon for the variant. Default true. */
    showIcon?: boolean;
    /** Optional action label; when set, onAction is called when clicked. */
    actionLabel?: string;
    onAction?: () => void;
}
interface ToastContextValue {
    toasts: () => ToastItem[];
    show: (title: string, description?: string, options?: {
        variant?: ToastVariant;
        appearance?: ToastAppearance;
        duration?: number;
        showProgress?: boolean;
        showIcon?: boolean;
        actionLabel?: string;
        onAction?: () => void;
    }) => string;
    dismiss: (id: string) => void;
}
declare function useToast(): ToastContextValue;
interface ToastProviderProps {
    children: JSX.Element;
    /** Position of the toast container. Default bottom-right. */
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    /** Default visual style for all toasts. Can be overridden per toast. Default 'subtle'. */
    defaultAppearance?: ToastAppearance;
    /** Hotkey to jump to toast region. Default Alt+T. */
    hotkey?: string;
    /** Maximum number of toasts shown at once. Oldest is removed when exceeded. Default 5. */
    maxToasts?: number;
}
declare function ToastProvider(props: ToastProviderProps): JSX.Element;

export { Banner, type BannerAppearance, type BannerProps, type BannerStatus, Loading, type LoadingProps, type LoadingVariant, type PasswordStrength, type PasswordStrengthDetail, PasswordStrengthIndicator, type PasswordStrengthIndicatorProps, type PasswordStrengthMessages, type PasswordValidationResult, Progress, type ProgressClassNames, type ProgressColor, type ProgressProps, type ProgressRadius, type ProgressSize, Skeleton, SkeletonCard, type SkeletonCardProps, SkeletonForm, type SkeletonFormProps, SkeletonHeading, type SkeletonHeadingProps, SkeletonNavBlock, type SkeletonNavBlockProps, type SkeletonProps, SkeletonSection, type SkeletonSectionProps, SkeletonTable, type SkeletonTableProps, type ToastAppearance, type ToastContextValue, type ToastItem, ToastProvider, type ToastVariant, isPasswordWeak, useToast, validatePassword };
