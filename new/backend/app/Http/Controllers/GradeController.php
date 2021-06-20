<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Subject;
use App\Models\User;
use App\Models\Year;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GradeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Grade::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'student_id' => ['required', 'numeric', Rule::exists(User::class, 'id')],
            'subject_id' => ['required', 'numeric', Rule::exists(Subject::class, 'id')],
            'teacher_id' => ['required', 'numeric', Rule::exists(User::class, 'id')],
            'grade' => ['required', 'numeric', 'min:0', 'max:100'],
            'status' => ['required', 'string'],
            'year_id' => ['required', 'numeric', Rule::exists(Year::class, 'id')],
        ]);

        $grade = Grade::whereStudentId($data['student_id'])
            ->whereSubjectId($data['subject_id'])
            ->whereYearId($data['year_id'])
            ->first();

        if ($grade) {
            $grade->update($data);
            return $grade;
        }

        return Grade::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Grade  $grade
     * @return \Illuminate\Http\Response
     */
    public function show(Grade $grade)
    {
        return $grade;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Grade  $grade
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Grade $grade)
    {
        $data = $request->validate([
            'student_id' => ['required', 'numeric', Rule::exists(User::class, 'id')],
            'subject_id' => ['required', 'numeric', Rule::exists(Subject::class, 'id')],
            'teacher_id' => ['required', 'numeric', Rule::exists(User::class, 'id')],
            'grade' => ['required', 'numeric', 'min:0', 'max:100'],
            'status' => ['required', 'string'],
            'year_id' => ['required', 'numeric', Rule::exists(Year::class, 'id')],
        ]);

        $grade->update($data);

        return $grade;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Grade  $grade
     * @return \Illuminate\Http\Response
     */
    public function destroy(Grade $grade)
    {
        $grade->delete();

        return response('', 204);
    }
}
