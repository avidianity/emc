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
