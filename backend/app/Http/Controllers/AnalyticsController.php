<?php

namespace App\Http\Controllers;

use App\Models\Admission;
use App\Models\Course;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function students()
    {
        return [
            'total' => User::whereRole('student')->whereActive(true)->count(),
            'old' => User::whereRole('student')->whereActive(true)->whereType('Old')->count(),
            'new' => User::whereRole('student')->whereActive(true)->whereType('New')->count(),
        ];
    }

    public function courses()
    {
        return Course::whereHas('admissions.year', function (Builder $builder) {
            return $builder->where('current', true);
        })
            ->withCount('admissions')
            ->with('admissions.year')
            ->get();
    }

    public function genders()
    {
        return [
            'males' => User::whereRole('student')
                ->whereGender('Male')
                ->whereActive(true)
                ->count(),
            'females' => User::whereRole('student')
                ->whereGender('Female')
                ->whereActive(true)
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
        return Subject::whereHas('students.admissions.year', function (Builder $builder) {
            return $builder->where('current', true);
        })
            ->withCount('students')
            ->get();
    }
}
