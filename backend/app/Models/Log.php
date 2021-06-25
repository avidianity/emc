<?php

namespace App\Models;

use App\Casts\JSON;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    use HasFactory;

    protected $fillable = [
        'payload',
        'message',
    ];

    protected $casts = [
        'payload' => JSON::class,
    ];

    protected static function booted()
    {
        static::creating(function (self $log) {
            if (!$log->payload) {
                $log->payload = [];
            }
        });
    }
}
