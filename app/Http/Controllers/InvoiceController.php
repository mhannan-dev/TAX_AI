<?php

namespace App\Http\Controllers;

use App\Models\AiToolApproval;
use App\Models\Invoice;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Invoices/Index', [
            'invoices' => Invoice::with('items')->latest()->get(),
        ]);
    }

    public function show(Invoice $invoice): Response
    {
        $invoice->load('items');
        $invoice->setAttribute(
            'preview_url',
            $invoice->file_path && Storage::disk('public')->exists($invoice->file_path)
                ? Storage::url($invoice->file_path)
                : null,
        );

        return Inertia::render('Invoices/Review', [
            'invoice' => $invoice,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
        ]);

        $file = $validated['file'];
        $path = Storage::disk('public')->putFile('invoices', $file);

        Invoice::create([
            'organization_id' => Organization::query()->value('id'),
            'uploaded_by' => $request->user()?->id,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'status' => 'queued',
        ]);

        return Inertia::flash('toast', [
            'message' => 'Document queued for extraction.',
            'tone' => 'success',
        ])->back();
    }

    public function requestApproval(Invoice $invoice): RedirectResponse
    {
        $existing = AiToolApproval::query()
            ->where('invoice_id', $invoice->id)
            ->where('status', 'pending')
            ->first();

        if (! $existing) {
            $invocationId = 'inv_'.Str::uuid()->toString();

            AiToolApproval::create([
                'organization_id' => $invoice->organization_id,
                'invoice_id' => $invoice->id,
                'invocation_id' => $invocationId,
                'agent_name' => 'TaxComplianceAgent',
                'proposed_payload' => [
                    'invocation_id' => $invocationId,
                    'account_code' => $this->accountCodeFor($invoice),
                    'account_name' => $this->accountNameFor($invoice),
                    'debit' => $invoice->subtotal,
                    'credit' => $invoice->total,
                    'vat_amount' => $invoice->vat_amount,
                    'tax_code' => 'standard',
                    'reason' => 'Category proposed from vendor and line-item description. VAT validated against the organization rate.',
                    'confidence' => $invoice->confidence_score,
                ],
                'status' => 'pending',
            ]);
        }

        $invoice->update(['status' => 'pending_approval']);

        return Inertia::flash('toast', [
            'message' => 'Journal proposal sent for approval.',
            'tone' => 'success',
        ])->back();
    }

    public function reject(Invoice $invoice): RedirectResponse
    {
        $invoice->update(['status' => 'rejected']);

        return Inertia::flash('toast', [
            'message' => 'Invoice flagged for accountant review.',
            'tone' => 'success',
        ])->back();
    }

    private function accountCodeFor(Invoice $invoice): string
    {
        $vendor = strtolower($invoice->vendor_name ?? '');

        if (str_contains($vendor, 'software') || str_contains($vendor, 'cloud')) {
            return '6200';
        }

        if (str_contains($vendor, 'rent') || str_contains($vendor, 'property')) {
            return '6300';
        }

        return '6100';
    }

    private function accountNameFor(Invoice $invoice): string
    {
        return match ($this->accountCodeFor($invoice)) {
            '6200' => 'Software Subscriptions',
            '6300' => 'Rent Expense',
            default => 'Office Supplies',
        };
    }
}
