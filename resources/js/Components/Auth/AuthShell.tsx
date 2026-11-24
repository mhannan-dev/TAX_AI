import { Link } from '@inertiajs/react';
import {
    BadgeCheck,
    FileScan,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import type { ReactNode } from 'react';

import BrandMark from '@/Components/App/BrandMark';
import FlashToast from '@/Components/App/FlashToast';

const highlights = [
    {
        icon: FileScan,
        title: 'Structured extraction',
        description: 'Invoices become validated, auditable data.',
    },
    {
        icon: BadgeCheck,
        title: 'Human approval gates',
        description: 'Nothing posts to the ledger unreviewed.',
    },
    {
        icon: ShieldCheck,
        title: 'UAE VAT ready',
        description: 'TRN, VAT and policy checks built in.',
    },
];

export default function AuthShell({
    title,
    subtitle,
    children,
    footer,
}: {
    title: string;
    subtitle: string;
    children: ReactNode;
    footer?: ReactNode;
}) {
    return (
        <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <FlashToast />

            <div className="relative hidden overflow-hidden bg-slate-950 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
                <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="relative">
                    <BrandMark />
                </div>

                <div className="relative max-w-lg">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-emerald-300">
                        <Sparkles className="h-3 w-3" />
                        Pre-accounting autopilot
                    </div>
                    <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight">
                        From receipt to ledger,
                        <span className="block text-emerald-400">
                            with proof at every step.
                        </span>
                    </h1>
                    <p className="mt-4 text-sm leading-6 text-slate-300">
                        Tax Autopilot turns messy invoices into deterministic journal
                        entries, then pauses for an accountant before anything
                        reaches the books.
                    </p>

                    <div className="mt-10 space-y-5">
                        {highlights.map((highlight) => {
                            const Icon = highlight.icon;

                            return (
                                <div
                                    key={highlight.title}
                                    className="flex items-start gap-3"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-emerald-400">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {highlight.title}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-400">
                                            {highlight.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <p className="relative text-xs text-slate-500">
                    © {new Date().getFullYear()} Tax Autopilot. Built for auditable AI.
                </p>
            </div>

            <div className="flex flex-col bg-background px-5 py-8 sm:px-10 lg:justify-center lg:px-16">
                <div className="mb-8 lg:hidden">
                    <Link href="/">
                        <BrandMark tone="light" />
                    </Link>
                </div>

                <div className="mx-auto w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                            {title}
                        </h2>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            {subtitle}
                        </p>
                    </div>

                    {children}

                    {footer && (
                        <div className="mt-8 border-t pt-6 text-sm text-muted-foreground">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
