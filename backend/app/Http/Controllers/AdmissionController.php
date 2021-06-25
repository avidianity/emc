<?php

namespace App\Http\Controllers;

use App\Jobs\SendMail;
use App\Mail\Admission as MailAdmission;
use App\Mail\PreRegistration;
use App\Models\Admission;
use App\Models\Course;
use App\Models\Log;
use App\Models\Mail;
use App\Models\Major;
use App\Models\Subject;
use App\Models\User;
use App\Models\Year;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdmissionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Admission::with('student', 'course', 'major', 'year')->get();
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
            'course_id' => ['required', 'numeric', Rule::exists(Course::class, 'id')],
            'level' => ['required', 'string'],
            'status' => ['required', 'string'],
            'term' => ['required', 'string'],
            'year_id' => ['required', 'numeric', Rule::exists(Year::class, 'id')],
            'major_id' => ['nullable', 'numeric', Rule::exists(Major::class, 'id')],
            'requirements' => ['nullable', 'array'],
            'requirements.*' => ['required', 'string'],
            'student' => ['required', 'array'],
            'student.uuid' => ['required', 'string'],
            'student.first_name' => ['required', 'string'],
            'student.last_name' => ['required', 'string'],
            'student.middle_name' => ['nullable', 'string'],
            'student.gender' => ['nullable', 'string'],
            'student.address' => ['nullable', 'string'],
            'student.place_of_birth' => ['nullable', 'string'],
            'student.birthday' => ['required', 'date'],
            'student.email' => ['required', 'string'],
            'student.number' => ['required', 'string'],
            'student.fathers_name' => ['nullable', 'string'],
            'student.mothers_name' => ['nullable', 'string'],
            'student.fathers_occupation' => ['nullable', 'string'],
            'student.mothers_occupation' => ['nullable', 'string'],
            'force' => ['required', 'boolean'],
        ]);

        if (!isset($data['requirements'])) {
            $data['requirements'] = [];
        }

        $data['pre_registration'] = false;

        $password = Str::random(5);

        $data['student']['role'] = 'Student';
        $data['student']['active'] = false;
        $data['student']['password'] = $password;

        if (!$data['force']) {
            $builder = User::whereRole('Student')
                ->whereFirstName($data['student']['first_name'])
                ->whereLastName($data['student']['last_name']);
            if ($builder->count() > 0) {
                $student = $builder->firstOrFail();
                $admissionBuilder = Admission::whereLevel($data['level'])
                    ->whereCourseId($data['course_id'])
                    ->whereTerm($data['term'])
                    ->whereStatus($data['status'])
                    ->whereStudentId($student->id);
                if (isset($data['major_id'])) {
                    $admissionBuilder = $admissionBuilder->whereMajorId($data['major_id']);
                }
                if (
                    $admissionBuilder->count() > 0
                ) {
                    return response(['message' => 'Data is already existing. Please save again to confirm.'], 409);
                }
            }
        }

        $student = User::create($data['student']);

        $admission = $student->admissions()->create($data);

        Log::create([
            'payload' => $request->user(),
            'message' => 'Admission has been created.',
        ]);

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
        $admission->load('student', 'course.majors', 'major');
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
        $data = $request->validate([
            'course_id' => ['nullable', 'numeric', Rule::exists(Course::class, 'id')],
            'level' => ['nullable', 'string'],
            'status' => ['nullable', 'string'],
            'term' => ['nullable', 'string'],
            'pre_registration' => ['nullable', 'boolean'],
            'year_id' => ['nullable', 'numeric', Rule::exists(Year::class, 'id')],
            'major_id' => ['nullable', 'numeric', Rule::exists(Major::class, 'id')],
            'requirements' => ['nullable', 'array'],
            'requirements.*' => ['required', 'string'],
            'student' => ['nullable', 'array'],
            'student.uuid' => ['nullable', 'string'],
            'student.first_name' => ['nullable', 'string'],
            'student.last_name' => ['nullable', 'string'],
            'student.middle_name' => ['nullable', 'string'],
            'student.gender' => ['nullable', 'string'],
            'student.address' => ['nullable', 'string'],
            'student.place_of_birth' => ['nullable', 'string'],
            'student.birthday' => ['nullable', 'date'],
            'student.email' => ['nullable', 'string'],
            'student.number' => ['nullable', 'string'],
            'student.fathers_name' => ['nullable', 'string'],
            'student.mothers_name' => ['nullable', 'string'],
            'student.fathers_occupation' => ['nullable', 'string'],
            'student.mothers_occupation' => ['nullable', 'string'],
        ]);

        if (!isset($data['requirements'])) {
            $data['requirements'] = [];
        }

        $admission->update($data);

        if (isset($data['student'])) {
            $admission->student->update($data['student']);
        }

        Log::create([
            'payload' => $request->user(),
            'message' => 'Admission has been updated.',
        ]);

        return $admission;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Admission  $admission
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Admission $admission)
    {
        $admission->delete();

        Log::create([
            'payload' => $request->user(),
            'message' => 'Admission has been deleted.',
        ]);

        return response('', 204);
    }

    public function increment(Request $request)
    {
        $failedStudents = 0;
        $missingGrades = 0;
        $incremented = 0;

        /**
         * @var \App\Models\User
         */
        foreach (User::with('admissions')->whereRole('Student')->whereActive(true)->get() as $user) {
            /**
             * @var \App\Models\Admission|null
             */
            $admission = $user->admissions->last();

            if (!$admission) {
                continue;
            }

            $subjects = $user->subjects;

            $missing = collect([]);

            foreach ($subjects as $subject) {
                if ($subject->grades()->where('student_id', $user->id)->count() === 0) {
                    $missing->push($subject->code);
                }
            }

            if ($missing->count() > 0) {
                $missingGrades += 1;
                continue;
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

                if ($failed->count() === 0) {
                    $data['level'] = $level;
                } else {
                    if ($admission->term === '2nd Semester') {
                        $failedStudents += 1;
                        continue;
                    }
                }

                $user->admissions()->create($data);

                $user->fill([
                    'active' => false,
                    'allowed_units' => $user->allowed_units - $unitsDeduction,
                ]);

                if ($user->type === 'New') {
                    $user->type === 'Old';
                }

                $user->save();

                $user->subjects()->delete();
                $incremented += 1;
            }

            $admission->update(['done' => true]);
        }

        Log::create([
            'payload' => $request->user(),
            'message' => 'Admissions has been incremented.',
        ]);

        return [
            'failed' => $failedStudents,
            'missing' => $missingGrades,
            'passed' => $incremented,
        ];
    }

    public function preRegistration(Request $request)
    {
        $data = $request->validate([
            'course_id' => ['required', 'numeric', Rule::exists(Course::class, 'id')],
            'level' => ['required', 'string'],
            'status' => ['required', 'string'],
            'term' => ['required', 'string'],
            'pre_registration' => ['required', 'boolean'],
            'year_id' => ['required', 'numeric', Rule::exists(Year::class, 'id')],
            'major_id' => ['nullable', 'numeric', Rule::exists(Major::class, 'id')],
            'requirements' => ['nullable', 'array'],
            'requirements.*' => ['required', 'string'],
            'student' => ['required', 'array'],
            'student.first_name' => ['required', 'string'],
            'student.last_name' => ['required', 'string'],
            'student.middle_name' => ['nullable', 'string'],
            'student.gender' => ['nullable', 'string'],
            'student.address' => ['nullable', 'string'],
            'student.place_of_birth' => ['nullable', 'string'],
            'student.birthday' => ['required', 'date'],
            'student.email' => ['required', 'string'],
            'student.number' => ['required', 'string'],
            'student.fathers_name' => ['nullable', 'string'],
            'student.mothers_name' => ['nullable', 'string'],
            'student.fathers_occupation' => ['nullable', 'string'],
            'student.mothers_occupation' => ['nullable', 'string'],
            'force' => ['required', 'boolean']
        ]);

        if (!isset($data['requirements'])) {
            return [];
        }

        if (!$data['force']) {
            $builder = User::whereRole('Student')
                ->whereFirstName($data['student']['first_name'])
                ->whereLastName($data['student']['last_name']);
            if ($builder->count() > 0) {
                $student = $builder->firstOrFail();
                $admissionBuilder = Admission::whereLevel($data['level'])
                    ->whereCourseId($data['course_id'])
                    ->whereTerm($data['term'])
                    ->whereStatus($data['status'])
                    ->whereStudentId($student->id);
                if (isset($data['major_id'])) {
                    $admissionBuilder = $admissionBuilder->whereMajorId($data['major_id']);
                }
                if (
                    $admissionBuilder->count() > 0
                ) {
                    return response(['message' => 'Data is already existing. Please save again to confirm.'], 409);
                }
            }
        }

        $password = Str::random(5);

        $data['student']['uuid'] = sprintf('student-%s-%s', Str::padLeft(User::whereRole('Student')->count() + 1, 5, '0'), date('Y'));
        $data['student']['role'] = 'Student';
        $data['student']['active'] = false;
        $data['student']['password'] = $password;

        $student = User::create($data['student']);

        $admission = $student->admissions()->create($data);

        $admission->load(['course']);

        Log::create([
            'payload' => null,
            'message' => 'Student submitted a pre-registration.',
        ]);

        return $admission;
    }
}
