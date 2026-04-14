import * as solid_js from 'solid-js';
import { ChartConfiguration } from 'chart.js';

type ChartType = 'line' | 'bar' | 'doughnut' | 'pie' | 'radar' | 'polarArea' | 'scatter' | 'bubble';
/** Point for scatter charts (x, y) or bubble charts (x, y, r = radius). */
type ScatterPoint = {
    x: number;
    y: number;
};
type BubblePoint = {
    x: number;
    y: number;
    r: number;
};
interface ChartDataset {
    label: string;
    /** For line/bar/pie/doughnut/radar/polarArea: number[]. For scatter: ScatterPoint[]. For bubble: BubblePoint[]. */
    data: number[] | ScatterPoint[] | BubblePoint[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    hoverBackgroundColor?: string | string[];
    hoverBorderColor?: string | string[];
}
interface ChartData {
    /** For scatter/bubble can be empty []. For other types, one label per data point. */
    labels: string[];
    datasets: ChartDataset[];
}
interface ChartProps {
    /** Chart type: line, bar, doughnut, pie, radar, polarArea, scatter, or bubble */
    type: ChartType;
    /** Chart data: labels and datasets */
    data: ChartData;
    /** When type is 'line', fill area under the line. Default false. Same idea as Sparkline fill. */
    fill?: boolean;
    /** Dataset border width. Defaults: line=2, bar=0, doughnut/pie handled by segment borders. */
    borderWidth?: number;
    /** Optional Chart.js options override (merged with defaults) */
    options?: ChartConfiguration<ChartType>['options'];
    /** Accessible label for the chart wrapper. When provided, the chart is exposed to assistive tech. */
    'aria-label'?: string;
    /** ID of an element that labels the chart. When provided, the chart is exposed to assistive tech. */
    'aria-labelledby'?: string;
    class?: string;
}
/**
 * Chart.js wrapper with automatic dark-mode theming. Renders to canvas which is
 * inherently inaccessible — consumers should provide an accessible alternative
 * (caption, summary text, or data table) when the chart conveys meaningful data.
 */
declare function Chart(props: ChartProps): solid_js.JSX.Element;

interface SparklineProps {
    /** Data points for the line (e.g. [12, 19, 8, 15, 22, 18]). */
    data: number[];
    /** Line and fill color (CSS color, e.g. rgb(59, 130, 246) or #3b82f6). Default: primary blue. */
    color?: string;
    /** Fill area under the line. Default true. */
    fill?: boolean;
    /** Line tension (0 = straight, 0.4 = smooth). Default 0.3. */
    tension?: number;
    /** Show a point at the last value. Default true. */
    showPoint?: boolean;
    /** Fix the y-axis minimum. Useful to prevent the line from filling the full height when values are close together. */
    min?: number;
    /** Fix the y-axis maximum. */
    max?: number;
    /** Accessible label for the sparkline. When provided, the chart is exposed to assistive tech. */
    'aria-label'?: string;
    /** ID of an element that labels the sparkline. When provided, the chart is exposed to assistive tech. */
    'aria-labelledby'?: string;
    class?: string;
}
/**
 * Minimal line chart for inline use (e.g. stat cards, table cells). Wraps
 * Chart.js with no axes, legend, or tooltip.
 *
 * Unlike {@link Chart}, Sparkline does not auto-adapt to dark mode — consumers
 * are responsible for passing a theme-appropriate `color` prop.
 */
declare function Sparkline(props: SparklineProps): solid_js.JSX.Element;

export { type BubblePoint, Chart, type ChartData, type ChartDataset, type ChartProps, type ChartType, type ScatterPoint, Sparkline, type SparklineProps };
