import { Route } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

export interface ProviderRoute {
    task: string;
    primary: string | null;
    fallback: string | null;
    fallback_enabled: boolean;
}

export default function ProviderRoutingCard({ routes }: { routes?: ProviderRoute[] }) {
    return <Card id="providers" className="scroll-mt-24">
        <CardHeader className="border-b bg-muted/30"><CardTitle className="flex items-center gap-2 text-base"><Route className="h-5 w-5" />AI provider routing</CardTitle><p className="text-xs text-muted-foreground">Primary and fallback providers for each task.</p></CardHeader>
        <CardContent className="space-y-3 pt-5">
            {!routes?.length ? <p className="rounded-lg border border-dashed p-4 text-sm leading-6 text-muted-foreground">Provider configuration is unavailable. Ask your administrator to supply the configured primary and fallback providers.</p> : routes.map((item) => <div key={item.task} className="space-y-3 rounded-lg border p-4"><h3 className="text-sm font-semibold">{item.task}</h3><div className="flex flex-wrap items-center gap-2 text-xs"><Badge variant="secondary">Primary</Badge><span>{item.primary ?? 'Not configured'}</span></div><div className="flex flex-wrap items-center gap-2 text-xs"><Badge variant={item.fallback_enabled ? 'outline' : 'warning'}>Fallback {item.fallback_enabled ? 'enabled' : 'disabled'}</Badge><span>{item.fallback ?? 'Not configured'}</span></div></div>)}
            <p className="text-xs leading-5 text-muted-foreground">Routing is managed by your administrator. Provider availability does not change the requirement for human approval.</p>
        </CardContent>
    </Card>;
}
