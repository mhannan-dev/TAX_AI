<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected function casts(): array
    {
        return ['default_vat_rate' => 'decimal:2'];
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function chartOfAccounts(): HasMany
    {
        return $this->hasMany(ChartOfAccount::class);
    }

    public function aiToolApprovals(): HasMany
    {
        return $this->hasMany(AiToolApproval::class);
    }

    public function taxKnowledgeChunks(): HasMany
    {
        return $this->hasMany(TaxKnowledgeChunk::class);
    }
}
