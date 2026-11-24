import type { ReactNode } from 'react';

import { Label } from '@/Components/ui/label';

export default function ExtractedField({
    label,
    htmlFor,
    hint,
    children,
}: {
    label: string;
    htmlFor?: string;
    hint?: string;
    children: ReactNode;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
            {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
        </div>
    );
}
