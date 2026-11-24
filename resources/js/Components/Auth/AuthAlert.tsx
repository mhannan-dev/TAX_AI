import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { Alert, AlertDescription } from '@/Components/ui/alert';
import { cn } from '@/lib/utils';

export default function AuthAlert({
    message,
    tone = 'success',
}: {
    message?: string;
    tone?: 'success' | 'destructive';
}) {
    if (!message) {
        return null;
    }

    const Icon = tone === 'success' ? CheckCircle2 : AlertCircle;

    return (
        <Alert
            variant={tone}
            className={cn(
                tone === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : '',
            )}
        >
            <Icon className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
