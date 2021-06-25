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
    ];

    protected $casts = [
        'semester_start' => 'datetime',
        'semester_end' => 'datetime',
        'current' => 'boolean',
        'registration_start' => 'datetime',
        'registration_end' => 'datetime',
    ];

    protected static function booted()
    {
        static::deleting(function (self $year) {
            $year->admissions->each(function (Admission $admission) {
                $admission->delete();
            });

            $year->grades->each(function (Grade $grade) {
                $grade->delete();
            });

            $year->schedules->each(function (Schedule $schedule) {
                $schedule->delete();
            });
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
}
