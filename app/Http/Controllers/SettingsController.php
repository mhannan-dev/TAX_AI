<?php

namespace App\Http\Controllers;

use App\Models\ChartOfAccount;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Settings/Index', [
            'accounts' => ChartOfAccount::orderBy('code')->get(),
        ]);
    }
}
