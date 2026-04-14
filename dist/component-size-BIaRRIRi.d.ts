/**
 * Canonical interactive-component size scale.
 * All TorchUI interactive components use this type so xs/sm/md/lg/xl produce
 * identical rendered heights, enabling mixed-component toolbars to align naturally.
 *
 * Heights (border-box):
 *   xs → h-7  (28px)
 *   sm → h-8  (32px)
 *   md → h-9  (36px) ← standard default
 *   lg → h-10 (40px)
 *   xl → h-11 (44px)
 */
type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
interface InputSizeConfig {
    /** Height + min-height Tailwind classes. */
    h: string;
    /** Vertical padding class. */
    py: string;
    /** Font-size class. */
    text: string;
    /** Left padding when no start adornment. */
    pl: string;
    /** Right padding when no end adornment. */
    pr: string;
    /** Left padding when a start adornment is present. */
    plAdorn: string;
    /** Right padding when an end adornment is present. */
    prAdorn: string;
    /** CSS `left` value for the start adornment element. */
    adornStart: string;
    /** CSS `right` value for the end adornment element. */
    adornEnd: string;
}
/**
 * Per-size layout config for form-input trigger elements
 * (Input, NumberField, Select, MultiSelect, Autocomplete).
 * Heights reference --torch-h-* CSS variables so consumers can
 * override all component heights from a single :root declaration.
 */
declare const inputSizeConfig: Record<ComponentSize, InputSizeConfig>;

export { type ComponentSize as C, inputSizeConfig as i };
