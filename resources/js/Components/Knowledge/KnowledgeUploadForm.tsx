import { useForm } from '@inertiajs/react';
import { LoaderCircle, Plus } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';

import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';

export default function KnowledgeUploadForm({
    onUploaded,
}: {
    onUploaded?: (message: string) => void;
}) {
    const [reading, setReading] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const form = useForm({
        source_name: '',
        source_uri: '',
        content: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (reading || form.processing) { return; }

        form.post(route('knowledge.store'), {
            preserveScroll: true,
            onSuccess: () => {
                const name = form.data.source_name;
                form.reset();
                if (fileRef.current) { fileRef.current.value = ''; }
                setFileError(null);
                onUploaded?.(`${name} added to the policy library.`);
            },
        });
    };

    return (
        <Card>
            <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-base">Add policy source</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                    Add a text document or paste a policy excerpt for review.
                </p>
            </CardHeader>
            <CardContent className="pt-5">
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="policy-document">Upload text document</Label>
                        <Input ref={fileRef} id="policy-document" type="file" accept=".txt,text/plain" disabled={reading || form.processing} aria-describedby="policy-document-help" onChange={async (event) => {
                            const file = event.target.files?.[0];
                            if (!file) { return; }
                            setFileError(null);
                            if (!file.name.toLowerCase().endsWith('.txt') || file.size > 2 * 1024 * 1024) {
                                setFileError('Choose a plain text (.txt) document under 2 MB.');
                                event.target.value = '';
                                return;
                            }
                            setReading(true);
                            try {
                                const content = await file.text();
                                form.setData((current) => ({ ...current, content, source_name: current.source_name || file.name.replace(/\.txt$/i, '') }));
                            } catch { setFileError('This file could not be read. Try again or paste the text below.'); }
                            finally { setReading(false); }
                        }} />
                        <p id="policy-document-help" className="text-xs leading-5 text-muted-foreground">Plain text, up to 2 MB. For PDF guides, paste the relevant text below; PDF ingestion is not available.</p>
                        {reading && <p role="status" className="text-xs text-muted-foreground">Reading document…</p>}
                        {fileError && <p role="alert" className="text-xs text-destructive">{fileError}</p>}
                    </div>
                    <fieldset disabled={reading || form.processing} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="source_name">Source name</Label>
                        <Input
                            id="source_name"
                            value={form.data.source_name}
                            onChange={(event) =>
                                form.setData('source_name', event.target.value)
                            }
                            placeholder="e.g. UAE VAT Guide 2026"
                            required
                            maxLength={255}
                            aria-invalid={!!form.errors.source_name}
                            aria-describedby={form.errors.source_name ? 'source-name-error' : undefined}
                        />
                        {form.errors.source_name && (
                            <p id="source-name-error" role="alert" className="text-xs text-destructive">
                                {form.errors.source_name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="source_uri">Source URL (optional)</Label>
                        <Input
                            id="source_uri"
                            type="url"
                            maxLength={255}
                            aria-invalid={!!form.errors.source_uri}
                            aria-describedby={form.errors.source_uri ? 'source-uri-error' : undefined}
                            value={form.data.source_uri}
                            onChange={(event) =>
                                form.setData('source_uri', event.target.value)
                            }
                            placeholder="https://..."
                        />
                        {form.errors.source_uri && <p id="source-uri-error" role="alert" className="text-xs text-destructive">{form.errors.source_uri}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Policy text</Label>
                        <Textarea
                            id="content"
                            rows={6}
                            value={form.data.content}
                            onChange={(event) =>
                                form.setData('content', event.target.value)
                            }
                            placeholder="Paste the guideline or policy excerpt..."
                            required
                            minLength={20}
                            aria-invalid={!!form.errors.content}
                            aria-describedby="content-help"
                        />
                        <p id="content-help" className="text-xs text-muted-foreground">At least 20 characters. Review the imported text before saving.</p>
                        {form.errors.content && (
                            <p role="alert" className="text-xs text-destructive">
                                {form.errors.content}
                            </p>
                        )}
                    </div>
                    </fieldset>

                    <Button type="submit" disabled={form.processing || reading}>
                        {form.processing ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                            <Plus className="h-4 w-4" />
                        )}
                        {form.processing ? 'Saving source…' : 'Save source'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
