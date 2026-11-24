import { ArrowUpRight, type LucideIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';

import { Card } from '@/Components/ui/card';
import { cn } from '@/lib/utils';

const toneStyles = {
    slate: 'bg-slate-100 text-slate-700',
    amber: 'bg-amber-100 text-amber-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    rose: 'bg-rose-100 text-rose-700',
} as const;

export default function MetricCard({
    label,
    value,
    detail,
    tone,
    icon: Icon,
    href,
}: {
    label: string;
    value: number | string;
    detail: string;
    tone: keyof typeof toneStyles;
    icon: LucideIcon;
    href?: string;
}) {
    const content = (
        <Card className="group h-full p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        {label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                        {value}
                    </p>
                </div>
                <span
                    className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                        toneStyles[tone],
                    )}
                >
                    <Icon className="h-5 w-5" />
                </span>
            </div>
            <div className="mt-5 flex items-center justify-between border-t pt-3">
                <p className="text-xs text-muted-foreground">{detail}</p>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
        </Card>
    );

    if (!href) {
        return content;
    }

    return (
        <Link href={href} className="block h-full">
            {content}
        </Link>
    );
}
