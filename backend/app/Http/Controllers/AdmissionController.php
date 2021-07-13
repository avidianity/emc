<?php

namespace App\Http\Controllers;

use App\Models\Admission;
use App\Models\Course;
use App\Models\Log;
use App\Models\Major;
use App\Models\Section;
use App\Models\Subject;
use App\Models\Unit;
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
        return Admission::with('student', 'course', 'major', 'year')
            ->latest()
            ->get();
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

        $student = User::make($data['student']);

        /**
         * @var \App\Models\Unit|null
         */
        $unit = Unit::whereCourseId($data['course_id'])
            ->whereMajorId(isset($data['major_id']) ? $data['major_id'] : null)
            ->whereLevel($data['level'])
            ->whereTerm($data['term'])
            ->first();

        if ($unit) {
            $student->allowed_units = $unit->units;
        } else {
            $subjects = Subject::whereCourseId($data['course_id'])
                ->whereMajorId(isset($data['major_id']) ? $data['major_id'] : null)
                ->whereTerm($data['term'])
                ->whereLevel($data['level'])
                ->get();

            $student->allowed_units = $subjects->reduce(function ($previous, Subject $subject) {
                $units = (int)$subject->units;
                return $previous + $units;
            }, 0);
        }

        $student->save();

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
         * @var \App\Models\Year
         */
        $year = Year::whereCurrent(true)->first();

        if (!$year) {
            return response(['message' => 'No school year currently set.'], 400);
        }

        $users = User::with('admissions.year')
            ->with('subjects')
            ->whereRole('Student')
            ->whereActive(true)
            ->get()
            ->filter(function (User $user) {
                return $user->enrolled;
            });

        /**
         * @var \App\Models\User
         */
        foreach ($users as $user) {
            if ($user->payment_status === 'Not Paid') {
                continue;
            }

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

                if ($grade->status === 'Failed' || $grade->grade < 75) {
                    $failed->push($subject);
                }
            }

            if ($failed->count() > 0) {
                $failedStudents += 1;
                continue;
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

                $data['year_id'] = $year->id;

                /**
                 * @var \App\Models\Unit|null
                 */
                $unit = Unit::whereCourseId($data['course_id'])
                    ->whereMajorId(isset($data['major_id']) ? $data['major_id'] : null)
                    ->whereLevel($data['level'])
                    ->whereTerm($data['term'])
                    ->first();

                if ($unit) {
                    $user->allowed_units = $unit->units;
                } else {
                    $subjects = Subject::whereCourseId($data['course_id'])
                        ->whereMajorId(isset($data['major_id']) ? $data['major_id'] : null)
                        ->whereTerm($data['term'])
                        ->whereLevel($data['level'])
                        ->get();

                    $user->allowed_units = $subjects->reduce(function ($previous, Subject $subject) {
                        $units = $subject->units;
                        return $previous + $units;
                    }, 0);
                }

                if ($failed->count() > 0) {
                    $data['status'] = 'Irregular';
                } else {
                    $data['status'] = 'Regular';
                }

                $admission->update(['done' => true]);

                /**
                 * @var \App\Models\Admission
                 */
                $admission = $user->admissions()->create($data);

                $user->subjects()->detach();

                $admission->load('year');

                $user->type = 'Old';

                $incremented += 1;

                $year = $admission->year;
                $builder = Section::whereCourseId($admission->course_id)
                    ->whereMajorId($admission->major_id)
                    ->whereTerm($year->semester)
                    ->whereLevel($admission->level)
                    ->whereYearId($year->id)
                    ->withCount('students')
                    ->latest();

                /**
                 * @var \App\Models\Section|null
                 */
                $section = $builder->first();

                if (!$section || $section->students_count >= 35) {
                    /**
                     * @var \App\Models\Section
                     */
                    $section = $year->sections()
                        ->create([
                            'term' => $year->semester,
                            'level' => $admission->level,
                            'name' => sprintf(
                                '%s%s %s%s',
                                $admission->course->code,
                                $admission->major ? ' - ' . $admission->major->short_name : '',
                                $admission->level[0],
                                Section::NAMES[$builder->count()]
                            ),
                            'course_id' => $admission->course_id,
                            'major_id' => $admission->major_id,
                        ]);
                }

                $section->students()->attach($user->id);

                $user->fill([
                    'active' => true,
                    'payment_status' => 'Not Paid',
                ]);

                $user->save();
            }
        }

        Log::create([
            'payload' => $request->user(),
            'message' => 'Admissions has been incremented.',
        ]);

        return [
            'failed' => $failedStudents,
            'missing' => $missingGrades,
            'passed' => $incremented,
            'students' => $users,
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

        $student = User::make($data['student']);

        /**
         * @var \App\Models\Unit|null
         */
        $unit = Unit::whereCourseId($data['course_id'])
            ->whereMajorId(isset($data['major_id']) ? $data['major_id'] : null)
            ->whereLevel($data['level'])
            ->whereTerm($data['term'])
            ->first();

        if ($unit) {
            $student->allowed_units = $unit->units;
        } else {
            $subjects = Subject::whereCourseId($data['course_id'])
                ->whereMajorId($data['major_id'])
                ->whereTerm($data['term'])
                ->whereLevel($data['level'])
                ->get();

            $student->allowed_units = $subjects->reduce(function ($previous, Subject $subject) {
                $units = (int)$subject->units;
                return $previous + $units;
            }, 0);
        }

        $student->save();

        $admission = $student->admissions()->create($data);

        $admission->load(['course']);

        Log::create([
            'payload' => $student,
            'message' => 'Student submitted a pre-registration.',
        ]);

        return $admission;
    }
}
