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
        Schema::create('places', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('address');
            $table->string('category')->nullable();
            $table->string('image_url')->nullable();
            $table->text('description')->nullable(); // thoughts
            $table->boolean('visited')->default(false); 
            $table->json('checklist')->nullable();
            $table->boolean('is_favorite')->default(false)->after('visited');
            $table->string('city')->nullable()->after('address');
            $table->string('district')->nullable()->after('city');
            $table->integer('visit_count')->default(0)->after('district');
            
            // Vibe Stats (Slider values)
            $table->integer('vibe_sound')->default(50);
            $table->integer('vibe_density')->default(50);
            $table->integer('vibe_fit')->default(50);
            $table->string('opening_hours')->nullable(); 
            $table->string('closing_hours')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('places', function (Blueprint $table) {
            $table->dropColumn('visit_count');
        });
    }
};
