<?php

namespace App\Http\Controllers;

use App\Jobs\SendMail;
use App\Mail\Admission as MailAdmission;
use App\Models\Admission;
use App\Models\Mail;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdmissionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Admission::with('student', 'course')->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->all();

        $password = Str::random(5);

        $data['student']['role'] = 'Student';
        $data['student']['active'] = false;
        $data['student']['password'] = $password;

        $student = User::create($data['student']);

        $admission = $student->admissions()->create($data);

        $recipes = [$student, $request->user(), $admission, $password];

        $mail = Mail::create([
            'uuid' => $student->uuid,
            'to' => $student->email,
            'subject' => 'Student Admission',
            'status' => 'Pending',
            'body' => (new MailAdmission(...$recipes))->render(),
        ]);

        SendMail::dispatch($mail, $recipes, MailAdmission::class);

        return $admission;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Admission  $admission
     * @return \Illuminate\Http\Response
     */
    public function show(Admission $admission)
    {
        return $admission;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Admission  $admission
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Admission $admission)
    {
        $admission->update($request->all());

        return $admission;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Admission  $admission
     * @return \Illuminate\Http\Response
     */
    public function destroy(Admission $admission)
    {
        $admission->delete();

        return response('', 204);
    }

    public function increment(Request $request)
    {
        /**
         * @var \App\Models\User
         */
        $user = $request->user();

        /**
         * @var \App\Models\Admission|null
         */
        $admission = $user->admissions->last();

        if (!$admission) {
            return response('', 404);
        }

        $year = $admission->year;
        $subjects = $user->subjects;

        $missing = collect([]);

        foreach ($subjects as $subject) {
            if ($subject->grades()->where('student_id', $user->id)->count() === 0) {
                $missing->push($subject->code);
            }
        }

        if ($missing->count() > 0) {
            return response(['message' => 'Subjects currently do not have a grade: ' . $missing->join(', ')], 400);
        }

        $failed = collect([]);

        foreach ($subjects as $subject) {
            /**
             * @var \App\Models\Grade
             */
            $grade = $subject->grades()->where('student_id', $user->id)->firstOrFail();

            if ($grade->grade < 65) {
                $failed->push($subject);
            }
        }

        $unitsDeduction = 0;

        if ($failed->count() > 0) {
            $unitsDeduction = $failed->reduce(function ($previous, Subject $subject) {
                $units = (int)$subject->units;
                return $previous + $units;
            }, 0);
        }

        $map = [
            '1st Semester' => [
                '1st' => ['1st', '2nd Semester'],
                '2nd' => ['2nd', '2nd Semester'],
                '3rd' => ['3rd', '2nd Semester'],
                '4th' => ['4th', '2nd Semester'],
                '5th' => ['5th', '2nd Semester'],
            ],
            '2nd Semester' => [
                '1st' => ['2nd', '1st Semester'],
                '2nd' => ['3rd', '1st Semester'],
                '3rd' => ['3rd', 'Summer'],
                '4th' => ['5th', '1st Semester'],
            ],
            'Summer' => [
                '3rd' => ['4th', '1st Semester'],
            ]
        ];

        if (isset($map[$admission->term]) && isset($map[$admission->term][$admission->level])) {
            [$level, $term] = $map[$admission->term][$admission->level];

            $data = $admission->toArray();

            $data['term'] = $term;
            $data['level'] = $level;

            $user->admissions()->create($data);

            $user->update([
                'active' => false,
                'allowed_units' => $unitsDeduction,
            ]);
            $user->subjects()->delete();

            return response('', 204);
        }
    }
}
