<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Major extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'course_id',
    ];

    protected static function booted()
    {
        static::deleting(function (self $major) {
            $major->admissions->each(function (Admission $admission) {
                $admission->delete();
            });

            $major->schedules->each(function (Schedule $schedule) {
                $schedule->delete();
            });

            $major->subjects->each(function (Subject $subject) {
                $subject->delete();
            });
        });

        static::created(function () {
            $user = auth('sanctum')->user();

            Log::create([
                'payload' => $user,
                'message' => sprintf('%s has created a major.', $user->role),
            ]);
        });

        static::updated(function () {
            $user = auth('sanctum')->user();

            Log::create([
                'payload' => $user,
                'message' => sprintf('%s has updated a major.', $user->role),
            ]);
        });

        static::deleted(function () {
            $user = auth('sanctum')->user();

            Log::create([
                'payload' => $user,
                'message' => sprintf('%s has deleted a major.', $user->role),
            ]);
        });
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function admissions()
    {
        return $this->hasMany(Admission::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }
}