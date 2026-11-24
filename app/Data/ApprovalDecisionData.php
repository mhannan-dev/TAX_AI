<?php

namespace App\Data;

readonly class ApprovalDecisionData
{
    public function __construct(
        public string $status,
        public ?string $rejectionNote = null,
    ) {}

    public static function approved(): self
    {
        return new self(status: 'approved');
    }

    public static function rejected(string $note): self
    {
        return new self(status: 'rejected', rejectionNote: $note);
    }
}
