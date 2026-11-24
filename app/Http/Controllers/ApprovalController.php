<?php

namespace App\Http\Controllers;

use App\Actions\ResolveApprovalAction;
use App\Data\ApprovalDecisionData;
use App\Http\Requests\RejectApprovalRequest;
use App\Models\AiToolApproval;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ApprovalController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Approvals/Index', [
            'approvals' => AiToolApproval::with('invoice')->latest()->get(),
        ]);
    }

    public function approve(
        AiToolApproval $approval,
        ResolveApprovalAction $resolveApproval,
    ): RedirectResponse {
        $resolved = $resolveApproval->handle(
            $approval,
            ApprovalDecisionData::approved(),
            (int) auth()->id(),
        );

        if (! $resolved) {
            return Inertia::flash('toast', [
                'message' => 'This invocation has already been resolved.',
                'tone' => 'error',
            ])->back();
        }

        return Inertia::flash('toast', [
            'message' => 'Journal entry approved and posted.',
            'tone' => 'success',
        ])->back();
    }

    public function reject(
        RejectApprovalRequest $request,
        AiToolApproval $approval,
        ResolveApprovalAction $resolveApproval,
    ): RedirectResponse {
        $resolved = $resolveApproval->handle(
            $approval,
            ApprovalDecisionData::rejected(
                $request->string('note')->trim()->toString(),
            ),
            (int) auth()->id(),
        );

        if (! $resolved) {
            return Inertia::flash('toast', [
                'message' => 'This invocation has already been resolved.',
                'tone' => 'error',
            ])->back();
        }

        return Inertia::flash('toast', [
            'message' => 'Proposal rejected with note.',
            'tone' => 'success',
        ])->back();
    }
}
