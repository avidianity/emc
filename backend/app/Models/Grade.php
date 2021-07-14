<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'subject_id',
        'teacher_id',
        'grade',
        'status',
        'year_id',
    ];

    protected static function booted()
    {
        static::saving(function (self $grade) {
            $grade->status = $grade->grade >= 75 ? 'Passed' : 'Failed';
        });
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function year()
    {
        return $this->belongsTo(Year::class);
    }
}
