<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model // Kiểm tra xem chỗ này bạn có đang ghi là NotificationController không
{
    use HasFactory;

    protected $fillable = ['title', 'message', 'type', 'is_read', 'link'];
}