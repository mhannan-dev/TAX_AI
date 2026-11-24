<?php

namespace App\Http\Controllers;

use App\Models\AiToolApproval;
use App\Models\Invoice;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Dashboard', [
            'metrics' => [
                'documents' => Invoice::count(),
                'processing' => Invoice::whereIn('status', ['queued', 'parsed'])->count(),
                'queued' => Invoice::where('status', 'queued')->count(),
                'parsed' => Invoice::where('status', 'parsed')->count(),
                'pendingApproval' => AiToolApproval::where('status', 'pending')->count(),
                'posted' => Invoice::where('status', 'posted')->count(),
                'vat' => round((float) Invoice::sum('vat_amount'), 2),
                'exceptions' => Invoice::whereIn('status', ['queued', 'parsed'])->count(),
            ],
            'recentInvoices' => Invoice::latest()->take(5)->get([
                'id', 'organization_id', 'file_name', 'vendor_name', 'vendor_trn',
                'total', 'status', 'invoice_date', 'confidence_score', 'created_at',
            ]),
            'pendingApprovals' => AiToolApproval::with('invoice')
                ->where('status', 'pending')
                ->latest()
                ->take(3)
                ->get(),
        ]);
    }
}
