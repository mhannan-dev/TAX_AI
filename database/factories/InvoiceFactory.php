<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
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
            'uploaded_by' => User::factory(),
            'file_path' => 'invoices/'.fake()->uuid().'.pdf',
            'file_name' => fake()->word().'.pdf',
            'status' => 'queued',
            'vendor_name' => fake()->company(),
            'vendor_trn' => fake()->numerify('###############'),
            'invoice_date' => fake()->date(),
            'subtotal' => 1000,
            'vat_amount' => 50,
            'total' => 1050,
            'confidence_score' => 98.00,
            'extracted_payload' => [],
        ];
    }
}
