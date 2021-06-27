<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;

    const NAMES = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
    ];

    protected $fillable = [
        'name',
        'level',
        'term',
        'course_id',
        'year_id',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function year()
    {
        return $this->belongsTo(Year::class);
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'student_sections')->using(StudentSection::class);
    }
}
