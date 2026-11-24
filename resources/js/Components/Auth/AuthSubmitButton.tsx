import { LoaderCircle } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/Components/ui/button';

export default function AuthSubmitButton({
    processing,
    children,
}: {
    processing: boolean;
    children: ReactNode;
}) {
    return (
        <Button type="submit" className="w-full" disabled={processing}>
            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {children}
        </Button>
    );
}
