<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('file_path');
            $table->string('file_name');
            $table->string('status')->default('queued');
            $table->string('vendor_name')->nullable();
            $table->string('vendor_trn')->nullable();
            $table->date('invoice_date')->nullable();
            $table->decimal('subtotal', 12, 2)->nullable();
            $table->decimal('vat_amount', 12, 2)->nullable();
            $table->decimal('total', 12, 2)->nullable();
            $table->decimal('confidence_score', 5, 2)->nullable();
            $table->json('extracted_payload')->nullable();
            $table->text('processing_error')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
