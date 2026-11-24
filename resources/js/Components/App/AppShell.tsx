import { usePage } from '@inertiajs/react';
import type { PropsWithChildren, ReactNode } from 'react';

import AppHeader from '@/Components/App/AppHeader';
import AppSidebar from '@/Components/App/AppSidebar';
import FlashToast from '@/Components/App/FlashToast';
import TaxCopilotDrawer from '@/Components/Knowledge/TaxCopilotDrawer';
import { TooltipProvider } from '@/Components/ui/tooltip';
import type { PageProps } from '@/types';

export default function AppShell({
    title,
    description,
    actions,
    children,
}: PropsWithChildren<{
    title: string;
    description?: string;
    actions?: ReactNode;
}>) {
    const { approvalsCount, organization } =
        usePage<PageProps>().props;

    return (
        <TooltipProvider delayDuration={200}>
            <div className="min-h-screen bg-background">
                <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
                    <AppSidebar
                        approvalsCount={approvalsCount}
                        organization={organization}
                    />
                </aside>

                <div className="lg:pl-64">
                    <AppHeader
                        title={title}
                        description={description}
                        actions={actions}
                    />
                    <main className="mx-auto w-full max-w-[1600px] px-4 py-6 lg:px-8 lg:py-8">
                        {children}
                    </main>
                </div>

                <TaxCopilotDrawer />
                <FlashToast />
            </div>
        </TooltipProvider>
    );
}
