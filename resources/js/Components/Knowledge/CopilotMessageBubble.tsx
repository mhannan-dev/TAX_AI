import { BookOpen, Quote } from 'lucide-react';

import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import type { CopilotMessage } from '@/types/domain';
import { formatDateTime } from '@/lib/format';

export default function CopilotMessageBubble({
    message,
}: {
    message: CopilotMessage;
}) {
    const isAssistant = message.role === 'assistant';

    return (
        <div className={cn('flex gap-2.5', !isAssistant && 'justify-end')}>
            {isAssistant && (
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <BookOpen className="h-3.5 w-3.5" />
                </span>
            )}

            <div
                className={cn(
                    'min-w-0 max-w-[90%] break-words rounded-xl px-3.5 py-2.5 text-sm leading-6 shadow-sm',
                    isAssistant
                        ? 'rounded-tl-sm border bg-card text-foreground'
                        : 'rounded-tr-sm bg-primary text-primary-foreground',
                )}
            >
                <span className="sr-only">{isAssistant ? 'Copilot' : 'You'}: </span>
                <p className="whitespace-pre-line">{message.content}</p>
                {message.streaming && <span role="status" className="text-xs text-muted-foreground">Receiving response…</span>}
                {message.retrieval && <p className="mt-2 text-[11px] text-muted-foreground">{message.retrieval.method} · {message.retrieval.source_count} source(s)</p>}
                {message.retrieval?.retrieved_at && <p className="text-[11px] text-muted-foreground">Retrieved {formatDateTime(message.retrieval.retrieved_at)}</p>}

                {message.citations && message.citations.length > 0 && (
                    <div className="mt-3 space-y-2 border-t pt-3">
                        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            <Quote className="h-3 w-3" />
                            Sources
                        </p>
                        {message.citations.map((citation) => (
                            <div
                                key={`${citation.source}-${citation.section}`}
                                className="rounded-lg bg-muted/70 p-2.5"
                            >
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <Badge
                                        variant="secondary"
                                        className="text-[10px]"
                                    >
                                        {citation.source}
                                    </Badge>
                                    <span className="text-[11px] font-medium text-foreground">
                                        {citation.section}
                                    </span>
                                </div>
                                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                                    {citation.excerpt}
                                </p>
                                {citation.source_uri && /^https?:\/\//i.test(citation.source_uri) && <a className="text-xs underline focus-visible:outline focus-visible:outline-2" href={citation.source_uri} target="_blank" rel="noopener noreferrer">Open source (new tab)</a>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
