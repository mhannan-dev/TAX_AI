import { router, usePage } from "@inertiajs/react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useRef, useState, type RefObject } from "react";

import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import type { Approval } from "@/types/domain";
import ApprovalPayloadViewer from "./ApprovalPayloadViewer";
import type { PageProps } from "@/types";

export default function ApproveDialog({
    approval,
    open,
    onOpenChange,
    onApproved,
    returnFocusRef,
}: {
    approval: Approval;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApproved?: (message: string) => void;
    returnFocusRef?: RefObject<HTMLButtonElement>;
}) {
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { auth, organization } = usePage<PageProps>().props;
    const cancelRef = useRef<HTMLButtonElement>(null);

    const approve = () => {
        if (processing) {
            return;
        }
        setError(null);
        setProcessing(true);
        router.post(
            route("approvals.approve", approval.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onError: (errors) => setError(Object.values(errors).join(" ")),
                onSuccess: (page) => {
                    const resolved = (
                        page.props.approvals as Approval[] | undefined
                    )?.find((item) => item.id === approval.id);
                    if (
                        resolved?.status !== "approved" ||
                        resolved.approved_by !== auth.user.id
                    ) {
                        setError(
                            "This proposal could not be confirmed as your approval. Review the latest queue before retrying.",
                        );
                        return;
                    }
                    onOpenChange(false);
                    onApproved?.("Journal entry approved and posted.");
                },
            },
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!processing) {
                    setError(null);
                    onOpenChange(value);
                }
            }}
        >
            <DialogContent
                className="max-h-[90dvh] overflow-y-auto"
                aria-busy={processing}
                onOpenAutoFocus={(event) => {
                    event.preventDefault();
                    cancelRef.current?.focus();
                }}
                onCloseAutoFocus={(event) => {
                    if (returnFocusRef?.current) {
                        event.preventDefault();
                        returnFocusRef.current.focus();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle>Approve and post this entry?</DialogTitle>
                    <DialogDescription>
                        This action writes the proposed journal entry to the
                        ledger and records your attribution in the audit trail.
                    </DialogDescription>
                </DialogHeader>

                <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">
                        {approval.invoice?.vendor_name ?? "Unknown vendor"}
                    </p>
                    <p className="mt-1 font-mono text-[11px]">
                        {approval.invocation_id}
                    </p>
                </div>
                <ApprovalPayloadViewer
                    payload={approval.proposed_payload}
                    currency={organization?.currency ?? "$"}
                />
                <p className="text-xs text-muted-foreground">
                    You are confirming as {auth.user.name}. Review the amounts
                    and account before posting.
                </p>
                {error && (
                    <p role="alert" className="text-sm text-destructive">
                        {error}
                    </p>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        ref={cancelRef}
                        disabled={processing}
                        onClick={() => {
                            setError(null);
                            onOpenChange(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="success"
                        onClick={approve}
                        disabled={processing}
                    >
                        {processing && (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        )}
                        <CheckCircle2 className="h-4 w-4" />
                        {processing ? "Posting…" : "Approve & post"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
