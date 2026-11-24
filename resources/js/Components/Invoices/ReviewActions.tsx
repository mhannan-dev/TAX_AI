import { Link, router } from '@inertiajs/react';
import { ArrowRight, Send, ShieldCheck, XCircle } from 'lucide-react';
import { useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import { humanize } from '@/lib/format';
import type { Invoice } from '@/types/domain';

type Props = {
    invoice: Invoice;
    onAction?: (message: string) => void;
};

export default function ReviewActions({ invoice, onAction }: Props) {
    const [busy, setBusy] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const requestDisabled =
        busy || ['pending_approval', 'posted'].includes(invoice.status);
    const rejectDisabled =
        busy || ['rejected', 'posted'].includes(invoice.status);

    const send = (path: string, message: string) => {
        setBusy(true);
        router.post(path, {}, {
            preserveScroll: true,
            onFinish: () => setBusy(false),
            onSuccess: () => {
                setRejectOpen(false);
                onAction?.(message);
            },
        });
    };

    const statusMessage =
        invoice.status === 'pending_approval'
            ? 'A proposal is already waiting in the approval queue.'
            : invoice.status === 'posted'
              ? 'This invoice is posted and no further review action is available.'
              : invoice.status === 'rejected'
                ? 'This invoice is flagged for accountant review.'
                : `Current status: ${humanize(invoice.status)}.`;

    return (
        <Card>
            <CardContent className="space-y-4 p-4">
                <Alert>
                    <ShieldCheck className="h-4 w-4" />
                    <AlertTitle className="text-xs">
                        Posting requires human approval
                    </AlertTitle>
                    <AlertDescription className="text-xs">
                        Requesting approval creates a journal proposal only. An
                        accountant must approve it in the approval queue before
                        anything reaches the ledger.
                    </AlertDescription>
                </Alert>

                <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                        disabled={requestDisabled}
                        onClick={() =>
                            send(
                                route(
                                    'invoices.request-approval',
                                    invoice.id,
                                ),
                                'Journal proposal sent to the approval queue.',
                            )
                        }
                    >
                        {busy && !rejectOpen ? (
                            <Send className="h-4 w-4 animate-pulse" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                        Request approval
                    </Button>

                    <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="destructive"
                                disabled={rejectDisabled}
                            >
                                <XCircle className="h-4 w-4" />
                                Reject invoice
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Reject this invoice?</DialogTitle>
                                <DialogDescription>
                                    This returns the document to the accountant
                                    for review. It does not post or delete
                                    anything.
                                </DialogDescription>
                            </DialogHeader>
                            <p className="text-xs text-muted-foreground">
                                {invoice.file_name}
                            </p>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setRejectOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    disabled={busy}
                                    onClick={() =>
                                        send(
                                            route('invoices.reject', invoice.id),
                                            'Invoice rejected and returned for review.',
                                        )
                                    }
                                >
                                    Reject invoice
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <p className="text-[11px] text-muted-foreground">
                    {statusMessage}
                </p>

                <Button asChild variant="ghost" className="w-full">
                    <Link href={route('approvals.index')}>
                        Open approval queue
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
