<?php

namespace App\Exports;

use App\Models\Subject;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromView;

class SubjectClasslist implements FromView
{
    protected $data;

    public function __construct()
    {
        $this->data = Subject::whereHas('students.sections.year', function (Builder $builder) {
            return $builder->where('current', true);
        })->with(['students.sections.year'])->get();
    }

    public function view(): View
    {
        return view('exports.registrar.subject-classlist', [
            'data' => $this->data,
        ]);
    }
}
