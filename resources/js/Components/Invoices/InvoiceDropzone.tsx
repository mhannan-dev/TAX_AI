import { useForm } from '@inertiajs/react';
import { FileUp, LoaderCircle, UploadCloud } from 'lucide-react';
import { useRef, useState, type DragEvent, type KeyboardEvent } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { buttonVariants } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
];
const ACCEPTED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];

function validateFile(file: File): string | null {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    const hasAcceptedType =
        ACCEPTED_MIME_TYPES.includes(file.type) ||
        (file.type === '' && ACCEPTED_EXTENSIONS.includes(extension));

    if (!hasAcceptedType) {
        return 'Only PDF, JPG and PNG documents are supported.';
    }

    if (file.size > MAX_FILE_SIZE) {
        return 'The document must be 10 MB or smaller.';
    }

    if (file.size === 0) {
        return 'The selected document is empty.';
    }

    return null;
}

export default function InvoiceDropzone({
    onUploaded,
}: {
    onUploaded?: (message: string) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [queuedFile, setQueuedFile] = useState<string | null>(null);
    const form = useForm<{ file: File | null }>({ file: null });

    const openPicker = () => {
        inputRef.current?.click();
    };

    const selectFile = (file?: File) => {
        if (!file) {
            return;
        }

        const error = validateFile(file);

        if (error) {
            form.setData('file', null);
            setValidationError(error);
            setQueuedFile(null);
            if (inputRef.current) {
                inputRef.current.value = '';
            }

            return;
        }

        setValidationError(null);
        setQueuedFile(null);
        form.clearErrors('file');
        form.setData('file', file);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(false);

        if (event.dataTransfer.files.length > 1) {
            setValidationError('Upload one document at a time.');
            form.setData('file', null);

            return;
        }

        selectFile(event.dataTransfer.files[0]);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openPicker();
        }
    };

    const submit = () => {
        if (!form.data.file) {
            openPicker();

            return;
        }

        if (validationError) {
            return;
        }

        const fileName = form.data.file.name;

        form.post(route('invoices.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setQueuedFile(fileName);
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
                onUploaded?.(`${fileName} queued for extraction.`);
            },
        });
    };

    const displayError = validationError ?? form.errors.file;

    return (
        <div className="space-y-3">
            <div
                role="button"
                tabIndex={0}
                aria-label="Upload invoice document"
                aria-describedby="invoice-dropzone-help"
                aria-invalid={displayError ? true : undefined}
                onDragEnter={(event) => {
                    event.preventDefault();
                    setDragging(true);
                }}
                onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={openPicker}
                onKeyDown={handleKeyDown}
                className={cn(
                    'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    displayError
                        ? 'border-destructive/60 bg-destructive/5'
                        : dragging
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-border bg-card hover:border-emerald-300 hover:bg-emerald-50/40',
                )}
            >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <UploadCloud className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-medium text-foreground">
                    Drop invoices or receipts here
                </p>
                <p
                    id="invoice-dropzone-help"
                    className="mt-1 text-xs text-muted-foreground"
                >
                    PDF, JPG or PNG up to 10 MB. Extraction runs in the
                    background.
                </p>
                <span
                    className={cn(
                        buttonVariants({ variant: 'outline', size: 'sm' }),
                        'mt-4',
                    )}
                >
                    Browse files
                </span>
                <input
                    ref={inputRef}
                    id="invoice-file"
                    type="file"
                    accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(event) => {
                        selectFile(event.target.files?.[0]);
                        event.target.value = '';
                    }}
                />
            </div>

            {form.data.file && (
                <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <FileUp className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground">
                            {form.data.file.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            {(form.data.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            form.setData('file', null);
                            setValidationError(null);
                            form.clearErrors('file');
                        }}
                        className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        Remove
                    </button>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={form.processing}
                        className={cn(
                            buttonVariants({ size: 'sm' }),
                            'min-w-20',
                        )}
                    >
                        {form.processing && (
                            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                        )}
                        {form.processing ? 'Uploading' : 'Queue'}
                    </button>
                </div>
            )}

            {form.processing && (
                <div className="space-y-2">
                    <Alert>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        <AlertDescription className="text-xs">
                            Uploading document and adding it to the extraction
                            queue…
                        </AlertDescription>
                    </Alert>
                    <Progress
                        value={form.progress?.percentage ?? 0}
                        className="h-1.5"
                        indicatorClassName="bg-emerald-500"
                        aria-label="Upload progress"
                    />
                </div>
            )}

            {queuedFile && !form.processing && (
                <Alert variant="success">
                    <AlertTitle className="text-xs">
                        Queued for extraction
                    </AlertTitle>
                    <AlertDescription className="text-xs">
                        {queuedFile} is waiting for structured data extraction.
                    </AlertDescription>
                </Alert>
            )}

            {displayError && (
                <Alert variant="destructive">
                    <AlertDescription className="text-xs">
                        {displayError}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
