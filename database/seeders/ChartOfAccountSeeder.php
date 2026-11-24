<?php

namespace Database\Seeders;

use App\Models\ChartOfAccount;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ChartOfAccountSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the demo organization's chart of accounts.
     */
    public function run(): void
    {
        $organization = OrganizationSeeder::demoOrganization();

        foreach ($this->accounts() as $account) {
            ChartOfAccount::firstOrCreate(
                [
                    'organization_id' => $organization->id,
                    'code' => $account['code'],
                ],
                $account,
            );
        }
    }

    /**
     * @return list<array{code: string, name: string, account_type: string}>
     */
    private function accounts(): array
    {
        return [
            ['code' => '1000', 'name' => 'Bank Account', 'account_type' => 'Asset'],
            ['code' => '1500', 'name' => 'Input VAT', 'account_type' => 'Asset'],
            ['code' => '2100', 'name' => 'Accounts Payable', 'account_type' => 'Liability'],
            ['code' => '6100', 'name' => 'Office Supplies', 'account_type' => 'Expense'],
            ['code' => '6200', 'name' => 'Software Subscriptions', 'account_type' => 'Expense'],
            ['code' => '6300', 'name' => 'Rent Expense', 'account_type' => 'Expense'],
            ['code' => '6400', 'name' => 'Travel & Entertainment', 'account_type' => 'Expense'],
        ];
    }
}
