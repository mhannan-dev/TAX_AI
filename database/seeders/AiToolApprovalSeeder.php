<?php

namespace Database\Seeders;

use App\Models\AiToolApproval;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AiToolApprovalSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed one pending, one approved and one rejected journal proposal.
     */
    public function run(): void
    {
        $organization = OrganizationSeeder::demoOrganization();
        $approver = UserSeeder::demoUser();

        $this->seedApproval(
            organizationId: $organization->id,
            invoiceFileName: 'cloud-hosting-receipt.jpg',
            invocationId: 'inv_demo_cloud_hosting',
            proposal: [
                'account_code' => '6200',
                'account_name' => 'Software Subscriptions',
                'debit' => '2750.00',
                'credit' => '2887.50',
                'vat_amount' => '137.50',
                'tax_code' => 'standard',
                'reason' => 'Vendor supplies cloud infrastructure; categorized as software subscription. VAT arithmetic validated at 5%.',
                'confidence' => '96.40',
            ],
            resolution: ['status' => 'pending'],
        );

        $this->seedApproval(
            organizationId: $organization->id,
            invoiceFileName: 'office-rent-invoice.pdf',
            invocationId: 'inv_demo_office_rent',
            proposal: [
                'account_code' => '6300',
                'account_name' => 'Rent Expense',
                'debit' => '18000.00',
                'credit' => '18900.00',
                'vat_amount' => '900.00',
                'tax_code' => 'standard',
                'reason' => 'Landlord invoice matched to rent expense account. TRN and VAT total validated.',
                'confidence' => '94.80',
            ],
            resolution: ['status' => 'pending'],
        );

        $this->seedApproval(
            organizationId: $organization->id,
            invoiceFileName: 'office-supplies-invoice.pdf',
            invocationId: 'inv_demo_office_supplies',
            proposal: [
                'account_code' => '6100',
                'account_name' => 'Office Supplies',
                'debit' => '4200.00',
                'credit' => '4410.00',
                'vat_amount' => '210.00',
                'tax_code' => 'standard',
                'reason' => 'Line items are office consumables and furniture. VAT validated.',
                'confidence' => '98.20',
            ],
            resolution: [
                'status' => 'approved',
                'approved_by' => $approver->id,
                'approved_at' => now()->subDay(),
            ],
        );

        $this->seedApproval(
            organizationId: $organization->id,
            invoiceFileName: 'corrected-invoice.pdf',
            invocationId: 'inv_demo_vat_mismatch',
            proposal: [
                'account_code' => '6100',
                'account_name' => 'Office Supplies',
                'debit' => '1000.00',
                'credit' => '1055.00',
                'vat_amount' => '55.00',
                'tax_code' => 'standard',
                'reason' => 'Proposed after initial extraction, before arithmetic validation failed.',
                'confidence' => '88.00',
            ],
            resolution: [
                'status' => 'rejected',
                'rejection_note' => 'VAT amount does not match 5% of subtotal. Re-extract the invoice.',
            ],
        );
    }

    /**
     * Create an approval once; re-running the seeder never overwrites a decision made in the UI.
     *
     * @param  array<string, string>  $proposal
     * @param  array<string, mixed>  $resolution
     */
    private function seedApproval(
        int $organizationId,
        string $invoiceFileName,
        string $invocationId,
        array $proposal,
        array $resolution,
    ): void {
        AiToolApproval::firstOrCreate(
            ['invocation_id' => $invocationId],
            [
                'organization_id' => $organizationId,
                'invoice_id' => InvoiceSeeder::demoInvoice($invoiceFileName)->id,
                'agent_name' => 'TaxComplianceAgent',
                'proposed_payload' => ['invocation_id' => $invocationId, ...$proposal],
                ...$resolution,
            ],
        );
    }
}
