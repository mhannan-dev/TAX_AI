export type InvoiceStatus =
    | 'queued'
    | 'parsed'
    | 'pending_approval'
    | 'posted'
    | 'rejected';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface InvoiceItem {
    id: number;
    description: string;
    quantity: string;
    unit_price: string;
    tax_code: 'standard' | 'zero-rated' | 'exempt' | string;
    tax_amount: string;
    total: string;
}

export interface ExtractedPayload {
    vendor_name?: string;
    trn?: string;
    invoice_date?: string;
    subtotal?: string | number;
    vat_amount?: string | number;
    total?: string | number;
    line_items?: Array<{
        description?: string;
        quantity?: number | string;
        unit_price?: number | string;
        tax_code?: string;
        amount?: number | string;
    }>;
    [key: string]: unknown;
}

export interface Invoice {
    id: number;
    organization_id?: number;
    file_name: string;
    file_path?: string;
    preview_url?: string | null;
    status: InvoiceStatus | string;
    vendor_name: string | null;
    vendor_trn: string | null;
    invoice_date: string | null;
    subtotal: string | null;
    vat_amount: string | null;
    total: string | null;
    confidence_score: string | null;
    extracted_payload?: ExtractedPayload | null;
    processing_error?: string | null;
    created_at: string;
    items?: InvoiceItem[];
}

export interface ApprovalPayload {
    account_code?: string;
    account_name?: string;
    debit?: string | number;
    credit?: string | number;
    vat_amount?: string | number;
    tax_code?: string;
    reason?: string;
    confidence?: string | number;
    invocation_id?: string;
    [key: string]: unknown;
}

export interface Approval {
    id: number;
    invocation_id: string;
    agent_name: string;
    status: ApprovalStatus | string;
    proposed_payload: ApprovalPayload;
    rejection_note: string | null;
    approved_at: string | null;
    created_at: string;
    invoice_id?: number | null;
    invoice?: (Pick<Invoice, 'id' | 'file_name' | 'vendor_name' | 'total'> & Partial<Pick<Invoice, 'subtotal' | 'vat_amount' | 'invoice_date' | 'vendor_trn'>>) | null;
    approved_by?: number | null;
    rejected_by?: number | null;
    rejected_at?: string | null;
}

export interface Organization {
    id: number;
    name: string;
    trn: string;
    currency: string;
    default_vat_rate: string;
}

export interface ChartAccount {
    id: number;
    code: string;
    name: string;
    account_type: string;
}

export interface KnowledgeChunk {
    id: number;
    source_name: string;
    source_uri: string | null;
    content: string;
    created_at: string;
    organization_id?: number | null;
    processing_status?: 'queued' | 'processing' | 'completed' | 'failed';
    processing_error?: string | null;
}

export interface CopilotCitation {
    source: string;
    section: string;
    excerpt: string;
    source_uri?: string;
}

export interface CopilotMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    citations?: CopilotCitation[];
    streaming?: boolean;
    retrieval?: { method: string; source_count: number; retrieved_at?: string };
}

export interface DashboardMetric {
    label: string;
    value: number | string;
    detail: string;
    tone: 'slate' | 'amber' | 'emerald' | 'rose';
}
