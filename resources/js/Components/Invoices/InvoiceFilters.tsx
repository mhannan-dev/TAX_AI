import { ArrowDown, ArrowUp, RotateCcw } from 'lucide-react';

import SearchInput from '@/Components/App/SearchInput';
import { Button } from '@/Components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

export type InvoiceSortField =
    | 'created'
    | 'vendor'
    | 'date'
    | 'amount'
    | 'confidence';

export type InvoiceSortDirection = 'asc' | 'desc';

export type InvoiceFiltersValue = {
    search: string;
    status: string;
    sortBy: InvoiceSortField;
    direction: InvoiceSortDirection;
};

export const defaultInvoiceFilters: InvoiceFiltersValue = {
    search: '',
    status: 'all',
    sortBy: 'created',
    direction: 'desc',
};

export default function InvoiceFilters({
    value,
    onChange,
}: {
    value: InvoiceFiltersValue;
    onChange: (value: InvoiceFiltersValue) => void;
}) {
    const dirty =
        value.search !== defaultInvoiceFilters.search ||
        value.status !== defaultInvoiceFilters.status ||
        value.sortBy !== defaultInvoiceFilters.sortBy ||
        value.direction !== defaultInvoiceFilters.direction;

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
                value={value.search}
                onChange={(search) => onChange({ ...value, search })}
                placeholder="Search vendor or file..."
                className="sm:max-w-xs"
                ariaLabel="Search invoices"
            />

            <Select
                value={value.status}
                onValueChange={(status) => onChange({ ...value, status })}
            >
                <SelectTrigger
                    className="w-full sm:w-44"
                    aria-label="Filter by status"
                >
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="queued">Queued</SelectItem>
                    <SelectItem value="parsed">Parsed</SelectItem>
                    <SelectItem value="pending_approval">
                        Pending approval
                    </SelectItem>
                    <SelectItem value="posted">Posted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={value.sortBy}
                onValueChange={(sortBy) =>
                    onChange({
                        ...value,
                        sortBy: sortBy as InvoiceSortField,
                    })
                }
            >
                <SelectTrigger
                    className="w-full sm:w-44"
                    aria-label="Sort invoices by"
                >
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="created">Latest upload</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="date">Invoice date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="confidence">Confidence</SelectItem>
                </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                        onChange({
                            ...value,
                            direction:
                                value.direction === 'asc' ? 'desc' : 'asc',
                        })
                    }
                    aria-label={`Sort ${
                        value.direction === 'asc' ? 'descending' : 'ascending'
                    }`}
                    title={`Sort ${
                        value.direction === 'asc' ? 'descending' : 'ascending'
                    }`}
                >
                    {value.direction === 'asc' ? (
                        <ArrowUp className="h-4 w-4" />
                    ) : (
                        <ArrowDown className="h-4 w-4" />
                    )}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={!dirty}
                    onClick={() => onChange(defaultInvoiceFilters)}
                    aria-label="Reset filters"
                    title="Reset filters"
                >
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
