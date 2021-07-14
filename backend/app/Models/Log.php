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
            $request = request();
            $agent = $request->userAgent();
            $log->ip_address = $request->ip() ?? '127.0.0.1';
            $platform = Agent::platform($agent);
            $log->device = sprintf('%s - %s %s', Str::ucfirst(Agent::deviceType($agent)), $platform, Agent::version($platform));
            $browser = Agent::browser($agent);
            $log->browser =  gettype($browser) === 'string' ? $browser : 'Generic';
        });
    }
}
