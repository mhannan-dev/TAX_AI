<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the demo workspace. Every seeder is idempotent, so this can be re-run safely.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            OrganizationSeeder::class,
            ChartOfAccountSeeder::class,
            InvoiceSeeder::class,
            AiToolApprovalSeeder::class,
            TaxKnowledgeChunkSeeder::class,
        ]);
    }
}
