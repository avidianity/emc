<?php

namespace App\Http\Controllers;

use App\Jobs\SendMail;
use App\Mail\Admission;
use App\Models\Log;
use App\Models\Mail;
use App\Models\Schedule;
use App\Models\Section;
use App\Models\Subject;
use App\Models\Unit;
use App\Models\User;
use App\Models\Year;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')
            ->except('index');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        /**
         * @var User
         */
        $user = $request->user('sanctum');

        $builder = User::with([
            'admissions.course.majors',
            'admissions.year',
            'admissions.major',
            'sections.year',
        ])
            ->withCount('subjects');

        if ($user && $user->role === 'Teacher') {
            $user->load('schedules.subject');
            /**
             * @var \Illuminate\Database\Eloquent\Collection<mixed, int>
             */
            $subjects = $user->schedules->map(function (Schedule $schedule) {
                return $schedule->subject->id;
            });

            $builder = $builder->whereHas('subjects', function (Builder $builder) use ($subjects) {
                return $builder->whereIn('subject_id', $subjects);
            });
        }

        return $builder->latest()->get();
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
            'uuid' => ['required', 'string'],
            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
            'middle_name' => ['nullable', 'string'],
            'gender' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'place_of_birth' => ['nullable', 'string'],
            'birthday' => ['required', 'date'],
            'role' => ['required', 'string'],
            'email' => ['required', 'string'],
            'number' => ['required', 'string'],
            'active' => ['required', 'boolean'],
            'fathers_name' => ['nullable', 'string'],
            'mothers_name' => ['nullable', 'string'],
            'fathers_occupation' => ['nullable', 'string'],
            'mothers_occupation' => ['nullable', 'string'],
            'allowed_units' => ['nullable', 'numeric'],
            'force' => ['required', 'boolean'],
            'payment_status' => ['nullable', 'string', Rule::in(User::PAYMENT_STATUSES)],
        ]);

        if (!$data['force']) {
            if (
                User::whereFirstName($data['first_name'])
                ->whereLastName($data['last_name'])
                ->whereEmail($data['email'])
                ->whereRole($data['role'])
                ->count() > 0
            ) {
                return response(['message' => 'Data is already existing. Please save again to confirm.'], 409);
            }
        }

        $user = $request->user();

        Log::create([
            'payload' => $user,
            'message' => sprintf('%s has created a user.', $user->role),
        ]);

        return User::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        $user->load([
            'subjects',
            'admissions.year',
            'admissions.course',
            'admissions.major',
            'sections.year',
        ]);
        return $user;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'uuid' => ['nullable', 'string'],
            'first_name' => ['nullable', 'string'],
            'last_name' => ['nullable', 'string'],
            'middle_name' => ['nullable', 'string'],
            'gender' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'place_of_birth' => ['nullable', 'string'],
            'birthday' => ['nullable', 'date'],
            'role' => ['nullable', 'string'],
            'email' => ['nullable', 'string'],
            'numeric' => ['nullable', 'string'],
            'active' => ['nullable', 'boolean'],
            'password' => ['nullable', 'string'],
            'fathers_name' => ['nullable', 'string'],
            'mothers_name' => ['nullable', 'string'],
            'fathers_occupation' => ['nullable', 'string'],
            'mothers_occupation' => ['nullable', 'string'],
            'allowed_units' => ['nullable', 'numeric'],
            'payment_status' => ['nullable', 'string', Rule::in(User::PAYMENT_STATUSES)],
        ]);

        $isPreviouslyInactive = $user->active === false;

        if ($request->has('payment_status') && $data['payment_status'] === null) {
            unset($data['payment_status']);
        }

        $user->update($data);

        if ($user->role === 'Student' && $user->active && $isPreviouslyInactive && !$user->enrolled) {
            $student = $user;

            /**
             * @var \App\Models\Admission
             */
            $admission = $student->admissions()
                ->whereHas('year', function (Builder $builder) {
                    return $builder->where('current', true);
                })
                ->first();

            if ($admission) {
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

                $section->students()->attach($student->id);

                $recipes = [$student, $request->user(), $admission, null];

                $mail = Mail::create([
                    'uuid' => $student->uuid,
                    'to' => $student->email,
                    'subject' => 'Student Admission',
                    'status' => 'Pending',
                    'body' => (new Admission(...$recipes))->render(),
                ]);

                SendMail::dispatch($mail, $recipes, Admission::class);

                $user = $request->user();

                Log::create([
                    'payload' => $user,
                    'message' => sprintf('%s has confirmed a student.', $user->role),
                ]);
            }
        }

        return $user;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, User $user)
    {
        $user->delete();

        $user = $request->user();

        Log::create([
            'payload' => $user,
            'message' => sprintf('%s has deleted a user.', $user->role),
        ]);

        return response('', 204);
    }

    public function change(Request $request)
    {
        $user = $request->user();

        $data = $request->all();

        if (!Hash::check($data['password'], $user->password)) {
            return response(['message' => 'Password is incorrect.'], 403);
        }

        User::findOrFail($data['user_id'])->update(['password' => $data['new_password']]);

        return response('', 204);
    }

    public function reincrement(User $user)
    {
        $user->load([
            'admissions.year',
            'subjects',
        ]);

        if ($user->payment_status === 'Not Paid') {
            return response(['message' => 'Student\'s payment status not settled. Current Status: Not Paid'], 400);
        }

        /**
         * @var \App\Models\Admission|null
         */
        $admission = $user->admissions->last();
        $year = Year::whereCurrent(true)->firstOrFail();

        if (!$admission) {
            return response(['message' => 'No admission found on student.'], 404);
        }

        if ($admission->year->current) {
            return response(['message' => 'Student is already currently enrolled to current school year.'], 400);
        }

        if (!$user->enrolled) {
            return response(['message' => 'Student is not enrolled to any subjects.'], 400);
        }

        $subjects = $user->subjects;

        $missing = collect([]);

        foreach ($subjects as $subject) {
            if ($subject->grades()->where('student_id', $user->id)->count() === 0) {
                $missing->push($subject->code);
            }
        }

        if ($missing->count() > 0) {
            return response(['message' => 'Student has missing grades.'], 400);
        }

        $failed = collect([]);

        foreach ($subjects as $subject) {
            /**
             * @var \App\Models\Grade
             */
            $grade = $subject->grades()->where('student_id', $user->id)->firstOrFail();

            if ($grade->grade < 75 || $grade->status === 'Failed') {
                $failed->push($subject);
            }
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
                    $units = (int)$subject->units;
                    return $previous + $units;
                }, 0);
            }

            $admission->update(['done' => true]);

            if ($failed->count() > 0) {
                $data['status'] = 'Irregular';
            }

            /**
             * @var \App\Models\Admission
             */
            $admission = $user->admissions()->create($data);

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

            if ($user->type === 'New') {
                $user->type = 'Old';
            }

            $user->save();

            $user->previousSubjects()->createMany($user->subjects->map(function (Subject $subject) {
                return ['subject_id' => $subject->id];
            }));

            $user->subjects()->detach();
        }

        return response('', 204);
    }
}
