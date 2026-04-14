import { JSX } from 'solid-js';

interface PaginationProps extends JSX.HTMLAttributes<HTMLElement> {
    /** Current 1-based page. */
    page: number;
    /** Total number of pages. */
    totalPages: number;
    /** Called when page changes. */
    onPageChange: (page: number) => void;
    /** Max page-number buttons to show (excluding prev/next). Default: 5. Set 0 to hide page numbers. */
    maxPages?: number;
    /** Show first/last page buttons (double chevrons). Default: false. */
    showFirstLast?: boolean;
    /** Total item count. When set, renders "Showing X–Y of Z" info text. */
    totalItems?: number;
    /** Current page size. When set alongside onPageSizeChange, renders per-page selector. */
    pageSize?: number;
    /** Called when page size changes. Required alongside pageSize for the per-page selector to render. */
    onPageSizeChange?: (size: number) => void;
    /** Options for per-page selector. Default: [10, 25, 50]. */
    pageSizeOptions?: number[];
    /** Optional id for the per-page select element (for label association). */
    selectId?: string;
}
/**
 * Unified pagination: page-number buttons with prev/next, optional "Showing X–Y of Z" info,
 * and optional per-page size selector. Replaces both standalone Pagination and TablePaginationFooter.
 */
declare function Pagination(props: PaginationProps): JSX.Element;

export { Pagination as P, type PaginationProps as a };
