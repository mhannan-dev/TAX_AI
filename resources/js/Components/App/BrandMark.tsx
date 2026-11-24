import { ScanLine } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function BrandMark({
    compact = false,
    tone = 'dark',
    className,
}: {
    compact?: boolean;
    tone?: 'dark' | 'light';
    className?: string;
}) {
    return (
        <div className={cn('flex items-center gap-2.5', className)}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-lg shadow-emerald-950/20">
                <ScanLine className="h-5 w-5" />
            </span>
            {!compact && (
                <span className="leading-tight">
                    <span
                        className={cn(
                            'block text-sm font-semibold tracking-tight',
                            tone === 'dark' ? 'text-white' : 'text-foreground',
                        )}
                    >
                        Tax
                    </span>
                    <span
                        className={cn(
                            'block text-[10px] font-medium uppercase tracking-[0.18em]',
                            tone === 'dark'
                                ? 'text-slate-400'
                                : 'text-muted-foreground',
                        )}
                    >
                        Autopilot
                    </span>
                </span>
            )}
        </div>
    );
}
