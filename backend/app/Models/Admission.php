<?php

namespace App\Models;

use App\Casts\JSON;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

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
        'reference_number',
    ];

    protected $casts = [
        'pre_registration' => 'boolean',
        'done' => 'boolean',
        'requirements' => JSON::class,
    ];

    protected static function booted()
    {
        static::creating(function (self $admission) {
            $admission->reference_number = sprintf(
                '%s-%s-%s',
                date('Y'),
                Str::padLeft(static::whereCourseId($admission->course_id)
                    ->whereLevel($admission->level)
                    ->whereTerm($admission->term)
                    ->whereYearId($admission->year_id)
                    ->whereMajorId($admission->major_id)
                    ->count() + 1, 5, '0'),
                Str::padLeft(mt_rand(0, 9999), 0, '0'),
            );
        });

        static::deleted(function (self $admission) {
            if ($admission->student->admissions()->count() === 0) {
                $admission->student->delete();
            }
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
