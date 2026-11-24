<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\TaxKnowledgeChunk;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TaxKnowledgeChunk>
 */
class TaxKnowledgeChunkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'source_name' => fake()->words(2, true),
            'source_uri' => null,
            'content' => fake()->paragraph(),
        ];
    }
}
