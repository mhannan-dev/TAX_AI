<?php

use Database\Seeders\UserSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('local login page supplies demo credentials without signing the guest in', function () {
    $this->app['env'] = 'local';

    $this->get(route('login'))->assertInertia(fn (Assert $page) => $page
        ->component('Auth/Login')
        ->where('demoCredentials.email', UserSeeder::DEMO_EMAIL)
        ->where('demoCredentials.password', UserSeeder::DEMO_PASSWORD));

    $this->assertGuest();
});

test('demo credentials are not exposed outside the local environment', function (string $environment) {
    $this->app['env'] = $environment;

    $this->get(route('login'))->assertInertia(fn (Assert $page) => $page
        ->component('Auth/Login')
        ->where('demoCredentials', null));

    $this->assertGuest();
})->with(['production', 'staging', 'testing']);

test('filled demo credentials sign in through the normal login form', function () {
    $this->seed(UserSeeder::class);

    $this->withSession(['url.intended' => route('profile.edit')])
        ->post(route('login'), [
            'email' => UserSeeder::DEMO_EMAIL,
            'password' => UserSeeder::DEMO_PASSWORD,
        ])
        ->assertRedirect(route('profile.edit'));

    $this->assertAuthenticatedAs(UserSeeder::demoUser());
});

test('demo login still rejects a password changed after seeding', function () {
    $this->seed(UserSeeder::class);
    UserSeeder::demoUser()->update(['password' => 'changed-demo-password']);

    $this->from(route('login'))->post(route('login'), [
        'email' => UserSeeder::DEMO_EMAIL,
        'password' => UserSeeder::DEMO_PASSWORD,
    ])
        ->assertRedirect(route('login'))
        ->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('the old direct demo sign-in endpoint no longer authenticates users', function () {
    $this->app['env'] = 'local';
    $this->withSession(['_token' => 'demo-login-test-token'])
        ->withHeader('X-CSRF-TOKEN', 'demo-login-test-token');
    $this->seed(UserSeeder::class);

    $this->post('/login/demo')->assertNotFound();

    $this->assertGuest();
});
