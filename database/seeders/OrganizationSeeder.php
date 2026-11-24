<?php

namespace Database\Seeders;

use App\Models\Organization;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Tax Registration Number that identifies the demo organization across seeders.
     */
    public const DEMO_TRN = '100123456700003';

    /**
     * Seed the demo organization.
     */
    public function run(): void
    {
        Organization::firstOrCreate(
            ['trn' => self::DEMO_TRN],
            [
                'name' => 'MH Trading LLC',
                'currency' => '$',
                'default_vat_rate' => 5.00,
            ],
        );
    }

    /**
     * Resolve the demo organization seeded by this class.
     */
    public static function demoOrganization(): Organization
    {
        return Organization::query()->where('trn', self::DEMO_TRN)->firstOrFail();
    }
}
