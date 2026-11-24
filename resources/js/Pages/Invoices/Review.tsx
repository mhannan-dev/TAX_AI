import ActionToast from "@/Components/App/ActionToast";
import AppShell from "@/Components/App/AppShell";
import PageHeading from "@/Components/App/PageHeading";
import StatusBadge from "@/Components/App/StatusBadge";
import DocumentPreview from "@/Components/Invoices/DocumentPreview";
import ExtractedFieldsForm, {
    type ExtractedFields,
} from "@/Components/Invoices/ExtractedFieldsForm";
import ExtractionChecks from "@/Components/Invoices/ExtractionChecks";
import LineItemsTable from "@/Components/Invoices/LineItemsTable";
import ReviewActions from "@/Components/Invoices/ReviewActions";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Head, Link, usePage } from "@inertiajs/react";
import { ArrowLeft, Gauge } from "lucide-react";
import { useEffect, useState } from "react";

import { confidencePercent, formatDateTime } from "@/lib/format";
import type { PageProps } from "@/types";
import type { Invoice, InvoiceItem } from "@/types/domain";

type ReviewDraft = {
    fields: ExtractedFields;
    items: InvoiceItem[];
};

function fieldsFromInvoice(
    invoice: Invoice,
    currency: string,
): ExtractedFields {
    return {
        vendor_name: invoice.vendor_name ?? "",
        vendor_trn: invoice.vendor_trn ?? "",
        invoice_date: invoice.invoice_date ?? "",
        subtotal: invoice.subtotal ?? "",
        vat_amount: invoice.vat_amount ?? "",
        total: invoice.total ?? "",
        currency,
        tax_code:
            invoice.items?.[0]?.tax_code ??
            String(invoice.extracted_payload?.tax_code ?? "standard"),
    };
}

function itemsFromInvoice(invoice: Invoice): InvoiceItem[] {
    if (invoice.items && invoice.items.length > 0) {
        return invoice.items;
    }

    return (invoice.extracted_payload?.line_items ?? []).map((item, index) => ({
        id: index + 1,
        description: item.description ?? "",
        quantity: String(item.quantity ?? 1),
        unit_price: String(item.unit_price ?? 0),
        tax_code: item.tax_code ?? "standard",
        tax_amount: "0.00",
        total: String(item.amount ?? 0),
    }));
}

export default function InvoiceReview({ invoice }: { invoice: Invoice }) {
    const { organization } = usePage<PageProps>().props;
    const [toast, setToast] = useState<string | null>(null);
    const currency = organization?.currency ?? "$";
    const vatRate = organization?.default_vat_rate ?? "5.00";
    const confidence = confidencePercent(invoice.confidence_score);
    const confidenceVariant =
        confidence >= 90
            ? "success"
            : confidence >= 70
              ? "warning"
              : "destructive";

    const [draft, setDraft] = useState<ReviewDraft>(() => ({
        fields: fieldsFromInvoice(invoice, currency),
        items: itemsFromInvoice(invoice),
    }));

    useEffect(() => {
        setDraft({
            fields: fieldsFromInvoice(invoice, currency),
            items: itemsFromInvoice(invoice),
        });
    }, [invoice, currency]);

    const updateFields = (fields: ExtractedFields) => {
        setDraft((current) => ({ ...current, fields }));
    };

    const updateItems = (items: InvoiceItem[]) => {
        setDraft((current) => ({ ...current, items }));
    };

    return (
        <AppShell
            title="Invoice review"
            description={invoice.file_name}
            actions={
                <Button asChild variant="outline">
                    <Link href={route("invoices.index")}>
                        <ArrowLeft className="h-4 w-4" />
                        Back to invoices
                    </Link>
                </Button>
            }
        >
            <Head title={`Review ${invoice.file_name}`} />

            <PageHeading
                eyebrow="Human-in-the-loop review"
                title={invoice.vendor_name ?? "Vendor pending extraction"}
                description={`Uploaded ${formatDateTime(invoice.created_at)} · TRN ${draft.fields.vendor_trn || "not detected"}`}
                actions={
                    <>
                        <StatusBadge status={invoice.status} kind="invoice" />
                        <Badge variant={confidenceVariant}>
                            <Gauge className="mr-1 h-3 w-3" />
                            {confidence}% confidence
                        </Badge>
                    </>
                }
            />

            <div className="grid gap-6 xl:grid-cols-2">
                <div className="xl:sticky xl:top-24 xl:self-start">
                    <DocumentPreview
                        invoice={invoice}
                        fields={draft.fields}
                        items={draft.items}
                        currency={draft.fields.currency}
                        vatRate={vatRate}
                        previewUrl={invoice.preview_url}
                    />
                </div>

                <div className="space-y-6">
                    <ExtractedFieldsForm
                        value={draft.fields}
                        onChange={updateFields}
                        onSave={() =>
                            setToast("Field changes applied to this review.")
                        }
                    />

                    <Card>
                        <CardHeader className="border-b bg-muted/30">
                            <CardTitle className="text-base">
                                Extracted line items
                            </CardTitle>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Edit quantities, prices and tax codes. Amounts
                                recalculate from quantity and unit price.
                            </p>
                        </CardHeader>
                        <CardContent className="p-0">
                            <LineItemsTable
                                items={draft.items}
                                currency={draft.fields.currency}
                                onChange={updateItems}
                            />
                        </CardContent>
                    </Card>

                    <ExtractionChecks
                        invoice={invoice}
                        fields={draft.fields}
                        items={draft.items}
                        vatRate={vatRate}
                        currency={draft.fields.currency}
                    />

                    <ReviewActions
                        invoice={invoice}
                        onAction={(message) => setToast(message)}
                    />
                </div>
            </div>

            <ActionToast message={toast} onDismiss={() => setToast(null)} />
        </AppShell>
    );
}
