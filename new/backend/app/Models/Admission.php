<?php

namespace App\Models;

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
        'graduated',
        'student_id',
        'pre_registration',
        'year_id',
    ];

    protected $casts = [
        'graduated' => 'boolean',
        'pre_registration' => 'boolean',
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
