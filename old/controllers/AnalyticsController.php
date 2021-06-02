<?php

namespace Controllers;

use Models\Admission;
use Models\Course;
use Models\User;

class AnalyticsController extends Controller
{
    public function students()
    {
        $students = User::getAll()->filter(function (User $user) {
            return $user->role === 'Student';
        });

        $old = $students->filter(function (User $user) {
            $admission = $user->admission;
            return $admission->type === 'Old';
        })->count();

        $new = $students->filter(function (User $user) {
            $admission = $user->admission;
            return $admission->type === 'New';
        })->count();

        return [
            'old' => $old,
            'new' => $new,
        ];
    }

    public function courses()
    {
        return Course::getAll()->map(function (Course $course) {
            $course->students_count = $course->admissions()->count();
            return $course;
        });
    }

    public function genders()
    {
        $students = User::getAll()->filter(function (User $user) {
            return $user->role === 'Student';
        });

        $males = $students->filter(function (User $user) {
            return $user->gender === 'Male';
        })->count();

        $females = $students->filter(function (User $user) {
            return $user->gender === 'Female';
        })->count();

        return [
            'male' => $males,
            'female' => $females,
        ];
    }

    public function graduates()
    {
        return Admission::getAll()->filter(function (Admission $admission) {
            return $admission->graduated;
        })->count();
    }

    public function enrollees()
    {
        $students = User::getAll()->filter(function (User $user) {
            return $user->role === 'Student' && !$user->active;
        })->count();

        return [
            'pending' => $students
        ];
    }
}
