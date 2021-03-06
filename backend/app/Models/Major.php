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
        'short_name',
    ];

    protected static function booted()
    {
        static::deleting(function (self $major) {
            $major->admissions->delete();

            $major->schedules->delete();

            $major->subjects->delete();

            $major->sections->delete();

            $major->units->delete();
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

    public function units()
    {
        return $this->hasMany(Unit::class);
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

    public function sections()
    {
        return $this->hasMany(Section::class);
    }
}
