<?php

namespace App\Models;

use App\Casts\JSON;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Jenssegers\Agent\Facades\Agent;

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
            $log->ip_address = request()->ip() ?? '127.0.0.1';
            $platform = Agent::platform();
            $log->device = sprintf('%s - %s %s', Str::ucfirst(Agent::deviceType()), $platform, Agent::version($platform));
            $log->browser = Agent::browser() ?? 'Generic';
        });
    }
}
