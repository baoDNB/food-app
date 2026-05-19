<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    use HasFactory;

    // Danh sách các cột được phép lưu dữ liệu (để tránh lỗi Mass Assignment)
    protected $fillable = [
        'name', 'address', 'category', 'image_url', 'opening_hours', 'closing_hours',
        'description', 'vibe_sound', 'vibe_density', 'vibe_fit', 'checklist', 'visited', 'is_favorite', 'city', 'district'
    ];
    protected $casts = [
        'checklist' => 'array', 
        'visited' => 'boolean',
        'category' => 'array',
    ];
    // Quan hệ 1:1 với bảng UserExperience (Lưu checklist)
    public function experience()
    {
        return $this->hasOne(UserExperience::class);
    }
    public function notes()
    {
        return $this->hasMany(Note::class);
    }


}