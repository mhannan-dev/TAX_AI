<?php

namespace Database\Factories;

use App\Models\AiToolApproval;
use App\Models\Invoice;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AiToolApproval>
 */
class AiToolApprovalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'invoice_id' => Invoice::factory(),
            'invocation_id' => 'inv_'.fake()->unique()->uuid(),
            'agent_name' => 'TaxComplianceAgent',
            'proposed_payload' => [
                'account_code' => '6100',
                'account_name' => 'Office Supplies',
                'debit' => '1000.00',
                'credit' => '1050.00',
                'vat_amount' => '50.00',
                'tax_code' => 'standard',
                'reason' => fake()->sentence(),
                'confidence' => '98.00',
            ],
            'status' => 'pending',
        ];
    }
}
