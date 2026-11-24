import ActionToast from "@/Components/App/ActionToast";
import AppShell from "@/Components/App/AppShell";
import EmptyState from "@/Components/App/EmptyState";
import PageHeading from "@/Components/App/PageHeading";
import ApprovalCard from "@/Components/Approvals/ApprovalCard";
import { Badge } from "@/Components/ui/badge";
import { Card } from "@/Components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Head, usePage } from "@inertiajs/react";
import { CheckCircle2, Clock3, History, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/Components/ui/skeleton";

import type { PageProps } from "@/types";
import type { Approval } from "@/types/domain";

export default function ApprovalIndex({
    approvals,
}: {
    approvals?: Approval[];
}) {
    const { organization } = usePage<PageProps>().props;
    const [tab, setTab] = useState("pending");
    const [toast, setToast] = useState<string | null>(null);
    const currency = organization?.currency ?? "$";

    const items = approvals ?? [];
    const pending = items.filter((approval) => approval.status === "pending");
    const history = items.filter((approval) => approval.status !== "pending");

    const visible =
        tab === "pending" ? pending : tab === "history" ? history : items;

    const summaries = [
        {
            label: "Pending review",
            value: pending.length,
            icon: Clock3,
            tone: "text-amber-600 bg-amber-100",
        },
        {
            label: "Approved & posted",
            value: items.filter((item) => item.status === "approved").length,
            icon: CheckCircle2,
            tone: "text-emerald-600 bg-emerald-100",
        },
        {
            label: "Rejected",
            value: items.filter((item) => item.status === "rejected").length,
            icon: ShieldCheck,
            tone: "text-rose-600 bg-rose-100",
        },
    ];

    return (
        <AppShell
            title="Approval queue"
            description="Human-in-the-loop control over every ledger proposal."
        >
            <Head title="Approval Queue" />

            <PageHeading
                eyebrow="Approvable tools"
                title="Review AI proposals"
                description="Each invocation is paused before execution. Approve the exact payload or reject it with a note."
                actions={
                    <Badge variant="warning">
                        <Clock3 className="mr-1 h-3 w-3" />
                        {pending.length} pending
                    </Badge>
                }
            />

            <div className="grid gap-4 sm:grid-cols-3">
                {summaries.map((summary) => {
                    const Icon = summary.icon;

                    return (
                        <Card key={summary.label} className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        {summary.label}
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold text-foreground">
                                        {summary.value}
                                    </p>
                                </div>
                                <span
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${summary.tone}`}
                                >
                                    <Icon className="h-5 w-5" />
                                </span>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-6">
                <Tabs value={tab} onValueChange={setTab}>
                    <TabsList>
                        <TabsTrigger value="pending">
                            Pending ({pending.length})
                        </TabsTrigger>
                        <TabsTrigger value="history">
                            <History className="mr-1.5 h-3.5 w-3.5" />
                            History ({history.length})
                        </TabsTrigger>
                        <TabsTrigger value="all">All</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="mt-5 grid gap-6 2xl:grid-cols-2">
                {!approvals ? (
                    <div
                        role="status"
                        aria-label="Loading approvals"
                        className="space-y-4"
                    >
                        <Skeleton className="h-64" />
                        <Skeleton className="h-64" />
                    </div>
                ) : visible.length === 0 ? (
                    <div className="2xl:col-span-2">
                        <EmptyState
                            title="Nothing in this queue"
                            description="When an agent proposes a ledger entry, it will pause here for your review."
                        />
                    </div>
                ) : (
                    visible.map((approval) => (
                        <ApprovalCard
                            key={approval.id}
                            approval={approval}
                            currency={currency}
                            onAction={(message) => setToast(message)}
                        />
                    ))
                )}
            </div>

            <ActionToast message={toast} onDismiss={() => setToast(null)} />
        </AppShell>
    );
}
