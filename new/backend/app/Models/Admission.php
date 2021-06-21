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
        'major_id',
        'done',
    ];

    protected $casts = [
        'pre_registration' => 'boolean',
        'done' => 'boolean',
        'requirements' => JSON::class,
    ];

    protected static function booted()
    {
        static::deleted(function (self $admission) {
            $admission->student->delete();
        });
    }

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

    public function major()
    {
        return $this->belongsTo(Major::class);
    }
}
