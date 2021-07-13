<?php

namespace App\Exports;

use App\Models\User;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class RegularAndIrregularClasslist implements FromView
{
    protected $regular = [];

    protected $irregular = [];

    public function __construct()
    {
        foreach (User::whereRole('Student')
            ->whereActive(true)
            ->with('sections.year')
            ->get() as $student) {
            if ($student->regular) {
                $this->regular[] = $student;
            } else {
                $this->irregular[] = $student;
            }
        }
    }

    public function view(): View
    {
        return view('exports.registrar.regular-irregular-classlist', [
            'regular' => $this->regular,
            'irregular' => $this->irregular,
        ]);
    }
}
