<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Year extends Model
{
    use HasFactory;

    protected $fillable = [
        'start',
        'end',
        'semester_start',
        'semester_end',
        'current',
        'semester',
        'registration_start',
        'registration_end',
        'grade_start',
        'grade_end',
    ];

    protected $casts = [
        'semester_start' => 'datetime',
        'semester_end' => 'datetime',
        'current' => 'boolean',
        'registration_start' => 'datetime',
        'registration_end' => 'datetime',
        'grade_start' => 'datetime',
        'grade_end' => 'datetime',
    ];

    protected static function booted()
    {
        static::creating(function (self $year) {
            $schedules = Schedule::whereNull('year_id')
                ->get();

            $schedules->each(function (Schedule $schedule) use ($year) {
                $schedule->year_id = $year->id;
                $schedule->section->year_id = $year->id;
                $schedule->save();
                $schedule->section->save();
            });
        });

        static::deleting(function (self $year) {
            $year->admissions->delete();

            $year->grades->delete();

            $year->schedules->delete();

            $year->sections->delete();
        });
    }

    public function admissions()
    {
        return $this->hasMany(Admission::class);
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function sections()
    {
        return $this->hasMany(Section::class);
    }
}
