import { FileSearch, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Card } from '@/Components/ui/card';

export default function EmptyState({
    title,
    description,
    icon: Icon = FileSearch,
    action,
}: {
    title: string;
    description: string;
    icon?: LucideIcon;
    action?: ReactNode;
}) {
    return (
        <Card className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-sm font-semibold text-foreground">
                {title}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {description}
            </p>
            {action && <div className="mt-5">{action}</div>}
        </Card>
    );
}
