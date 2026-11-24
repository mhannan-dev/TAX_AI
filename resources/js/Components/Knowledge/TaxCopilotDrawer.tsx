import { Link, usePage } from '@inertiajs/react';
import { Bot, Search, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import CopilotMessageBubble from './CopilotMessageBubble';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import type { CopilotMessage, KnowledgeChunk } from '@/types/domain';
import type { PageProps } from '@/types';

export default function TaxCopilotDrawer() {
    const { sources, copilotMessages, copilotPending } = usePage<PageProps<{
        sources?: Array<{ chunk: KnowledgeChunk; count: number }>;
        copilotMessages?: CopilotMessage[];
        copilotPending?: boolean;
    }>>().props;
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<CopilotMessage[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);
    const conversation = copilotMessages ?? messages;

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [conversation, copilotPending]);

    const search = (event: FormEvent) => {
        event.preventDefault();
        const query = question.trim();
        if (!query || !sources || copilotPending) { return; }
        const words = query.toLocaleLowerCase().split(/\W+/).filter((word) => word.length > 2);
        const matches = sources.filter(({ chunk }) => words.some((word) => `${chunk.source_name} ${chunk.content}`.toLocaleLowerCase().includes(word))).slice(0, 3);
        setMessages((current) => [...current,
            { id: crypto.randomUUID(), role: 'user', content: query },
            { id: crypto.randomUUID(), role: 'assistant', content: matches.length ? 'These source excerpts contain matching terms. They are not an AI answer or a tax determination. Read the complete source before relying on an excerpt.' : 'No matching excerpts in the sources available on this page. Add a relevant source or try different terms.',
                citations: matches.map(({ chunk }) => ({ source: chunk.source_name, section: `Chunk #${chunk.id}`, excerpt: chunk.content, source_uri: chunk.source_uri ?? undefined })),
                retrieval: { method: 'Keyword lookup in available source excerpts', source_count: matches.length, retrieved_at: new Date().toISOString() },
            },
        ]);
        setQuestion('');
    };

    return <Sheet>
        <SheetTrigger asChild><Button className="fixed bottom-5 right-5 z-30 rounded-full shadow-lg"><Sparkles className="h-4 w-4" />Tax Copilot</Button></SheetTrigger>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
            <SheetHeader className="border-b px-6 py-5 pr-12">
                <div className="flex flex-wrap items-center gap-2"><Bot className="h-5 w-5 text-emerald-700" /><SheetTitle>Tax Copilot</SheetTitle><Badge variant="outline">Source lookup</Badge></div>
                <SheetDescription>Search your available policy excerpts. AI answers are unavailable until the tax copilot service is connected.</SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6" role="log" aria-label="Tax copilot conversation" aria-live="polite" aria-busy={copilotPending}>
                <div className="space-y-5">
                    {conversation.length === 0 && <div className="rounded-xl border border-dashed p-5 text-sm leading-6"><p className="font-semibold">Start with a source</p><p className="mt-2 text-muted-foreground">Search for a policy topic to inspect matching excerpts and their source references. No tax advice is generated.</p>{!sources && <Button asChild variant="link" className="mt-3"><Link href={route('knowledge.index')}>Open the knowledge library</Link></Button>}</div>}
                    {conversation.map((message) => <CopilotMessageBubble key={message.id} message={message} />)}
                    {copilotPending && <p role="status" className="animate-pulse text-sm text-muted-foreground">Preparing a response…</p>}
                    <div ref={bottomRef} />
                </div>
            </div>
            <div className="border-t bg-background p-5">
                <form onSubmit={search} className="space-y-3">
                    <Label htmlFor="copilot-question">Policy topic or question</Label>
                    <Textarea id="copilot-question" value={question} onChange={(event) => setQuestion(event.target.value)} rows={3} maxLength={2000} disabled={!sources || !!copilotMessages || copilotPending} aria-describedby="copilot-disclaimer" />
                    <Button type="submit" disabled={!question.trim() || !sources?.length || !!copilotMessages || copilotPending}><Search className="h-4 w-4" />Search source excerpts</Button>
                </form>
                <p id="copilot-disclaimer" className="mt-3 text-xs leading-5 text-muted-foreground">AI can make mistakes. Verify citations and current guidance with a qualified tax professional. Copilot never approves or posts entries.</p>
            </div>
        </SheetContent>
    </Sheet>;
}
