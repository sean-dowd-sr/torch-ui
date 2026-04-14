import { JSX } from 'solid-js';

interface TablePanelProps extends JSX.HTMLAttributes<HTMLDivElement> {
    header?: JSX.Element;
    headerClass?: string;
    bodyClass?: string;
}
declare function TablePanel(props: TablePanelProps): JSX.Element;

export { TablePanel as T, type TablePanelProps as a };
