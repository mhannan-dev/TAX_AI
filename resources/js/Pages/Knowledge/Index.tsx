import ActionToast from '@/Components/App/ActionToast';
import AppShell from '@/Components/App/AppShell';
import EmptyState from '@/Components/App/EmptyState';
import PageHeading from '@/Components/App/PageHeading';
import SearchInput from '@/Components/App/SearchInput';
import KnowledgeSourceCard from '@/Components/Knowledge/KnowledgeSourceCard';
import KnowledgeUploadForm from '@/Components/Knowledge/KnowledgeUploadForm';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Head } from '@inertiajs/react';
import { Bot, Database, FileText } from 'lucide-react';
import { Skeleton } from '@/Components/ui/skeleton';
import { useMemo, useState } from 'react';

import type { KnowledgeChunk } from '@/types/domain';

export type KnowledgeSource = {
    chunk: KnowledgeChunk;
    count: number;
};

export default function KnowledgeIndex({ sources }: { sources?: KnowledgeSource[] }) {
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) {
            return sources ?? [];
        }

        return (sources ?? []).filter(
            ({ chunk }) =>
                chunk.source_name.toLowerCase().includes(term) ||
                chunk.content.toLowerCase().includes(term),
        );
    }, [search, sources]);

    const totalChunks = (sources ?? []).reduce((sum, source) => sum + source.count, 0);

    return (
        <AppShell
            title="Tax knowledge"
            description="Policy sources for tax research and accountant review."
        >
            <Head title="Tax Knowledge" />

            <PageHeading
                eyebrow="Source library"
                title="Compliance knowledge base"
                description="Add policy text, inspect source excerpts, and verify references before making a tax decision."
                actions={
                    <Badge variant="secondary">
                        <Database className="mr-1 h-3 w-3" />
                        {totalChunks} saved excerpts
                    </Badge>
                }
            />

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-5">
                    <Card className="p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <FileText className="h-4 w-4 text-emerald-600" />
                                Source documents
                            </div>
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                placeholder="Search policy text..."
                            />
                        </div>
                    </Card>

                    {!sources ? <div role="status" aria-label="Loading policy sources" className="grid gap-4 sm:grid-cols-2"><Skeleton className="h-52" /><Skeleton className="h-52" /></div> : filtered.length === 0 ? (
                        <EmptyState
                            title="No sources found"
                            description="Try another search term or add a new policy source."
                        />
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {filtered.map((source) => (
                                <KnowledgeSourceCard
                                    key={source.chunk.id}
                                    chunk={source.chunk}
                                    count={source.count}
                                />
                            ))}
                        </div>
                    )}

                    <Card className="border-emerald-200 bg-emerald-50/60">
                        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                <Bot className="h-5 w-5" />
                            </span>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">
                                    Research with source references
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Use the floating copilot button to search a
                                    topic and inspect matching excerpts. AI answers require a connected copilot service.
                                </p>
                            </div>
                            <Badge variant="outline">Human review required</Badge>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <KnowledgeUploadForm
                        onUploaded={(message) => setToast(message)}
                    />

                    <Card>
                        <CardHeader className="border-b bg-muted/30">
                            <CardTitle className="text-base">
                                Before relying on a source
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5">
                            <ol className="space-y-3 text-xs leading-5 text-muted-foreground">
                                <li>
                                    <span className="font-semibold text-foreground">
                                        1. Review
                                    </span>{' '}
                                    — confirm the document title, issuing authority and effective date.
                                </li>
                                <li>
                                    <span className="font-semibold text-foreground">
                                        2. Inspect
                                    </span>{' '}
                                    — read the saved excerpt in its original context.
                                </li>
                                <li>
                                    <span className="font-semibold text-foreground">
                                        3. Verify
                                    </span>{' '}
                                    — check that the guidance applies to your transaction.
                                </li>
                                <li>
                                    <span className="font-semibold text-foreground">
                                        4. Decide
                                    </span>{' '}
                                    — an accountant remains responsible for every tax decision and approval.
                                </li>
                            </ol>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ActionToast message={toast} onDismiss={() => setToast(null)} />
        </AppShell>
    );
}
