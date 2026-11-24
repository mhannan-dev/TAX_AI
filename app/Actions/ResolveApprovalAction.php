<?php

namespace App\Actions;

use App\Data\ApprovalDecisionData;
use App\Models\AiToolApproval;
use Illuminate\Support\Facades\DB;

class ResolveApprovalAction
{
    public function handle(
        AiToolApproval $approval,
        ApprovalDecisionData $decision,
        int $userId,
    ): bool {
        return DB::transaction(function () use ($approval, $decision, $userId): bool {
            $lockedApproval = AiToolApproval::query()
                ->with('invoice')
                ->lockForUpdate()
                ->find($approval->id);

            if (! $lockedApproval || $lockedApproval->status !== 'pending') {
                return false;
            }

            if ($decision->status === 'approved') {
                $lockedApproval->update([
                    'status' => 'approved',
                    'approved_by' => $userId,
                    'approved_at' => now(),
                ]);
                $lockedApproval->invoice?->update(['status' => 'posted']);

                return true;
            }

            $lockedApproval->update([
                'status' => 'rejected',
                'rejection_note' => $decision->rejectionNote,
            ]);
            $lockedApproval->invoice?->update(['status' => 'parsed']);

            return true;
        });
    }
}
