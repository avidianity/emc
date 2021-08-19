<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'description',
        'open',
    ];

    protected $casts = [
        'open' => 'boolean',
    ];

    protected static function booted()
    {
        static::deleting(function (self $course) {
            $course->admissions->delete();

            $course->schedules->delete();

            $course->majors->delete();

            $course->subjects->delete();

            $course->sections->delete();

            $course->units->delete();
        });
    }

    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    public function admissions()
    {
        return $this->hasMany(Admission::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function majors()
    {
        return $this->hasMany(Major::class);
    }

    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }

    public function sections()
    {
        return $this->hasMany(Section::class);
    }
}
