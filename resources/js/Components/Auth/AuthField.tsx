import type { ReactNode } from 'react';

import { Label } from '@/Components/ui/label';

export default function AuthField({
    id,
    label,
    error,
    children,
}: {
    id: string;
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
        </div>
    );
}
