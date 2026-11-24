<?php

namespace Database\Seeders;

use App\Models\TaxKnowledgeChunk;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaxKnowledgeChunkSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed UAE VAT, corporate tax and internal policy excerpts for the tax copilot.
     */
    public function run(): void
    {
        $organization = OrganizationSeeder::demoOrganization();

        foreach ($this->chunks() as $chunk) {
            TaxKnowledgeChunk::firstOrCreate(
                [
                    'organization_id' => $organization->id,
                    'source_name' => $chunk['source_name'],
                    'content' => $chunk['content'],
                ],
                ['source_uri' => null],
            );
        }
    }

    /**
     * @return list<array{source_name: string, content: string}>
     */
    private function chunks(): array
    {
        return [
            [
                'source_name' => 'UAE VAT Guide',
                'content' => 'Input tax recovery: Input VAT incurred on goods or services used wholly for making taxable supplies is generally recoverable. Where entertainment or hospitality is incurred, recovery is restricted unless the expense is wholly attributable to taxable supplies and supported by evidence.',
            ],
            [
                'source_name' => 'FTA TRN Validation Note',
                'content' => 'Supplier verification: A UAE Tax Registration Number contains 15 digits. Verify the supplier name and TRN against the Federal Tax Authority register before treating VAT on a purchase invoice as recoverable.',
            ],
            [
                'source_name' => 'Corporate Tax Guide',
                'content' => 'Taxable income: Corporate tax is calculated on accounting profit after allowable adjustments. Non-deductible expenses, including certain entertainment costs and fines, are added back when computing taxable income.',
            ],
            [
                'source_name' => 'Internal Expense Policy',
                'content' => 'Tax coding: Use the standard code for taxable UAE purchases at 5%. Use zero-rated only for supplies expressly zero-rated by law, such as qualifying exports. Exempt supplies must never be coded as zero-rated.',
            ],
            [
                'source_name' => 'FTA VAT Return Guide',
                'content' => 'Return preparation: Output VAT and recoverable input VAT are reported for each tax period. Supporting invoices must retain supplier name, TRN, invoice date, description, subtotal and VAT amount.',
            ],
            [
                'source_name' => 'UAE VAT Guide',
                'content' => 'Zero-rated supplies: Exports of goods and services, and certain internationally transported goods, may be zero-rated. The supplier must retain evidence that the conditions for zero-rating are met.',
            ],
        ];
    }
}
