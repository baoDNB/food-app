<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Notification; // Đảm bảo đã tạo Model này

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\Notification::create([
            'title' => 'Chào mừng bạn!',
            'message' => 'Bắt đầu ghi lại những món ăn ngon hôm nay nhé.',
            'type' => 'system',
        ]);
    }
}
