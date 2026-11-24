import { Badge } from '@/Components/ui/badge';
import {
    approvalStatusTone,
    humanize,
    invoiceStatusTone,
} from '@/lib/format';

export default function StatusBadge({
    status,
    kind = 'invoice',
}: {
    status: string;
    kind?: 'invoice' | 'approval';
}) {
    const tone =
        kind === 'approval'
            ? approvalStatusTone(status)
            : invoiceStatusTone(status);

    return <Badge variant={tone}>{humanize(status)}</Badge>;
}
