<?php

namespace App\Exports;

use App\Models\Admission;
use App\Models\Course;
use App\Models\User;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromView;

class CourseAndMajorClasslist implements FromView
{
    protected $data = [];

    public function __construct()
    {
        /**
         * @var \App\Models\Course[]
         */
        $courses = Course::with('majors')->get();
        foreach ($courses as $course) {
            if ($course->majors->count() > 0) {
                foreach ($course->majors as $major) {
                    $students = Admission::whereCourseId($course->id)
                        ->whereMajorId($major->id)
                        ->whereHas('year', function (Builder $builder) {
                            return $builder->where('current', true);
                        })
                        ->with('student.sections.year')
                        ->get()
                        ->map(function (Admission $admission) {
                            return $admission->student;
                        })
                        ->filter(function (User $student) {
                            return $student->enrolled;
                        });

                    $key = sprintf('%s - Major in %s', $course->code, $major->name);

                    if ($students->count() > 0) {
                        $this->data[$key] = $students;
                    }
                }
            } else {
                /**
                 * @var \App\Models\User[]
                 */
                $students = Admission::whereCourseId($course->id)
                    ->whereHas('year', function (Builder $builder) {
                        return $builder->where('current', true);
                    })
                    ->with('student.sections.year')
                    ->get()
                    ->map(function (Admission $admission) {
                        return $admission->student;
                    })
                    ->filter(function (User $student) {
                        return $student->enrolled;
                    });

                if ($students->count() > 0) {
                    $this->data[$course->code] = $students;
                }
            }
        }
    }

    public function view(): View
    {
        return view('exports.registrar.course-major-classlist', [
            'data' => $this->data,
        ]);
    }
}
