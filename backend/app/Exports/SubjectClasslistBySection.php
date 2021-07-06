<?php

namespace App\Exports;

use App\Models\Section;
use App\Models\Subject;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Arr;
use Maatwebsite\Excel\Concerns\FromView;

class SubjectClasslistBySection implements FromView
{
    protected $subject;

    protected $data = [];

    public function __construct(Subject $subject)
    {
        $this->subject = $subject;

        $this->subject->load([
            'course',
            'major',
            'students.sections.year' => function ($builder) {
                return $builder->where('current', true);
            },
        ]);

        foreach ($this->subject->students as $student) {
            /**
             * @var \App\Models\Section
             */
            $section = Arr::first($student->sections, function (Section $section) {
                return $section->year->current;
            }, new \App\Models\Section(['name' => '']));

            if (!isset($this->data[$section->name])) {
                $this->data[$section->name] = [];
            }

            $this->data[$section->name][] = $student;
        }
    }

    public function view(): View
    {
        return view('exports.teacher.subject-classlist-sections', [
            'subject' => $this->subject,
            'data' => $this->data,
        ]);
    }
}
