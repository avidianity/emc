<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'description',
        'course_id',
        'major_id',
        'level',
        'term',
        'units',
    ];

    protected $casts = [
        'units' => 'integer',
    ];

    protected static function booted()
    {
        static::deleting(function (self $subject) {
            $subject->grades->delete();

            $subject->schedules->delete();

            $subject->students()->detach();

            $subject->previous->delete();
        });
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function major()
    {
        return $this->belongsTo(Major::class);
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'student_subjects')->using(StudentSubject::class);
    }

    public function previous()
    {
        return $this->hasMany(PreviousSubject::class);
    }
}
