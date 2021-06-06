<?php

namespace App\Models;

use App\Casts\JSON;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admission extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'level',
        'status',
        'term',
        'student_id',
        'pre_registration',
        'year_id',
        'requirements',
    ];

    protected $casts = [
        'pre_registration' => 'boolean',
        'requirements' => JSON::class,
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function year()
    {
        return $this->belongsTo(Year::class);
    }
}
