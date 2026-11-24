import { ExternalLink, FileWarning, ScanLine } from 'lucide-react';

import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import type { ExtractedFields } from '@/Components/Invoices/ExtractedFieldsForm';
import {
    formatCurrency,
    formatDate,
    formatPercent,
} from '@/lib/format';
import type { Invoice, InvoiceItem } from '@/types/domain';

type Props = {
    invoice: Invoice;
    fields: ExtractedFields;
    items: InvoiceItem[];
    currency: string;
    vatRate: string;
    previewUrl?: string | null;
};

export default function DocumentPreview({
    invoice,
    fields,
    items,
    currency,
    vatRate,
    previewUrl,
}: Props) {
    const isImage = /\.(jpe?g|png)$/i.test(invoice.file_name);

    return (
        <Card className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b bg-muted/40 px-4 py-3">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <ScanLine className="h-3.5 w-3.5" />
                    Original document
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                        {previewUrl ? 'Document' : 'Extracted preview'}
                    </Badge>
                    {previewUrl && (
                        <Button asChild variant="ghost" size="sm">
                            <a
                                href={previewUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Open
                            </a>
                        </Button>
                    )}
                </div>
            </div>

            {previewUrl ? (
                <div className="bg-slate-100 p-4 sm:p-6">
                    <div className="mx-auto max-w-[760px] overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                        {isImage ? (
                            <img
                                src={previewUrl}
                                alt={`Original document ${invoice.file_name}`}
                                className="mx-auto max-h-[720px] w-auto max-w-full object-contain"
                            />
                        ) : (
                            <iframe
                                src={previewUrl}
                                title={`Original document ${invoice.file_name}`}
                                className="h-[720px] w-full border-0"
                            />
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-slate-100 p-4 sm:p-6">
                    <div className="mx-auto min-h-[640px] max-w-[560px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-start justify-between gap-6 border-b border-dashed border-slate-300 pb-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                    Tax invoice
                                </p>
                                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                                    {fields.vendor_name || 'Vendor name pending'}
                                </h3>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Vendor TRN: {fields.vendor_trn || '—'}
                                    <br />
                                    Invoice date: {formatDate(fields.invoice_date)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-mono text-xs text-slate-500">
                                    #{invoice.id}
                                </p>
                                <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-400">
                                    {fields.currency}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start justify-between gap-4 text-xs text-slate-700"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-medium">
                                                {item.description ||
                                                    'Untitled line'}
                                            </p>
                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                {item.quantity} ×{' '}
                                                {formatCurrency(
                                                    item.unit_price,
                                                    currency,
                                                )}
                                            </p>
                                        </div>
                                        <span className="shrink-0 font-medium">
                                            {formatCurrency(
                                                item.total,
                                                currency,
                                            )}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center gap-2 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
                                    <FileWarning className="h-4 w-4" />
                                    No line items available to display.
                                </div>
                            )}
                        </div>

                        <div className="mt-10 space-y-2 border-t border-slate-200 pt-4 text-xs">
                            <div className="flex justify-between text-slate-500">
                                <span>Subtotal</span>
                                <span>
                                    {formatCurrency(fields.subtotal, currency)}
                                </span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>VAT {formatPercent(vatRate)}</span>
                                <span>
                                    {formatCurrency(
                                        fields.vat_amount,
                                        currency,
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-semibold text-slate-900">
                                <span>Total due</span>
                                <span>
                                    {formatCurrency(fields.total, currency)}
                                </span>
                            </div>
                        </div>

                        <p className="mt-10 text-center text-[10px] text-slate-300">
                            {invoice.file_name} · extracted field preview
                        </p>
                    </div>
                </div>
            )}
        </Card>
    );
}
