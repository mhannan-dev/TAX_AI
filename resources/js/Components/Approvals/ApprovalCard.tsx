import { Link } from '@inertiajs/react';
import { Bot, Clock3, FileText, XCircle } from 'lucide-react';
import { useRef, useState } from 'react';

import ApproveDialog from '@/Components/Approvals/ApproveDialog';
import ApprovalPayloadViewer from '@/Components/Approvals/ApprovalPayloadViewer';
import RejectDialog from '@/Components/Approvals/RejectDialog';
import StatusBadge from '@/Components/App/StatusBadge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import { formatCurrency, formatDateTime, humanize } from '@/lib/format';
import type { Approval } from '@/types/domain';

export default function ApprovalCard({
    approval,
    currency,
    onAction,
}: {
    approval: Approval;
    currency: string;
    onAction?: (message: string) => void;
}) {
    const [approveOpen, setApproveOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const approveRef = useRef<HTMLButtonElement>(null);
    const rejectRef = useRef<HTMLButtonElement>(null);
    const isPending = approval.status === 'pending';

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 border-b bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                        <Bot className="h-4 w-4" />
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-foreground">
                            {humanize(approval.agent_name)}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Clock3 className="h-3 w-3" />
                            {formatDateTime(approval.created_at)}
                        </p>
                    </div>
                </div>
                <StatusBadge status={approval.status} kind="approval" />
            </CardHeader>

            <CardContent className="space-y-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <FileText className="h-4 w-4" />
                        </span>
                        <div>
                            <p className="text-xs font-medium text-foreground">
                                {approval.invoice?.vendor_name ??
                                    'Unlinked invoice'}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                                {approval.invoice?.file_name ?? '—'}
                            </p>
                        </div>
                    </div>
                    {approval.invoice && (
                        <Button asChild variant="link" size="sm">
                            <Link href={route('invoices.show', approval.invoice.id)}>
                                Review invoice
                            </Link>
                        </Button>
                    )}
                </div>

                <ApprovalPayloadViewer
                    payload={approval.proposed_payload}
                    currency={currency}
                />
                <dl className="grid grid-cols-2 gap-3 text-xs">
                    <div><dt className="text-muted-foreground">Extracted subtotal</dt><dd className="mt-1 font-medium">{formatCurrency(approval.invoice?.subtotal, currency)}</dd></div>
                    <div><dt className="text-muted-foreground">Extracted VAT</dt><dd className="mt-1 font-medium">{formatCurrency(approval.invoice?.vat_amount, currency)}</dd></div>
                    <div><dt className="text-muted-foreground">Extracted invoice total</dt><dd className="mt-1 font-medium">{formatCurrency(approval.invoice?.total, currency)}</dd></div>
                    <div><dt className="text-muted-foreground">Invocation</dt><dd className="mt-1 break-all font-mono">{approval.invocation_id}</dd></div>
                </dl>

                {approval.rejection_note && (
                    <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                        <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {approval.rejection_note}
                    </div>
                )}

                {approval.approved_at && (
                    <p className="text-[11px] text-muted-foreground">
                        Approved by {approval.approved_by ? `user #${approval.approved_by}` : 'unavailable approver'} · {formatDateTime(approval.approved_at)}
                    </p>
                )}

                {isPending && (
                    <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">Awaiting human review. AI confidence is advisory; no entry is posted until you explicitly approve.</p>
                )}
                {approval.status === 'rejected' && <p className="text-[11px] text-muted-foreground">{approval.rejected_by ? `Rejected by user #${approval.rejected_by}` : 'Rejection reviewer not supplied'} · {approval.rejected_at ? formatDateTime(approval.rejected_at) : 'Rejection time not supplied'}</p>}
                {isPending && (
                    <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row">
                        <Button
                            variant="success"
                            ref={approveRef}
                            className="flex-1"
                            onClick={() => setApproveOpen(true)}
                        >
                            Approve &amp; post
                        </Button>
                        <Button
                            variant="outline"
                            ref={rejectRef}
                            className="flex-1"
                            onClick={() => setRejectOpen(true)}
                        >
                            Reject with note
                        </Button>
                    </div>
                )}
            </CardContent>

            <ApproveDialog
                approval={approval}
                open={approveOpen}
                onOpenChange={setApproveOpen}
                onApproved={onAction}
                returnFocusRef={approveRef}
            />
            <RejectDialog
                approval={approval}
                open={rejectOpen}
                onOpenChange={setRejectOpen}
                onRejected={onAction}
                returnFocusRef={rejectRef}
            />
        </Card>
    );
}
