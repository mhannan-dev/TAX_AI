import { BookOpenCheck } from 'lucide-react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import type { ChartAccount } from '@/types/domain';

export default function AccountsTable({ accounts }: { accounts: ChartAccount[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>Code</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="w-10" />
                </TableRow>
            </TableHeader>
            <TableBody>
                {accounts.length === 0 && <TableRow><TableCell colSpan={4} className="p-6 text-center text-sm text-muted-foreground">No chart-of-account categories have been configured.</TableCell></TableRow>}
                {accounts.map((account) => (
                    <TableRow key={account.id}>
                        <TableCell className="font-mono text-xs font-medium text-foreground">
                            {account.code}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-foreground">
                            {account.name}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                            {account.account_type}
                        </TableCell>
                        <TableCell>
                            <BookOpenCheck className="h-3.5 w-3.5 text-muted-foreground/70" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
