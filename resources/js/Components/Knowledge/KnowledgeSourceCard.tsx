import { ExternalLink, FileText } from 'lucide-react';

import { Badge } from '@/Components/ui/badge';
import { Card } from '@/Components/ui/card';
import { formatDate } from '@/lib/format';
import type { KnowledgeChunk } from '@/types/domain';

export default function KnowledgeSourceCard({
    chunk,
    count,
}: {
    chunk: KnowledgeChunk;
    count: number;
}) {
    return (
        <Card className="flex h-full flex-col p-4">
            <div className="flex items-start justify-between gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <FileText className="h-4 w-4" />
                </span>
                <Badge variant="secondary" className="text-[10px]">
                    {count} chunk{count === 1 ? '' : 's'}
                </Badge>
            </div>

            <h3 className="mt-3 text-sm font-semibold text-foreground">
                {chunk.source_name}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2"><Badge variant={chunk.processing_status === 'failed' ? 'destructive' : chunk.processing_status === 'completed' ? 'success' : 'outline'}>{chunk.processing_status === 'completed' ? 'Processing completed' : chunk.processing_status === 'processing' ? 'Processing' : chunk.processing_status === 'queued' ? 'Queued' : chunk.processing_status === 'failed' ? 'Processing failed' : 'Source saved'}</Badge></div>
            {chunk.processing_error && <p role="alert" className="mt-2 text-xs text-destructive">{chunk.processing_error}</p>}
            <p className="mt-1 line-clamp-3 text-xs leading-5 text-muted-foreground">
                {chunk.content}
            </p>

            <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
                <span className="text-[11px] text-muted-foreground">
                    {formatDate(chunk.created_at)}
                </span>
                {chunk.source_uri && /^https?:\/\//i.test(chunk.source_uri) ? (
                    <a
                        href={chunk.source_uri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:underline focus-visible:outline focus-visible:outline-2"
                    >
                        Source (new tab)
                        <ExternalLink className="h-3 w-3" />
                    </a>
                ) : (
                    <span className="text-[11px] text-muted-foreground">
                        Internal policy
                    </span>
                )}
            </div>
            <details className="mt-3 border-t pt-3 text-xs"><summary className="cursor-pointer font-medium focus-visible:outline focus-visible:outline-2">View source excerpt · Chunk #{chunk.id}</summary><p className="mt-3 whitespace-pre-wrap break-words leading-6 text-muted-foreground">{chunk.content}</p></details>
        </Card>
    );
}
