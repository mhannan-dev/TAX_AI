<?php

use App\Models\AiToolApproval;
use App\Models\ChartOfAccount;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Organization;
use App\Models\TaxKnowledgeChunk;
use App\Models\User;
use Database\Seeders\UserSeeder;

test('seeding creates a demo workspace linked to the demo organization', function () {
    $this->seed();

    $organization = Organization::sole();

    expect(User::sole()->email)->toBe(UserSeeder::DEMO_EMAIL)
        ->and(ChartOfAccount::whereBelongsTo($organization)->count())->toBe(7)
        ->and(Invoice::whereBelongsTo($organization)->count())->toBe(6)
        ->and(InvoiceItem::count())->toBe(7)
        ->and(TaxKnowledgeChunk::whereBelongsTo($organization)->count())->toBe(6);

    expect(AiToolApproval::where('invocation_id', 'inv_demo_office_rent')->sole()->invoice->file_name)
        ->toBe('office-rent-invoice.pdf')
        ->and(AiToolApproval::where('invocation_id', 'inv_demo_vat_mismatch')->sole()->invoice->file_name)
        ->toBe('corrected-invoice.pdf')
        ->and(AiToolApproval::pluck('status')->countBy()->all())
        ->toEqual(['pending' => 2, 'approved' => 1, 'rejected' => 1]);
});

test('re-seeding neither duplicates records nor overwrites decisions made in the app', function () {
    $this->seed();

    AiToolApproval::where('invocation_id', 'inv_demo_cloud_hosting')->sole()->update(['status' => 'approved']);

    $this->seed();

    expect(Organization::count())->toBe(1)
        ->and(User::count())->toBe(1)
        ->and(ChartOfAccount::count())->toBe(7)
        ->and(Invoice::count())->toBe(6)
        ->and(InvoiceItem::count())->toBe(7)
        ->and(AiToolApproval::count())->toBe(4)
        ->and(TaxKnowledgeChunk::count())->toBe(6)
        ->and(AiToolApproval::where('invocation_id', 'inv_demo_cloud_hosting')->sole()->status)->toBe('approved');
});
