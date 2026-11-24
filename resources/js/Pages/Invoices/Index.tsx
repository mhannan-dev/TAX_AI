import ActionToast from "@/Components/App/ActionToast";
import AppShell from "@/Components/App/AppShell";
import EmptyState from "@/Components/App/EmptyState";
import PageHeading from "@/Components/App/PageHeading";
import InvoiceDropzone from "@/Components/Invoices/InvoiceDropzone";
import InvoiceFilters, {
    defaultInvoiceFilters,
    type InvoiceFiltersValue,
    type InvoiceSortField,
} from "@/Components/Invoices/InvoiceFilters";
import InvoiceTable from "@/Components/Invoices/InvoiceTable";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    ChevronLeft,
    ChevronRight,
    CircleCheckBig,
    ClipboardList,
    Clock3,
    FileText,
    ListChecks,
    Percent,
    Plus,
    ScanLine,
    Sparkles,
} from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";

import { confidencePercent, formatCurrency, formatPercent } from "@/lib/format";
import type { PageProps } from "@/types";
import type { Invoice } from "@/types/domain";

const PAGE_SIZE = 10;

const pipeline = [
    {
        icon: ScanLine,
        title: "Vision extraction",
        description: "Structured output into validated invoice schema.",
    },
    {
        icon: ListChecks,
        title: "Deterministic checks",
        description: "TRN, VAT arithmetic and line-item roll-up verification.",
    },
    {
        icon: Sparkles,
        title: "Agent proposal",
        description: "Category and journal entry prepared for approval.",
    },
];

export default function InvoiceIndex({ invoices }: { invoices: Invoice[] }) {
    const { organization } = usePage<PageProps>().props;
    const currency = organization?.currency ?? "$";
    const vatRate = organization?.default_vat_rate ?? "5.00";
    const [toast, setToast] = useState<string | null>(null);
    const [filters, setFilters] = useState<InvoiceFiltersValue>(
        defaultInvoiceFilters,
    );
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [filters]);

    const filtered = useMemo(() => {
        const term = filters.search.trim().toLowerCase();

        return invoices.filter((invoice) => {
            const matchesStatus =
                filters.status === "all" || invoice.status === filters.status;
            const matchesTerm =
                !term ||
                invoice.file_name.toLowerCase().includes(term) ||
                (invoice.vendor_name ?? "").toLowerCase().includes(term) ||
                (invoice.vendor_trn ?? "").includes(term);

            return matchesStatus && matchesTerm;
        });
    }, [filters.search, filters.status, invoices]);

    const sorted = useMemo(() => {
        const numericValue = (value: string | null) => {
            const numeric = Number(value ?? 0);

            return Number.isFinite(numeric) ? numeric : 0;
        };
        const dateValue = (value: string | null) => {
            const parsed = value ? Date.parse(value) : Number.NaN;

            return Number.isNaN(parsed) ? 0 : parsed;
        };

        const compare = (left: Invoice, right: Invoice) => {
            switch (filters.sortBy) {
                case "vendor":
                    return (left.vendor_name ?? "").localeCompare(
                        right.vendor_name ?? "",
                    );
                case "date":
                    return (
                        dateValue(left.invoice_date) -
                        dateValue(right.invoice_date)
                    );
                case "amount":
                    return numericValue(left.total) - numericValue(right.total);
                case "confidence":
                    return (
                        confidencePercent(left.confidence_score) -
                        confidencePercent(right.confidence_score)
                    );
                default:
                    return (
                        dateValue(left.created_at) - dateValue(right.created_at)
                    );
            }
        };

        return [...filtered].sort((left, right) => {
            const result = compare(left, right) || left.id - right.id;

            return filters.direction === "asc" ? result : -result;
        });
    }, [filtered, filters.direction, filters.sortBy]);

    const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    const safePage = Math.min(page, pageCount);
    const start = sorted.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
    const end = Math.min(safePage * PAGE_SIZE, sorted.length);
    const paginated = sorted.slice(start - 1, end);
    const visiblePages = Array.from(
        new Set([1, safePage - 1, safePage, safePage + 1, pageCount]),
    )
        .filter((pageNumber) => pageNumber >= 1 && pageNumber <= pageCount)
        .sort((left, right) => left - right);

    const handleSort = (field: InvoiceSortField) => {
        setFilters((current) =>
            current.sortBy === field
                ? {
                      ...current,
                      direction: current.direction === "asc" ? "desc" : "asc",
                  }
                : {
                      ...current,
                      sortBy: field,
                      direction: field === "vendor" ? "asc" : "desc",
                  },
        );
    };

    const summary = [
        {
            label: "Total documents",
            value: String(invoices.length),
            icon: FileText,
        },
        {
            label: "Processing",
            value: String(
                invoices.filter((invoice) =>
                    ["queued", "parsed"].includes(invoice.status),
                ).length,
            ),
            icon: Clock3,
        },
        {
            label: "Pending approval",
            value: String(
                invoices.filter(
                    (invoice) => invoice.status === "pending_approval",
                ).length,
            ),
            icon: ClipboardList,
        },
        {
            label: "Posted",
            value: String(
                invoices.filter((invoice) => invoice.status === "posted")
                    .length,
            ),
            icon: CircleCheckBig,
        },
        {
            label: "VAT tracked",
            value: formatCurrency(
                invoices.reduce(
                    (total, invoice) => total + Number(invoice.vat_amount ?? 0),
                    0,
                ),
                currency,
            ),
            icon: Percent,
        },
    ];

    return (
        <AppShell
            title="Invoices"
            description="Upload, extract and review documents before posting."
            actions={
                <Button asChild>
                    <Link href="#upload">
                        <Plus className="h-4 w-4" />
                        Upload document
                    </Link>
                </Button>
            }
        >
            <Head title="Invoices" />

            <PageHeading
                eyebrow="Document pipeline"
                title="Invoice ingestion"
                description={`Drop a PDF or scanned receipt into the queue for ${organization?.name ?? "your organization"}. The extractor returns strict, auditable fields.`}
            />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {summary.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Card key={item.label} className="p-4">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-medium text-muted-foreground">
                                    {item.label}
                                </p>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                                {item.value}
                            </p>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <Card className="overflow-hidden">
                    <CardHeader className="space-y-4 border-b p-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-base">
                                    Document queue
                                </CardTitle>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {sorted.length} of {invoices.length}{" "}
                                    documents
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{currency}</Badge>
                                <Badge variant="outline">
                                    VAT {formatPercent(vatRate)}
                                </Badge>
                            </div>
                        </div>
                        <InvoiceFilters value={filters} onChange={setFilters} />
                    </CardHeader>

                    {invoices.length === 0 ? (
                        <CardContent className="pt-5">
                            <EmptyState
                                title="No documents yet"
                                description="Upload a PDF or scanned receipt to start the extraction pipeline."
                                action={
                                    <Button asChild size="sm">
                                        <Link href={route("invoices.index")}>
                                            Upload document
                                        </Link>
                                    </Button>
                                }
                            />
                        </CardContent>
                    ) : sorted.length === 0 ? (
                        <CardContent className="pt-5">
                            <EmptyState
                                title="No matching documents"
                                description="Try a different status or search term."
                                action={
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            setFilters(defaultInvoiceFilters)
                                        }
                                    >
                                        Clear filters
                                    </Button>
                                }
                            />
                        </CardContent>
                    ) : (
                        <>
                            <InvoiceTable
                                invoices={paginated}
                                currency={currency}
                                sortBy={filters.sortBy}
                                direction={filters.direction}
                                onSort={handleSort}
                            />
                            <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs text-muted-foreground">
                                    Showing {start}–{end} of {sorted.length}
                                </p>
                                <div className="flex items-center gap-1">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        disabled={safePage === 1}
                                        onClick={() => setPage(safePage - 1)}
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    {visiblePages.map((pageNumber, index) => (
                                        <Fragment key={pageNumber}>
                                            {index > 0 &&
                                                pageNumber -
                                                    visiblePages[index - 1] >
                                                    1 && (
                                                    <span
                                                        className="px-1 text-xs text-muted-foreground"
                                                        aria-hidden="true"
                                                    >
                                                        …
                                                    </span>
                                                )}
                                            <Button
                                                type="button"
                                                variant={
                                                    pageNumber === safePage
                                                        ? "secondary"
                                                        : "ghost"
                                                }
                                                size="icon"
                                                onClick={() =>
                                                    setPage(pageNumber)
                                                }
                                                aria-label={`Page ${pageNumber}`}
                                                aria-current={
                                                    pageNumber === safePage
                                                        ? "page"
                                                        : undefined
                                                }
                                            >
                                                {pageNumber}
                                            </Button>
                                        </Fragment>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        disabled={safePage === pageCount}
                                        onClick={() => setPage(safePage + 1)}
                                        aria-label="Next page"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </Card>

                <div className="space-y-6">
                    <Card id="upload">
                        <CardHeader className="border-b py-4">
                            <CardTitle className="text-base">
                                Upload document
                            </CardTitle>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Queued files are processed asynchronously.
                            </p>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <InvoiceDropzone
                                onUploaded={(message) => setToast(message)}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="border-b py-4">
                            <CardTitle className="text-base">
                                Processing stages
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-4">
                                {pipeline.map((stage, index) => {
                                    const Icon = stage.icon;

                                    return (
                                        <div
                                            key={stage.title}
                                            className="flex gap-3"
                                        >
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <div>
                                                <p className="text-xs font-medium text-foreground">
                                                    {index + 1}. {stage.title}
                                                </p>
                                                <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                                                    {stage.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ActionToast message={toast} onDismiss={() => setToast(null)} />
        </AppShell>
    );
}
