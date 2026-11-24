import { LockKeyhole, ShieldCheck, Sigma } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

const rules = [
    {
        icon: Sigma,
        title: 'Verify tax arithmetic',
        description:
            'Review the extracted subtotal, VAT and total against the source invoice before approving a proposal.',
    },
    {
        icon: LockKeyhole,
        title: 'Approvable gate',
        description:
            'Queue proposals remain pending until an accountant explicitly approves or rejects them.',
    },
    {
        icon: ShieldCheck,
        title: 'Attribution',
        description:
            'Approved proposals show the recorded approver and approval time. Rejected proposals retain the reason supplied by the reviewer.',
    },
];

export default function VatPolicyCard() {
    return (
        <Card>
            <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-base">Compliance guardrails</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                    Accountant review remains central to every decision.
                </p>
            </CardHeader>
            <CardContent className="pt-5">
                <div className="space-y-4">
                    {rules.map((rule) => {
                        const Icon = rule.icon;

                        return (
                            <div key={rule.title} className="flex gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                    <Icon className="h-4 w-4" />
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {rule.title}
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                        {rule.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
