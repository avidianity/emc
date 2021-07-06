<?php

namespace App\Exports;

use App\Models\Subject;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class TeacherClasslist implements FromView
{
    /**
     * @var \App\Models\Subject
     */
    protected $subject;

    public function __construct(Subject $subject)
    {
        $this->subject = $subject;
        $this->subject->load([
            'course',
            'major',
            'students.sections.year',
        ]);
    }

    public function view(): View
    {
        return view('exports.teacher.classlist', [
            'students' => $this->subject->students,
            'subject' => $this->subject,
        ]);
    }
}
