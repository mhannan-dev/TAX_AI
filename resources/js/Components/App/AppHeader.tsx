import { Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronDown,
    LogOut,
    Menu,
    Search,
    Settings2,
    UserRound,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';

import AppSidebar from '@/Components/App/AppSidebar';
import BrandMark from '@/Components/App/BrandMark';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import { initials } from '@/lib/format';
import type { PageProps } from '@/types';

export default function AppHeader({
    title,
    description,
    actions,
}: {
    title: string;
    description?: string;
    actions?: ReactNode;
}) {
    const { auth, organization, approvalsCount } = usePage<PageProps>().props;
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
            <div className="flex h-16 items-center gap-4 px-4 lg:px-8">
                <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Open navigation</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0">
                        <AppSidebar
                            approvalsCount={approvalsCount}
                            organization={organization}
                            onNavigate={() => setMobileNavOpen(false)}
                        />
                    </SheetContent>
                </Sheet>

                <div className="min-w-0 flex-1">
                    <h1 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                        {title}
                    </h1>
                    {description && (
                        <p className="hidden truncate text-xs text-muted-foreground sm:block">
                            {description}
                        </p>
                    )}
                </div>

                <div className="hidden items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm text-muted-foreground xl:flex">
                    <Search className="h-3.5 w-3.5" />
                    <span className="w-44">Search documents...</span>
                    <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                        ⌘K
                    </kbd>
                </div>

                {actions}

                <Link
                    href={route('approvals.index')}
                    className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Approval queue"
                >
                    <Bell className="h-4 w-4" />
                    {approvalsCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white">
                            {approvalsCount}
                        </span>
                    )}
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="gap-2 px-1.5 text-foreground"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-slate-900 text-white">
                                    {initials(auth.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="hidden text-sm font-medium md:inline">
                                {auth.user.name}
                            </span>
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                    {auth.user.name}
                                </span>
                                <span className="text-xs font-normal text-muted-foreground">
                                    {auth.user.email}
                                </span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={route('profile.edit')}>
                                <UserRound className="h-4 w-4" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={route('settings.index')}>
                                <Settings2 className="h-4 w-4" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => router.post(route('logout'))}
                        >
                            <LogOut className="h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-center gap-2 border-t px-4 py-2 lg:hidden">
                <div className="lg:hidden flex items-center">
                    <BrandMark compact />
                    <span className="ml-2 text-xs font-semibold text-foreground">
                        Tax Autopilot
                    </span>
                </div>
                {organization && (
                    <Badge variant="secondary" className="ml-auto text-[10px]">
                        {organization.currency} · VAT {organization.default_vat_rate}%
                    </Badge>
                )}
            </div>
        </header>
    );
}
