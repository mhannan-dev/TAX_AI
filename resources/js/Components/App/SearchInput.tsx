import { Search } from 'lucide-react';

import { Input } from '@/Components/ui/input';
import { cn } from '@/lib/utils';

export default function SearchInput({
    value,
    onChange,
    placeholder = 'Search...',
    className,
    ariaLabel,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    ariaLabel?: string;
}) {
    return (
        <div className={cn('relative w-full sm:max-w-xs', className)}>
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="pl-9"
                aria-label={ariaLabel ?? placeholder}
            />
        </div>
    );
}
