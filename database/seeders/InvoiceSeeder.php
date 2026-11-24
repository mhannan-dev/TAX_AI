<?php

namespace Database\Seeders;

use App\Models\Invoice;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed sample invoices covering every processing status, with their line items.
     */
    public function run(): void
    {
        $organization = OrganizationSeeder::demoOrganization();
        $uploader = UserSeeder::demoUser();

        foreach ($this->invoices() as $data) {
            $items = $data['items'];
            unset($data['items']);

            $invoice = Invoice::firstOrCreate(
                [
                    'organization_id' => $organization->id,
                    'file_name' => $data['file_name'],
                ],
                [
                    ...$data,
                    'uploaded_by' => $uploader->id,
                    'file_path' => 'invoices/'.$data['file_name'],
                ],
            );

            if ($invoice->wasRecentlyCreated) {
                $invoice->items()->createMany($items);
            }
        }
    }

    /**
     * Resolve a seeded demo invoice by its original file name.
     */
    public static function demoInvoice(string $fileName): Invoice
    {
        return Invoice::query()
            ->where('organization_id', OrganizationSeeder::demoOrganization()->id)
            ->where('file_name', $fileName)
            ->firstOrFail();
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function invoices(): array
    {
        return [
            [
                'file_name' => 'office-supplies-invoice.pdf',
                'vendor_name' => 'Al Futtaim Office Supplies',
                'vendor_trn' => '100123456700003',
                'invoice_date' => now()->subDays(2),
                'subtotal' => 4200,
                'vat_amount' => 210,
                'total' => 4410,
                'confidence_score' => 98.20,
                'status' => 'posted',
                'extracted_payload' => [
                    'vendor_name' => 'Al Futtaim Office Supplies',
                    'trn' => '100123456700003',
                    'invoice_date' => now()->subDays(2)->toDateString(),
                    'subtotal' => 4200,
                    'vat_amount' => 210,
                    'total' => 4410,
                ],
                'items' => [
                    ['description' => 'A4 copier paper', 'quantity' => 20, 'unit_price' => 120, 'tax_code' => 'standard', 'tax_amount' => 120, 'total' => 2400],
                    ['description' => 'Ergonomic office chairs', 'quantity' => 6, 'unit_price' => 300, 'tax_code' => 'standard', 'tax_amount' => 90, 'total' => 1800],
                ],
            ],
            [
                'file_name' => 'cloud-hosting-receipt.jpg',
                'vendor_name' => 'Emirates Cloud Systems',
                'vendor_trn' => '100123456700019',
                'invoice_date' => now()->subDays(3),
                'subtotal' => 2750,
                'vat_amount' => 137.5,
                'total' => 2887.5,
                'confidence_score' => 96.40,
                'status' => 'pending_approval',
                'extracted_payload' => [
                    'vendor_name' => 'Emirates Cloud Systems',
                    'trn' => '100123456700019',
                    'subtotal' => 2750,
                    'vat_amount' => 137.5,
                    'total' => 2887.5,
                ],
                'items' => [
                    ['description' => 'Cloud hosting subscription', 'quantity' => 1, 'unit_price' => 2750, 'tax_code' => 'standard', 'tax_amount' => 137.5, 'total' => 2750],
                ],
            ],
            [
                'file_name' => 'office-rent-invoice.pdf',
                'vendor_name' => 'Nakheel Property Management',
                'vendor_trn' => '100123456700027',
                'invoice_date' => now()->subDays(5),
                'subtotal' => 18000,
                'vat_amount' => 900,
                'total' => 18900,
                'confidence_score' => 94.80,
                'status' => 'parsed',
                'extracted_payload' => [
                    'vendor_name' => 'Nakheel Property Management',
                    'trn' => '100123456700027',
                    'subtotal' => 18000,
                    'vat_amount' => 900,
                    'total' => 18900,
                ],
                'items' => [
                    ['description' => 'Monthly office rent', 'quantity' => 1, 'unit_price' => 18000, 'tax_code' => 'standard', 'tax_amount' => 900, 'total' => 18000],
                ],
            ],
            [
                'file_name' => 'client-lunch-receipt.png',
                'vendor_name' => 'Jumeirah Hospitality',
                'vendor_trn' => null,
                'invoice_date' => now()->subDays(6),
                'subtotal' => 680,
                'vat_amount' => 34,
                'total' => 714,
                'confidence_score' => 82.10,
                'status' => 'queued',
                'extracted_payload' => [
                    'vendor_name' => 'Jumeirah Hospitality',
                    'trn' => null,
                    'subtotal' => 680,
                    'vat_amount' => 34,
                    'total' => 714,
                ],
                'items' => [
                    ['description' => 'Client lunch', 'quantity' => 1, 'unit_price' => 680, 'tax_code' => 'standard', 'tax_amount' => 34, 'total' => 680],
                ],
            ],
            [
                'file_name' => 'software-subscription.pdf',
                'vendor_name' => 'Microsoft Cloud Solutions',
                'vendor_trn' => '100123456700035',
                'invoice_date' => now()->subDays(8),
                'subtotal' => 1200,
                'vat_amount' => 60,
                'total' => 1260,
                'confidence_score' => 99.10,
                'status' => 'posted',
                'extracted_payload' => [
                    'vendor_name' => 'Microsoft Cloud Solutions',
                    'trn' => '100123456700035',
                    'subtotal' => 1200,
                    'vat_amount' => 60,
                    'total' => 1260,
                ],
                'items' => [
                    ['description' => 'Business software licence', 'quantity' => 1, 'unit_price' => 1200, 'tax_code' => 'standard', 'tax_amount' => 60, 'total' => 1200],
                ],
            ],
            [
                'file_name' => 'corrected-invoice.pdf',
                'vendor_name' => 'Al Futtaim Office Supplies',
                'vendor_trn' => '100123456700003',
                'invoice_date' => now()->subDays(10),
                'subtotal' => 1000,
                'vat_amount' => 55,
                'total' => 1055,
                'confidence_score' => 88.00,
                'status' => 'rejected',
                'processing_error' => 'VAT amount does not match the 5.00% organization rate.',
                'extracted_payload' => [
                    'vendor_name' => 'Al Futtaim Office Supplies',
                    'trn' => '100123456700003',
                    'subtotal' => 1000,
                    'vat_amount' => 55,
                    'total' => 1055,
                ],
                'items' => [
                    ['description' => 'Printer toner', 'quantity' => 2, 'unit_price' => 500, 'tax_code' => 'standard', 'tax_amount' => 55, 'total' => 1000],
                ],
            ],
        ];
    }
}
