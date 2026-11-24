import { router } from '@inertiajs/react';
import { LoaderCircle, XCircle } from 'lucide-react';
import { useId, useState, type RefObject } from 'react';

import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import type { Approval } from '@/types/domain';

export default function RejectDialog({
    approval,
    open,
    onOpenChange,
    onRejected,
    returnFocusRef,
}: {
    approval: Approval;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRejected?: (message: string) => void;
    returnFocusRef?: RefObject<HTMLButtonElement>;
}) {
    const [note, setNote] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const noteId = useId();

    const reject = () => {
        if (processing || note.trim().length < 3) {
            return;
        }

        setProcessing(true);
        setError(null);
        router.post(
            route('approvals.reject', approval.id),
            { note: note.trim() },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onError: (errors) => setError(Object.values(errors).join(' ')),
                onSuccess: (page) => {
                    const resolved = (page.props.approvals as Approval[] | undefined)?.find((item) => item.id === approval.id);
                    if (resolved?.status !== 'rejected' || resolved.rejection_note !== note.trim()) {
                        setError('This proposal has changed. Review the latest queue before retrying.');
                        return;
                    }
                    setNote('');
                    onOpenChange(false);
                    onRejected?.('Proposal rejected with note.');
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={(value) => { if (!processing) { setError(null); setNote(''); onOpenChange(value); } }}>
            <DialogContent aria-busy={processing} onCloseAutoFocus={(event) => { if (returnFocusRef?.current) { event.preventDefault(); returnFocusRef.current.focus(); } }}>
                <DialogHeader>
                    <DialogTitle>Reject this proposal</DialogTitle>
                    <DialogDescription>
                        Your note is stored against the invocation for audit and
                        kept with this proposal. Rejection does not post an entry.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    <p className="text-sm font-medium">{approval.invoice?.vendor_name ?? 'Unlinked invoice'}</p>
                    <p className="break-all font-mono text-xs text-muted-foreground">{approval.invocation_id}</p>
                    <Label htmlFor={noteId}>Reason (required)</Label>
                    <Textarea
                        id={noteId}
                        required
                        minLength={3}
                        disabled={processing}
                        aria-invalid={!!error || (note.length > 0 && note.trim().length < 3)}
                        aria-describedby={`${noteId}-help`}
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="e.g. Account category should be Software Subscriptions"
                        rows={4}
                    />
                        <p id={`${noteId}-help`} className="text-xs text-muted-foreground">
                            Please provide at least 3 characters.
                        </p>
                    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        disabled={processing}
                        onClick={() => { setError(null); setNote(''); onOpenChange(false); }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={reject}
                        disabled={processing || note.trim().length < 3}
                    >
                        {processing && (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        )}
                        <XCircle className="h-4 w-4" />
                        {processing ? 'Rejecting…' : 'Reject proposal'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
