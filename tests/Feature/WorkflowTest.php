<?php

use App\Models\AiToolApproval;
use App\Models\ChartOfAccount;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Organization;
use App\Models\TaxKnowledgeChunk;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('workflow pages render for authenticated users', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();
    $invoice = Invoice::factory()->for($organization)->create(['status' => 'posted']);
    InvoiceItem::factory()->for($invoice)->create();
    $approval = AiToolApproval::factory()->for($organization)->for($invoice)->create();
    ChartOfAccount::factory()->for($organization)->create();
    TaxKnowledgeChunk::factory()->for($organization)->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->where('metrics.documents', 1)
            ->where('metrics.processing', 0)
            ->where('metrics.vat', 50)
            ->has('pendingApprovals', 1));

    $this->actingAs($user)
        ->get(route('invoices.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Invoices/Index')
            ->has('invoices', 1));

    $this->actingAs($user)
        ->get(route('invoices.show', $invoice))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Invoices/Review')
            ->where('invoice.id', $invoice->id)
            ->where('invoice.preview_url', null)
            ->has('invoice.items', 1));

    $this->actingAs($user)
        ->get(route('approvals.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Approvals/Index')
            ->has('approvals', 1));

    $this->actingAs($user)
        ->get(route('knowledge.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Knowledge/Index')
            ->has('sources', 1));

    $this->actingAs($user)
        ->get(route('settings.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Settings/Index')
            ->has('accounts', 1));

    expect($approval->status)->toBe('pending');
});

test('uploading a document queues an invoice', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $organization = Organization::factory()->create();

    $response = $this->actingAs($user)->post(route('invoices.store'), [
        'file' => UploadedFile::fake()->create('invoice.pdf', 100, 'application/pdf'),
    ]);

    $response
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $invoice = Invoice::firstOrFail();

    expect($invoice->status)->toBe('queued')
        ->and($invoice->file_name)->toBe('invoice.pdf')
        ->and($invoice->organization_id)->toBe($organization->id);

    Storage::disk('public')->assertExists($invoice->file_path);
});

test('an approval request creates a pending journal proposal', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();
    $invoice = Invoice::factory()->for($organization)->create([
        'status' => 'parsed',
        'subtotal' => 4200,
        'vat_amount' => 210,
        'total' => 4410,
        'confidence_score' => 98.20,
    ]);

    $this->actingAs($user)
        ->post(route('invoices.request-approval', $invoice))
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $approval = AiToolApproval::firstOrFail();

    expect($approval->status)->toBe('pending')
        ->and($approval->agent_name)->toBe('TaxComplianceAgent')
        ->and($approval->proposed_payload['account_code'])->toBe('6100')
        ->and($invoice->refresh()->status)->toBe('pending_approval');
});

test('approving a proposal posts the invoice', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();
    $invoice = Invoice::factory()->for($organization)->create(['status' => 'pending_approval']);
    $approval = AiToolApproval::factory()->for($organization)->for($invoice)->create();

    $this->actingAs($user)
        ->post(route('approvals.approve', $approval))
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    expect($approval->refresh()->status)->toBe('approved')
        ->and($approval->approved_by)->toBe($user->id)
        ->and($approval->approved_at)->not->toBeNull()
        ->and($invoice->refresh()->status)->toBe('posted');
});

test('rejecting a proposal stores the note and returns the invoice for parsing', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();
    $invoice = Invoice::factory()->for($organization)->create(['status' => 'pending_approval']);
    $approval = AiToolApproval::factory()->for($organization)->for($invoice)->create();

    $this->actingAs($user)
        ->post(route('approvals.reject', $approval), [
            'note' => 'VAT amount does not match the subtotal.',
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    expect($approval->refresh()->status)->toBe('rejected')
        ->and($approval->rejection_note)->toBe('VAT amount does not match the subtotal.')
        ->and($invoice->refresh()->status)->toBe('parsed');
});

test('rejecting a proposal requires a useful note', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();
    $invoice = Invoice::factory()->for($organization)->create(['status' => 'pending_approval']);
    $approval = AiToolApproval::factory()->for($organization)->for($invoice)->create();

    $this->actingAs($user)
        ->post(route('approvals.reject', $approval), ['note' => 'no'])
        ->assertRedirect()
        ->assertSessionHasErrors('note');

    expect($approval->refresh()->status)->toBe('pending')
        ->and($invoice->refresh()->status)->toBe('pending_approval');
});

test('tax knowledge sources can be added', function () {
    $user = User::factory()->create();
    Organization::factory()->create();

    $this->actingAs($user)
        ->post(route('knowledge.store'), [
            'source_name' => 'VAT policy note',
            'source_uri' => '',
            'content' => 'Input VAT is recoverable when supported by a valid tax invoice.',
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('tax_knowledge_chunks', [
        'source_name' => 'VAT policy note',
        'source_uri' => null,
    ]);
});

test('uploading a document flashes a success toast to the next page', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    Organization::factory()->create();

    $this->actingAs($user)
        ->post(route('invoices.store'), [
            'file' => UploadedFile::fake()->create('invoice.pdf', 100, 'application/pdf'),
        ])
        ->assertRedirect()
        ->assertInertiaFlash('toast', [
            'message' => 'Document queued for extraction.',
            'tone' => 'success',
        ]);

    $this->actingAs($user)
        ->get(route('invoices.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Invoices/Index')
            ->hasFlash('toast', [
                'message' => 'Document queued for extraction.',
                'tone' => 'success',
            ]));
});

test('resolving an approval twice flashes an error toast', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();
    $invoice = Invoice::factory()->for($organization)->create(['status' => 'posted']);
    $approval = AiToolApproval::factory()->for($organization)->for($invoice)->create(['status' => 'approved']);

    $this->actingAs($user)
        ->post(route('approvals.approve', $approval))
        ->assertRedirect()
        ->assertInertiaFlash('toast', [
            'message' => 'This invocation has already been resolved.',
            'tone' => 'error',
        ]);
});
