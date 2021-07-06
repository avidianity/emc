<?php

namespace App\Http\Controllers;

use App\Exports\CourseAndMajorClasslist;
use App\Exports\RegularAndIrregularClasslist;
use App\Exports\SubjectClasslist;
use App\Exports\SubjectClasslistBySection;
use App\Exports\TeacherClasslist;
use App\Models\Subject;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    public function teacherClasslist(Subject $subject)
    {
        return Excel::download(new TeacherClasslist($subject), $subject->course->code . ' - ' . $subject->code . '.xlsx');
    }

    public function courseAndMajorClasslist()
    {
        return Excel::download(new CourseAndMajorClasslist(), 'course-and-major-classlist.xlsx');
    }

    public function subjectClasslist()
    {
        return Excel::download(new SubjectClasslist(), 'subject-classlist.xlsx');
    }

    public function regularAndIrregularClasslist()
    {
        return Excel::download(new RegularAndIrregularClasslist(), 'regular-and-irregular-classlist.xlsx');
    }

    public function subjectClasslistBySection(Subject $subject)
    {
        return Excel::download(new SubjectClasslistBySection($subject), sprintf('%s-classlist-by-section.xlsx', $subject->code));
    }
}
