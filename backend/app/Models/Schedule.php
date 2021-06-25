<?php

namespace App\Models;

use App\Casts\JSON;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'subject_id',
        'teacher_id',
        'year',
        'payload',
        'year_id',
        'major_id',
    ];

    protected $casts = [
        'payload' => JSON::class,
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function schoolyear()
    {
        return $this->belongsTo(Year::class);
    }

    public function major()
    {
        return $this->belongsTo(Major::class);
    }
}
