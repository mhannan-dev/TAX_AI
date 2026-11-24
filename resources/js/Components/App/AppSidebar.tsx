import { Link } from '@inertiajs/react';
import {
    BookOpenText,
    CircleCheckBig,
    FileText,
    LayoutDashboard,
    LifeBuoy,
    Settings2,
    UserRound,
} from 'lucide-react';

import BrandMark from '@/Components/App/BrandMark';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import type { Organization } from '@/types/domain';

type NavItem = {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
    match: string;
    count?: number;
};

const workspaceItems = (count: number): NavItem[] => [
    {
        label: 'Dashboard',
        href: route('dashboard'),
        icon: LayoutDashboard,
        match: 'dashboard',
    },
    {
        label: 'Invoices',
        href: route('invoices.index'),
        icon: FileText,
        match: 'invoices',
    },
    {
        label: 'Approval queue',
        href: route('approvals.index'),
        icon: CircleCheckBig,
        match: 'approvals',
        count,
    },
];

const intelligenceItems: NavItem[] = [
    {
        label: 'Tax knowledge',
        href: route('knowledge.index'),
        icon: BookOpenText,
        match: 'knowledge',
    },
];

const adminItems: NavItem[] = [
    {
        label: 'Settings',
        href: route('settings.index'),
        icon: Settings2,
        match: 'settings',
    },
    {
        label: 'Profile',
        href: route('profile.edit'),
        icon: UserRound,
        match: 'profile',
    },
];

function NavSection({ label, items }: { label: string; items: NavItem[] }) {
    return (
        <div className="space-y-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {label}
            </p>
            {items.map((item) => {
                const Icon = item.icon;
                const active = route().current(item.match);

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            active
                                ? 'bg-white/10 text-white'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white',
                        )}
                    >
                        <Icon
                            className={cn(
                                'h-4 w-4 shrink-0',
                                active ? 'text-emerald-400' : 'text-slate-500',
                            )}
                        />
                        <span className="flex-1">{item.label}</span>
                        {item.count ? (
                            <Badge
                                variant="success"
                                className="border-0 bg-emerald-500/20 px-1.5 py-0 text-[10px] text-emerald-300"
                            >
                                {item.count}
                            </Badge>
                        ) : null}
                    </Link>
                );
            })}
        </div>
    );
}

export default function AppSidebar({
    approvalsCount,
    organization,
    onNavigate,
}: {
    approvalsCount: number;
    organization: Organization | null;
    onNavigate?: () => void;
}) {
    return (
        <div className="flex h-full flex-col bg-slate-950 px-3 py-5">
            <Link
                href={route('dashboard')}
                className="px-3"
                onClick={onNavigate}
            >
                <BrandMark />
            </Link>

            <nav className="mt-8 flex-1 space-y-7 overflow-y-auto">
                <NavSection
                    label="Workspace"
                    items={workspaceItems(approvalsCount)}
                />
                <NavSection label="Intelligence" items={intelligenceItems} />
                <NavSection label="Administration" items={adminItems} />
            </nav>

            <div className="space-y-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Organization
                    </p>
                    <p className="mt-1.5 truncate text-sm font-medium text-white">
                        {organization?.name ?? 'No organization'}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                        TRN {organization?.trn ?? '—'}
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 text-xs text-slate-500">
                    <LifeBuoy className="h-3.5 w-3.5" />
                    Deterministic by design
                </div>
            </div>
        </div>
    );
}
