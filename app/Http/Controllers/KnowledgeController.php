<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\TaxKnowledgeChunk;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KnowledgeController extends Controller
{
    public function index(): Response
    {
        $chunks = TaxKnowledgeChunk::latest()->get();

        $sources = $chunks
            ->groupBy('source_name')
            ->map(fn ($group) => [
                'chunk' => $group->first(),
                'count' => $group->count(),
            ])
            ->values()
            ->all();

        return Inertia::render('Knowledge/Index', [
            'sources' => $sources,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'source_name' => ['required', 'string', 'max:255'],
            'source_uri' => ['nullable', 'url', 'max:255'],
            'content' => ['required', 'string', 'min:20'],
        ]);

        TaxKnowledgeChunk::create([
            'organization_id' => Organization::query()->value('id'),
            'source_name' => $validated['source_name'],
            'source_uri' => $validated['source_uri'] ?: null,
            'content' => $validated['content'],
        ]);

        return Inertia::flash('toast', [
            'message' => 'Policy source added to the knowledge library.',
            'tone' => 'success',
        ])->back();
    }
}
