import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useEffect } from 'react';

import { cn } from '@/lib/utils';
import type { ToastTone } from '@/types';

export default function ActionToast({
    message,
    onDismiss,
    tone = 'success',
}: {
    message: string | null;
    onDismiss: () => void;
    tone?: ToastTone;
}) {
    useEffect(() => {
        if (!message) {
            return;
        }

        const timer = window.setTimeout(onDismiss, 3500);

        return () => window.clearTimeout(timer);
    }, [message, onDismiss]);

    if (!message) {
        return null;
    }

    const isError = tone === 'error';
    const Icon = isError ? AlertCircle : CheckCircle2;

    return (
        <div
            role={isError ? 'alert' : 'status'}
            className="fixed bottom-20 right-5 z-50 flex max-w-sm items-start gap-3 rounded-xl border bg-card p-3.5 shadow-xl"
        >
            <Icon
                className={cn(
                    'mt-0.5 h-4 w-4 shrink-0',
                    isError ? 'text-destructive' : 'text-emerald-600',
                )}
            />
            <p className="flex-1 text-xs leading-5 text-foreground">{message}</p>
            <button
                type="button"
                onClick={onDismiss}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Dismiss"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}
