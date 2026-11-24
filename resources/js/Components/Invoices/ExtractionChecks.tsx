import { AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

import { Badge } from '@/Components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import type { ExtractedFields } from '@/Components/Invoices/ExtractedFieldsForm';
import {
    confidencePercent,
    formatCurrency,
    formatPercent,
    humanize,
} from '@/lib/format';
import type { Invoice, InvoiceItem } from '@/types/domain';

type Check = {
    label: string;
    detail: string;
    passed: boolean;
};

type Props = {
    invoice: Invoice;
    fields: ExtractedFields;
    items: InvoiceItem[];
    vatRate: string;
    currency: string;
};

const TOLERANCE = 0.01;

function asNumber(value: string | number | null | undefined): number {
    const numeric = Number(value ?? 0);

    return Number.isFinite(numeric) ? numeric : 0;
}

export default function ExtractionChecks({
    invoice,
    fields,
    items,
    vatRate,
    currency,
}: Props) {
    const subtotal = asNumber(fields.subtotal);
    const vat = asNumber(fields.vat_amount);
    const total = asNumber(fields.total);
    const hasAmounts =
        fields.subtotal !== '' &&
        fields.vat_amount !== '' &&
        fields.total !== '';
    const summaryMismatch = Math.abs(subtotal + vat - total) > TOLERANCE;
    const itemsTotal = items.reduce(
        (sum, item) => sum + asNumber(item.total),
        0,
    );
    const itemMismatch =
        items.length > 0 && Math.abs(itemsTotal - total) > TOLERANCE;
    const effectiveRate =
        fields.tax_code === 'standard' ? asNumber(vatRate) / 100 : 0;
    const expectedVat = subtotal * effectiveRate;
    const vatMismatch = Math.abs(vat - expectedVat) > Math.max(1, TOLERANCE);
    const trn = fields.vendor_trn.replace(/\D/g, '');
    const confidence = confidencePercent(invoice.confidence_score);

    const issues: string[] = [];

    if (!trn) {
        issues.push(
            'Supplier TRN is missing. Confirm the vendor registration number before requesting approval.',
        );
    } else if (trn.length !== 15) {
        issues.push(
            `Supplier TRN contains ${trn.length} digits; 15 digits are expected for UAE suppliers.`,
        );
    }

    if (hasAmounts && summaryMismatch) {
        issues.push(
            `Subtotal + VAT (${formatCurrency(subtotal + vat, currency)}) does not match the invoice total (${formatCurrency(total, currency)}).`,
        );
    }

    if (itemMismatch) {
        issues.push(
            `Line items total (${formatCurrency(itemsTotal, currency)}) does not match the invoice total (${formatCurrency(total, currency)}).`,
        );
    }

    if (hasAmounts && vatMismatch) {
        issues.push(
            `VAT amount (${formatCurrency(vat, currency)}) does not match the expected ${formatCurrency(expectedVat, currency)} for ${humanize(fields.tax_code)}.`,
        );
    }

    const checks: Check[] = [
        {
            label: 'Subtotal + VAT',
            detail: `${formatCurrency(subtotal, currency)} + ${formatCurrency(vat, currency)} = ${formatCurrency(total, currency)}`,
            passed: hasAmounts && !summaryMismatch,
        },
        {
            label: 'Invoice total',
            detail: items.length
                ? `${formatCurrency(itemsTotal, currency)} across ${items.length} lines`
                : 'No line items extracted',
            passed: items.length > 0 && !itemMismatch,
        },
        {
            label: 'VAT rate',
            detail: `Expected ${formatCurrency(expectedVat, currency)} at ${
                fields.tax_code === 'standard'
                    ? formatPercent(vatRate)
                    : humanize(fields.tax_code)
            }`,
            passed: !vatMismatch,
        },
        {
            label: 'Supplier TRN',
            detail: trn ? `${trn.length} digits detected` : 'TRN missing',
            passed: trn.length === 15,
        },
        {
            label: 'Extraction confidence',
            detail: `${confidence}% model confidence`,
            passed: confidence >= 90,
        },
    ];

    const failed = checks.filter((check) => !check.passed).length;

    return (
        <Card>
            <CardHeader className="border-b bg-muted/30">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <CardTitle className="text-base">
                            Deterministic validation
                        </CardTitle>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Math is checked in PHP, never by the model.
                        </p>
                    </div>
                    <Badge variant={failed === 0 ? 'success' : 'warning'}>
                        {failed === 0
                            ? 'All checks passed'
                            : `${failed} issue${failed > 1 ? 's' : ''}`}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
                {issues.length > 0 && (
                    <Alert variant="warning">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="text-xs">
                            Manual review required
                        </AlertTitle>
                        <AlertDescription className="text-xs">
                            <ul className="ml-4 list-disc space-y-1">
                                {issues.map((issue) => (
                                    <li key={issue}>{issue}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2.5">
                    {checks.map((check) => (
                        <div
                            key={check.label}
                            className="flex items-start gap-3 rounded-lg border p-3"
                        >
                            <span
                                className={
                                    check.passed
                                        ? 'text-emerald-600'
                                        : 'text-amber-600'
                                }
                            >
                                {check.passed ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                    <AlertTriangle className="h-4 w-4" />
                                )}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-foreground">
                                    {check.label}
                                </p>
                                <p className="mt-0.5 text-[11px] text-muted-foreground">
                                    {check.detail}
                                </p>
                            </div>
                            <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground/60" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
