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
        $students = User::whereRole('student')->get();

        return [
            'old' => 0,
            'new' => 0,
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
        return 0;
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
