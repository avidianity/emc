<?php

namespace App\Http\Controllers;

use App\Models\Admission;
use App\Models\Course;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function students()
    {
        $builder = User::whereRole('student');

        return [
            'old' => $builder->whereType('Old')->count(),
            'new' => $builder->whereType('New')->count(),
        ];
    }

    public function courses()
    {
        return Course::withCount('admissions')->get();
    }

    public function genders()
    {
        return [
            'males' => User::whereRole('student')
                ->whereGender('Male')
                ->count(),
            'females' => User::whereRole('student')
                ->whereGender('Female')
                ->count(),
        ];
    }

    public function graduates()
    {
        return Admission::whereTerm('2nd Semester')
            ->whereLevel('5th')
            ->whereDone(true)
            ->count();
    }

    public function enrollees()
    {
        return [
            'pending' => User::whereRole('Student')
                ->whereActive(false)
                ->count(),
        ];
    }

    public function subjects()
    {
        return Subject::withCount('students')->get();
    }
}
