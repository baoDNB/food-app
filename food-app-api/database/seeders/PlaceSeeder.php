<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
        {
            \App\Models\Place::insert([
                [
                    'name' => 'Cà Phê Yên',
                    'address' => '184 Quán Thánh, Ba Đình',
                    'category' => 'hoc_bai',
                    'description' => 'Yên tĩnh, phù hợp chạy deadline.',
                    'image_url' => 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
                ],
                [
                    'name' => 'All Day Coffee',
                    'address' => '37 Quang Trung, Hoàn Kiếm',
                    'category' => 'chill',
                    'description' => 'Không gian ấm cúng, view đẹp.',
                    'image_url' => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
                ]
            ]);
        }
}
