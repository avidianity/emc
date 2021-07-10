<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'units',
        'course_id',
        'major_id',
        'level',
        'term',
    ];

    protected static function booted()
    {
        static::saving(function (self $unit) {
            $admissions = Admission::whereCourseId($unit->course_id)
                ->whereMajorId($unit->major_id)
                ->whereLevel($unit->level)
                ->whereTerm($unit->term)
                ->whereHas('year', function (Builder $builder) {
                    return $builder->where('current', true);
                })
                ->whereHas('student', function (Builder $builder) {
                    return $builder->where('active', true);
                })
                ->with('student')
                ->get();

            $admissions->each(function (Admission $admission) use ($unit) {
                $admission->student->update(['allowed_units' => $unit->units]);
            });
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
}
