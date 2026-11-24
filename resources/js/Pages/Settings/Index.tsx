import AppShell from '@/Components/App/AppShell';
import PageHeading from '@/Components/App/PageHeading';
import AccountsTable from '@/Components/Settings/AccountsTable';
import OrganizationCard from '@/Components/Settings/OrganizationCard';
import type { WorkspacePreferences } from '@/Components/Settings/OrganizationCard';
import type { ProviderRoute } from '@/Components/Settings/ProviderRoutingCard';
import ProviderRoutingCard from '@/Components/Settings/ProviderRoutingCard';
import VatPolicyCard from '@/Components/Settings/VatPolicyCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Head, usePage } from '@inertiajs/react';

import type { PageProps } from '@/types';
import type { ChartAccount } from '@/types/domain';

export default function SettingsIndex({ accounts, updateUrl, preferences, providerRoutes }: { accounts: ChartAccount[]; updateUrl?: string; preferences?: WorkspacePreferences; providerRoutes?: ProviderRoute[] }) {
    const { organization } = usePage<PageProps>().props;

    return (
        <AppShell
            title="Settings"
            description="Organization, AI routing and compliance configuration."
        >
            <Head title="Settings" />

            <PageHeading
                eyebrow="Administration"
                title="Workspace settings"
                description="Configure tenant details, chart of accounts and the cost-aware AI provider routing."
            />

            <nav aria-label="Settings sections" className="mb-6 flex flex-wrap gap-2 rounded-xl border bg-card p-3">{[['organization', 'Organization'], ['preferences', 'Audit & notifications'], ['providers', 'AI routing'], ['accounts', 'Chart of accounts']].map(([id, label]) => <a key={id} href={`#${id}`} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600">{label}</a>)}</nav>
            <div className="grid items-start gap-6 xl:grid-cols-2">
                <OrganizationCard key={organization?.id} organization={organization} updateUrl={updateUrl} preferences={preferences} />
                <VatPolicyCard />
                <ProviderRoutingCard routes={providerRoutes} />

                <Card id="accounts" className="scroll-mt-24 overflow-hidden">
                    <CardHeader className="border-b bg-muted/30">
                        <CardTitle className="text-base">
                            Chart of accounts
                        </CardTitle>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Categories available to the categorization agent.
                        </p>
                    </CardHeader>
                    <CardContent className="p-0">
                        <AccountsTable accounts={accounts} />
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
