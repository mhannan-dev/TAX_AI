import type { ReactNode } from 'react';

export default function PageHeading({
    eyebrow,
    title,
    description,
    actions,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    actions?: ReactNode;
}) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
                {eyebrow && (
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">
                        {eyebrow}
                    </p>
                )}
                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {title}
                </h2>
                {description && (
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}
