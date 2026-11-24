<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Login email of the demo accountant.
     */
    public const DEMO_EMAIL = 'admin@yopmail.com';

    public const DEMO_PASSWORD = 'password';

    /**
     * Seed the demo accountant who can sign in with "password".
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => self::DEMO_EMAIL],
            [
                'name' => 'System User',
                'password' => Hash::make(self::DEMO_PASSWORD),
                'email_verified_at' => now(),
            ],
        );
    }

    /**
     * Resolve the demo accountant seeded by this class.
     */
    public static function demoUser(): User
    {
        return User::query()->where('email', self::DEMO_EMAIL)->firstOrFail();
    }
}
