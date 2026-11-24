import { Head, Link } from "@inertiajs/react";
import {
    ArrowRight,
    BadgeCheck,
    BookOpenCheck,
    FileScan,
    ScanLine,
    ShieldCheck,
    Workflow,
} from "lucide-react";

import BrandMark from "@/Components/App/BrandMark";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import type { PageProps } from "@/types";

const features = [
    {
        icon: FileScan,
        title: "Structured extraction",
        description:
            "PDFs and receipts become validated vendor, TRN, line-item and VAT data.",
    },
    {
        icon: Workflow,
        title: "Approval gates",
        description:
            "AI proposes journal entries; humans approve the exact payload before posting.",
    },
    {
        icon: BookOpenCheck,
        title: "RAG tax copilot",
        description:
            "Ask policy questions and get answers grounded in your indexed tax library.",
    },
];

const phases = [
    "Ingest invoice",
    "Extract + validate",
    "Human approval",
    "Post to ledger",
];

export default function Welcome({
    auth,
    canLogin,
    canRegister,
}: PageProps<{ canLogin: boolean; canRegister: boolean }>) {
    return (
        <>
            <Head title="Tax Autopilot" />

            <div className="min-h-screen bg-background">
                <header className="border-b bg-card/80 backdrop-blur">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
                        <Link href="/">
                            <BrandMark tone="light" />
                        </Link>
                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Button asChild>
                                    <Link href={route("dashboard")}>
                                        Dashboard
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    {canLogin && (
                                        <Button asChild variant="ghost">
                                            <Link href={route("login")}>
                                                Log in
                                            </Link>
                                        </Button>
                                    )}
                                    {canRegister && (
                                        <Button asChild>
                                            <Link href={route("register")}>
                                                Get started
                                            </Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main>
                    <section className="relative overflow-hidden border-b bg-slate-950 text-white">
                        <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-emerald-500/20 blur-3xl" />
                        <div className="absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-indigo-500/20 blur-3xl" />

                        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
                            <div>
                                <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/10">
                                    Deterministic AI for financial compliance
                                </Badge>
                                <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                                    Invoice autopilot with an
                                    <span className="block text-emerald-400">
                                        audit trail built in.
                                    </span>
                                </h1>
                                <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
                                    Tax Autopilot sits between raw documents and your
                                    general ledger—extracting, validating and
                                    explaining every figure before a human
                                    accountant approves the post.
                                </p>
                                <div className="mt-8 flex flex-wrap gap-3">
                                    {auth.user ? (
                                        <Button asChild size="lg">
                                            <Link href={route("dashboard")}>
                                                Open dashboard
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button asChild size="lg">
                                            <Link href={route("register")}>
                                                Start free
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    )}
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                                    >
                                        <Link href={route("knowledge.index")}>
                                            Explore tax copilot
                                        </Link>
                                    </Button>
                                </div>
                                <div className="mt-10 flex flex-wrap gap-6 text-xs text-slate-400">
                                    <span className="flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                        UAE VAT + Corporate Tax
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <BadgeCheck className="h-4 w-4 text-emerald-400" />
                                        Human-in-the-loop posting
                                    </span>
                                </div>
                            </div>

                            <div className="relative">
                                <Card className="border-white/10 bg-white/[0.06] p-5 text-white shadow-2xl backdrop-blur">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-slate-300">
                                            <ScanLine className="h-4 w-4 text-emerald-400" />
                                            invoice_4821.pdf
                                        </div>
                                        <Badge
                                            variant="warning"
                                            className="text-[10px]"
                                        >
                                            Pending approval
                                        </Badge>
                                    </div>
                                    <div className="mt-5 space-y-3">
                                        {[
                                            ["Vendor", "Al Futtaim Supplies"],
                                            ["TRN", "100123456700003"],
                                            ["Subtotal", "$4,200.00"],
                                            ["VAT 5%", "$210.00"],
                                            ["Total", "$4,410.00"],
                                        ].map(([label, value]) => (
                                            <div
                                                key={label}
                                                className="flex items-center justify-between border-b border-white/10 pb-2 text-xs"
                                            >
                                                <span className="text-slate-400">
                                                    {label}
                                                </span>
                                                <span className="font-medium">
                                                    {value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs leading-5 text-emerald-200">
                                        Proposed: Debit Office Supplies $4,200 ·
                                        Debit Input VAT $210 · Credit Bank $4,410
                                    </div>
                                    <div className="mt-5 flex gap-2">
                                        <Button className="flex-1" size="sm">
                                            Approve &amp; post
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-6xl px-5 py-20">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                                Built for accounting teams
                            </p>
                            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                                Automation without losing control.
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                Every AI action is schema-validated,
                                math-checked and paused for review. No silent
                                ledger writes.
                            </p>
                        </div>

                        <div className="mt-10 grid gap-5 md:grid-cols-3">
                            {features.map((feature) => {
                                const Icon = feature.icon;

                                return (
                                    <Card key={feature.title} className="p-6">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <h3 className="mt-4 text-base font-semibold text-foreground">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </Card>
                                );
                            })}
                        </div>

                        <div className="mt-14 rounded-2xl border bg-card p-6 sm:p-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                Processing pipeline
                            </p>
                            <div className="mt-5 grid gap-3 sm:grid-cols-4">
                                {phases.map((phase, index) => (
                                    <div
                                        key={phase}
                                        className="relative rounded-xl border bg-background p-4"
                                    >
                                        <span className="text-xs font-semibold text-emerald-600">
                                            0{index + 1}
                                        </span>
                                        <p className="mt-2 text-sm font-medium text-foreground">
                                            {phase}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t py-8 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Tax Autopilot
                </footer>
            </div>
        </>
    );
}
