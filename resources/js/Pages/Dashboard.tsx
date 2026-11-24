import AppShell from "@/Components/App/AppShell";
import EmptyState from "@/Components/App/EmptyState";
import MetricCard from "@/Components/App/MetricCard";
import PageHeading from "@/Components/App/PageHeading";
import ApprovalPayloadViewer from "@/Components/Approvals/ApprovalPayloadViewer";
import InvoiceTable from "@/Components/Invoices/InvoiceTable";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";
import { Skeleton } from "@/Components/ui/skeleton";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    ArrowRight,
    CircleCheckBig,
    ClipboardList,
    Clock3,
    Files,
    LoaderCircle,
    Percent,
    Plus,
    ShieldCheck,
    UploadCloud,
} from "lucide-react";

import {
    formatCurrency,
    formatDateTime,
    formatPercent,
    humanize,
} from "@/lib/format";
import type { PageProps } from "@/types";
import type { Approval, DashboardMetric, Invoice } from "@/types/domain";

type DashboardMetrics = {
    documents: number;
    processing: number;
    queued: number;
    parsed: number;
    pendingApproval: number;
    posted: number;
    vat: string | number;
    exceptions: number;
};

type Props = {
    metrics: DashboardMetrics;
    recentInvoices?: Invoice[];
    pendingApprovals?: Approval[];
};

export default function Dashboard({
    metrics,
    recentInvoices,
    pendingApprovals,
}: Props) {
    const { auth, organization } = usePage<PageProps>().props;
    const currency = organization?.currency ?? "$";
    const vatRate = organization?.default_vat_rate ?? "5.00";
    const firstName = auth.user.name.split(" ")[0];

    const cards: Array<DashboardMetric & { icon: typeof Files; href: string }> =
        [
            {
                label: "Processing",
                value: metrics.processing,
                detail: `${metrics.queued} queued · ${metrics.parsed} parsed`,
                tone: "slate",
                icon: LoaderCircle,
                href: route("invoices.index"),
            },
            {
                label: "Pending approval",
                value: metrics.pendingApproval,
                detail: "Human review required",
                tone: "amber",
                icon: ClipboardList,
                href: route("approvals.index"),
            },
            {
                label: "Posted",
                value: metrics.posted,
                detail: "Ledger entries complete",
                tone: "emerald",
                icon: CircleCheckBig,
                href: route("invoices.index"),
            },
            {
                label: "VAT tracked",
                value: formatCurrency(metrics.vat, currency),
                detail: `${formatPercent(vatRate)} organization rate`,
                tone: "slate",
                icon: Percent,
                href: route("invoices.index"),
            },
        ];

    const completion = metrics.documents
        ? Math.round(
              ((metrics.posted + metrics.pendingApproval) / metrics.documents) *
                  100,
          )
        : 0;

    return (
        <AppShell
            title="Dashboard"
            description="A live view of extraction, approval and posting activity."
            actions={
                <Button asChild>
                    <Link href={route("invoices.index")}>
                        <Plus className="h-4 w-4" />
                        Upload document
                    </Link>
                </Button>
            }
        >
            <Head title="Dashboard" />

            <Card className="mb-6 border-slate-800 bg-slate-950 text-white">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Organization
                        </p>
                        <p className="mt-1 truncate text-lg font-semibold">
                            {organization?.name ?? "No organization configured"}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                            TRN {organization?.trn ?? "—"} · {metrics.documents}{" "}
                            documents in the pipeline
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Badge
                            variant="outline"
                            className="border-slate-700 bg-white/5 text-slate-200"
                        >
                            {currency}
                        </Badge>
                        <Badge
                            variant="outline"
                            className="border-slate-700 bg-white/5 text-slate-200"
                        >
                            VAT {formatPercent(vatRate)}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <PageHeading
                eyebrow="Overview"
                title={`Good to see you, ${firstName}`}
                description="Review extracted documents and approve journal proposals before they reach the ledger."
            />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <MetricCard key={card.label} {...card} />
                ))}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-6">
                    <Card className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between gap-4 border-b py-4">
                            <div>
                                <CardTitle className="text-base">
                                    Recent invoice activity
                                </CardTitle>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Latest extraction and review updates
                                </p>
                            </div>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={route("invoices.index")}>
                                    View all
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </CardHeader>
                        {recentInvoices === undefined ? (
                            <CardContent className="space-y-3 pt-5">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        className="h-12 w-full"
                                    />
                                ))}
                            </CardContent>
                        ) : recentInvoices.length === 0 ? (
                            <CardContent className="pt-5">
                                <EmptyState
                                    title="No documents yet"
                                    description="Upload a PDF or receipt to start the extraction pipeline."
                                    action={
                                        <Button asChild size="sm">
                                            <Link
                                                href={route("invoices.index")}
                                            >
                                                Upload document
                                            </Link>
                                        </Button>
                                    }
                                />
                            </CardContent>
                        ) : (
                            <InvoiceTable
                                invoices={recentInvoices}
                                currency={currency}
                                compact
                            />
                        )}
                    </Card>

                    <Card>
                        <CardHeader className="border-b py-4">
                            <CardTitle className="text-base">
                                Processing status
                            </CardTitle>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {completion}% of documents have reached review
                                or posting
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-5">
                            <Progress value={completion} className="h-2" />
                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    {
                                        label: "Queued for extraction",
                                        value: metrics.queued,
                                        indicator: "bg-amber-500",
                                    },
                                    {
                                        label: "Parsed and ready",
                                        value: metrics.parsed,
                                        indicator: "bg-emerald-500",
                                    },
                                ].map((stage) => (
                                    <div
                                        key={stage.label}
                                        className="space-y-2"
                                    >
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">
                                                {stage.label}
                                            </span>
                                            <span className="font-semibold text-foreground">
                                                {stage.value}
                                            </span>
                                        </div>
                                        <Progress
                                            value={
                                                metrics.documents
                                                    ? (stage.value /
                                                          metrics.documents) *
                                                      100
                                                    : 0
                                            }
                                            className="h-1.5"
                                            indicatorClassName={stage.indicator}
                                        />
                                    </div>
                                ))}
                            </div>
                            {metrics.processing === 0 ? (
                                <Alert variant="success">
                                    <ShieldCheck className="h-4 w-4" />
                                    <AlertTitle className="text-xs">
                                        Queue is clear
                                    </AlertTitle>
                                    <AlertDescription className="text-xs">
                                        No documents are waiting for extraction.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Alert>
                                    <Clock3 className="h-4 w-4" />
                                    <AlertDescription className="text-xs">
                                        {metrics.processing} document
                                        {metrics.processing === 1
                                            ? ""
                                            : "s"}{" "}
                                        still moving through validation.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between gap-3 border-b py-4">
                            <div>
                                <CardTitle className="text-base">
                                    Approval queue
                                </CardTitle>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Proposed ledger entries
                                </p>
                            </div>
                            <Badge variant="warning">
                                {metrics.pendingApproval}
                            </Badge>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {pendingApprovals === undefined ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 2 }).map(
                                        (_, index) => (
                                            <Skeleton
                                                key={index}
                                                className="h-20 w-full"
                                            />
                                        ),
                                    )}
                                </div>
                            ) : pendingApprovals.length === 0 ? (
                                <div className="flex flex-col items-center gap-3 py-8 text-center">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                        <CircleCheckBig className="h-4 w-4" />
                                    </span>
                                    <p className="text-xs font-medium text-foreground">
                                        Queue is clear
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        Nothing is waiting for human approval.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingApprovals.map((approval) => (
                                        <div
                                            key={approval.id}
                                            className="rounded-lg border p-3"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="truncate text-xs font-medium text-foreground">
                                                    {approval.invoice
                                                        ?.vendor_name ??
                                                        approval.invoice
                                                            ?.file_name ??
                                                        "Unlinked invoice"}
                                                </p>
                                                <span className="shrink-0 text-[10px] text-muted-foreground">
                                                    {formatDateTime(
                                                        approval.created_at,
                                                    )}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-[11px] text-muted-foreground">
                                                {humanize(approval.agent_name)}
                                            </p>
                                            <ApprovalPayloadViewer
                                                payload={
                                                    approval.proposed_payload
                                                }
                                                currency={currency}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Button
                                asChild
                                variant="outline"
                                className="mt-4 w-full"
                            >
                                <Link href={route("approvals.index")}>
                                    Open approval queue
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="border-b py-4">
                            <CardTitle className="text-base">
                                Quick actions
                            </CardTitle>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Continue the review workflow
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-2 pt-4">
                            <Button asChild className="w-full justify-start">
                                <Link href={route("invoices.index")}>
                                    <UploadCloud className="h-4 w-4" />
                                    Upload invoice
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full justify-start"
                            >
                                <Link href={route("invoices.index")}>
                                    <Files className="h-4 w-4" />
                                    Review documents
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full justify-start"
                            >
                                <Link href={route("approvals.index")}>
                                    <ClipboardList className="h-4 w-4" />
                                    Review approvals
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-950 text-white">
                        <CardContent className="p-5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                                Tax Copilot
                            </p>
                            <h3 className="mt-3 text-lg font-semibold">
                                Ask compliance questions
                            </h3>
                            <p className="mt-2 text-xs leading-5 text-slate-300">
                                Grounded answers from UAE VAT, Corporate Tax and
                                internal policies—with cited sources.
                            </p>
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="mt-5 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                            >
                                <Link href={route("knowledge.index")}>
                                    Open knowledge library
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}
