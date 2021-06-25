<?php

namespace App\Models;

use Illuminate\Contracts\Mail\Mailable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mail extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'to',
        'subject',
        'status',
        'sent',
        'body',
    ];

    protected $casts = [
        'sent' => 'datetime',
    ];
}
