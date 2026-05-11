<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserExperience extends Model
{
    protected $table = 'user_experiences';
    protected $fillable = [
        'place_id',
        'is_visited',
        'tried_signature',
        'took_photo',
        'will_return',
        'note', 
    ];
    protected $casts = [
        'will_return' => 'boolean',
        'is_visited' => 'boolean',
        'tried_signature' => 'boolean',
        'took_photo' => 'boolean',
    ];

    /**
     * Thiết lập quan hệ ngược lại với Place (nếu cần)
     */
    // UserExperience.php Model
    protected static function booted()
    {
        static::saving(function ($experience) {
            if ($experience->tried_signature || $experience->took_photo || $experience->will_return) {
                $experience->is_visited = true;
            }
        });
    }
    public function place()
    {
        return $this->belongsTo(Place::class);
    }
}
