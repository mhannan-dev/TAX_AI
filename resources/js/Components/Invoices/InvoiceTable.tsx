import { Link } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, ArrowUpRight, FileText } from 'lucide-react';

import StatusBadge from '@/Components/App/StatusBadge';
import { Progress } from '@/Components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import type {
    InvoiceSortDirection,
    InvoiceSortField,
} from '@/Components/Invoices/InvoiceFilters';
import {
    confidencePercent,
    formatCurrency,
    formatDate,
} from '@/lib/format';
import type { Invoice } from '@/types/domain';

type Props = {
    invoices: Invoice[];
    currency: string;
    compact?: boolean;
    sortBy?: InvoiceSortField;
    direction?: InvoiceSortDirection;
    onSort?: (field: InvoiceSortField) => void;
};

export default function InvoiceTable({
    invoices,
    currency,
    compact = false,
    sortBy,
    direction,
    onSort,
}: Props) {
    const sortHeader = (
        label: string,
        field: InvoiceSortField,
        className?: string,
    ) => {
        const active = sortBy === field;
        const Icon = active
            ? direction === 'asc'
                ? ArrowUp
                : ArrowDown
            : ArrowUpDown;

        return (
            <TableHead
                className={className}
                aria-sort={
                    active
                        ? direction === 'asc'
                            ? 'ascending'
                            : 'descending'
                        : undefined
                }
            >
                {onSort ? (
                    <button
                        type="button"
                        onClick={() => onSort(field)}
                        className={`inline-flex items-center gap-1 rounded text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                            className?.includes('text-right')
                                ? 'w-full justify-end'
                                : ''
                        }`}
                        aria-label={`Sort by ${label}`}
                    >
                        {label}
                        <Icon className="h-3 w-3" />
                    </button>
                ) : (
                    label
                )}
            </TableHead>
        );
    };

    return (
        <>
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead>Document</TableHead>
                            {sortHeader('Vendor', 'vendor')}
                            {sortHeader('Date', 'date')}
                            {sortHeader(
                                'Amount',
                                'amount',
                                'text-right',
                            )}
                            {!compact && sortHeader('Confidence', 'confidence')}
                            <TableHead>Status</TableHead>
                            <TableHead className="w-10">
                                <span className="sr-only">Review</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2.5">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                            <FileText className="h-4 w-4" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="max-w-[220px] truncate text-xs font-medium text-foreground">
                                                {invoice.file_name}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground">
                                                #{invoice.id}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="text-xs font-medium text-foreground">
                                        {invoice.vendor_name ??
                                            'Awaiting extraction'}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {invoice.vendor_trn ??
                                            'TRN not found'}
                                    </p>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {formatDate(invoice.invoice_date)}
                                </TableCell>
                                <TableCell className="text-right text-xs font-medium text-foreground">
                                    {formatCurrency(invoice.total, currency)}
                                </TableCell>
                                {!compact && (
                                    <TableCell>
                                        <div className="w-24">
                                            <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
                                                <span>
                                                    {invoice.confidence_score
                                                        ? `${confidencePercent(invoice.confidence_score)}%`
                                                        : '—'}
                                                </span>
                                            </div>
                                            <Progress
                                                value={confidencePercent(
                                                    invoice.confidence_score,
                                                )}
                                                className="h-1.5"
                                                indicatorClassName="bg-emerald-500"
                                            />
                                        </div>
                                    </TableCell>
                                )}
                                <TableCell>
                                    <StatusBadge
                                        status={invoice.status}
                                        kind="invoice"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Link
                                        href={route('invoices.show', invoice.id)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        aria-label={`Review ${invoice.file_name}`}
                                    >
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="divide-y md:hidden">
                {invoices.map((invoice) => (
                    <Link
                        key={invoice.id}
                        href={route('invoices.show', invoice.id)}
                        className="block px-4 py-4 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                        aria-label={`Review ${invoice.file_name}`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2.5">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                    <FileText className="h-4 w-4" />
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-xs font-medium text-foreground">
                                        {invoice.file_name}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        #{invoice.id} ·{' '}
                                        {formatDate(invoice.invoice_date)}
                                    </p>
                                </div>
                            </div>
                            <StatusBadge
                                status={invoice.status}
                                kind="invoice"
                            />
                        </div>
                        <div className="mt-3 flex items-end justify-between gap-3">
                            <div className="min-w-0">
                                <p className="truncate text-xs font-medium text-foreground">
                                    {invoice.vendor_name ??
                                        'Awaiting extraction'}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                    {invoice.vendor_trn ?? 'TRN not found'}
                                </p>
                            </div>
                            <p className="shrink-0 text-sm font-semibold text-foreground">
                                {formatCurrency(invoice.total, currency)}
                            </p>
                        </div>
                        {!compact && invoice.confidence_score && (
                            <div className="mt-3 flex items-center gap-2">
                                <Progress
                                    value={confidencePercent(
                                        invoice.confidence_score,
                                    )}
                                    className="h-1.5 flex-1"
                                    indicatorClassName="bg-emerald-500"
                                />
                                <span className="text-[10px] text-muted-foreground">
                                    {confidencePercent(
                                        invoice.confidence_score,
                                    )}
                                    %
                                </span>
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </>
    );
}
