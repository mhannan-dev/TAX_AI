import { Badge } from '@/Components/ui/badge';
import { formatCurrency, humanize } from '@/lib/format';
import type { ApprovalPayload } from '@/types/domain';

export default function ApprovalPayloadViewer({
    payload,
    currency,
}: {
    payload: ApprovalPayload;
    currency: string;
}) {
    const rows = [
        {
            label: 'Account',
            value: payload.account_name
                ? `${payload.account_code ?? ''} · ${payload.account_name}`.trim()
                : '—',
        },
        {
            label: 'Debit',
            value: formatCurrency(payload.debit, currency),
        },
        {
            label: 'Credit',
            value: formatCurrency(payload.credit, currency),
        },
        {
            label: 'VAT',
            value: formatCurrency(payload.vat_amount, currency),
        },
        {
            label: 'Tax code',
            value: humanize(payload.tax_code),
        },
        {
            label: 'Confidence',
            value: payload.confidence !== undefined && payload.confidence !== '' && Number.isFinite(Number(payload.confidence)) ? `${Number(payload.confidence).toFixed(1)}%` : 'Not supplied',
        },
    ];

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {rows.map((row) => (
                    <div
                        key={row.label}
                        className="rounded-lg border bg-muted/30 p-2.5"
                    >
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {row.label}
                        </p>
                        <p className="mt-1 break-words text-xs font-medium text-foreground">
                            {row.value}
                        </p>
                    </div>
                ))}
            </div>

            {payload.reason ? (
                <div className="rounded-lg bg-slate-950 p-3.5 text-xs leading-5 text-slate-300">
                    <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
                        Agent rationale
                    </p>
                    {payload.reason}
                </div>
            ) : <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">AI reasoning was not supplied. Review the invoice and proposed payload before deciding.</p>}

            {payload.invocation_id && <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className="font-mono text-[10px]">
                    {payload.invocation_id ?? '—'}
                </Badge>
            </div>}
            <details className="rounded-lg border p-3 text-xs">
                <summary className="cursor-pointer font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600">Exact proposed journal payload</summary>
                <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded bg-muted p-3 font-mono text-[11px]">{JSON.stringify(payload, null, 2)}</pre>
            </details>
        </div>
    );
}
