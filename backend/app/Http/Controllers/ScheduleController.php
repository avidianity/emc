<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Log;
use App\Models\Major;
use App\Models\Schedule;
use App\Models\Section;
use App\Models\Subject;
use App\Models\User;
use App\Models\Year;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $builder = Schedule::with('course', 'teacher', 'subject', 'major', 'section')
            ->whereHas('schoolyear', function (Builder $builder) {
                return $builder->where('current', true);
            });

        /**
         * @var \App\Models\User
         */
        $user = $request->user();

        if ($user->role === 'Student') {
            /**
             * @var \App\Models\Admission|null
             */
            $admission = $user->admissions()->whereHas('year', function (Builder $builder) {
                return $builder->where('current', true);
            })->first();

            if ($admission) {
                $builder = $builder->where('year', $admission->level)
                    ->where('term', $admission->term);
            }

            if ($user->enrolled) {
                $subjects = $user->subjects->map(function (Subject $subject) {
                    return $subject->id;
                });

                $builder = $builder->whereIn('subject_id', $subjects->toArray());
            } else {
                $section = $user->sections()->whereHas('year', function (Builder $builder) {
                    return $builder->where('current', true);
                })
                    ->with([
                        'schedules.course',
                        'schedules.teacher',
                        'schedules.subject',
                        'schedules.major',
                        'schedules.section',
                    ])
                    ->latest()
                    ->first();

                if ($section) {
                    return $section->schedules;
                }
            }
        } elseif ($user->role === 'Teacher') {
            $builder = $builder->where('teacher_id', $user->id);
        }

        return $builder->get();
    }

    public function advance(Request $request)
    {
        $builder = Schedule::with('course', 'teacher', 'subject', 'major', 'section')
            ->whereNull('year_id');

        /**
         * @var \App\Models\User
         */
        $user = $request->user();

        if ($user->role === 'Student') {
            $sections = $user->sections->map(function (Section $section) {
                return $section->id;
            });

            $subjects = $user->subjects->map(function (Subject $subject) {
                return $subject->id;
            });

            /**
             * @var \App\Models\Admission|null
             */
            $admission = $user->admissions()->whereHas('year', function (Builder $builder) {
                return $builder->where('current', true);
            })->first() ?: $user->admissions()->latest()->first();

            if ($admission) {
                $builder = $builder->where('year', $admission->level)
                    ->where('term', $admission->term);
            }

            $builder = $builder->whereIn('section_id', $sections->toArray())
                ->whereIn('subject_id', $subjects->toArray());
        } elseif ($user->role === 'Teacher') {
            $builder = $builder->where('teacher_id', $user->id);
        }

        return $builder->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'course_id' => ['required', 'numeric', Rule::exists(Course::class, 'id')],
            'subject_id' => ['required', 'numeric', Rule::exists(Subject::class, 'id')],
            'teacher_id' => ['required', 'numeric', Rule::exists(User::class, 'id')],
            'year' => ['required', 'string'],
            'payload' => ['required', 'array'],
            'payload.*.day' => ['required', 'string'],
            'payload.*.start_time' => ['required', 'string'],
            'payload.*.end_time' => ['required', 'string'],
            'year_id' => ['required', 'numeric', Rule::exists(Year::class, 'id')],
            'major_id' => ['nullable', 'numeric', Rule::exists(Major::class, 'id')],
            'section_id' => ['required', 'numeric', Rule::exists(Section::class, 'id')],
            'term' => ['required', 'string'],
            'force' => ['required', 'boolean'],
        ]);

        if (!$data['force']) {
            if (
                Schedule::whereCourseId($data['course_id'])
                ->whereMajorId(isset($data['major_id']) ? $data['major_id'] : null)
                ->whereTeacherId($data['teacher_id'])
                ->whereSubjectId($data['subject_id'])
                ->whereYear('year', $data['year'])
                ->whereYearId($data['year_id'])
                ->whereSectionId($data['section_id'])
                ->count() > 0
            ) {
                return response(['message' => 'Data is already existing. Please save again to confirm.'], 409);
            }
        }

        $user = $request->user();

        Log::create([
            'payload' => $user,
            'message' => sprintf('%s has created a schedule.', $user->role),
        ]);

        return Schedule::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Schedule $schedule)
    {
        $schedule->load('course.majors', 'teacher', 'subject', 'major', 'section');

        return $schedule;
    }

    /**
     * Update the specified resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Schedule $schedule)
    {
        $data = $request->validate([
            'course_id' => ['nullable', 'numeric', Rule::exists(Course::class, 'id')],
            'subject_id' => ['nullable', 'numeric', Rule::exists(Subject::class, 'id')],
            'teacher_id' => ['nullable', 'numeric', Rule::exists(User::class, 'id')],
            'year' => ['nullable', 'string'],
            'payload' => ['nullable', 'array'],
            'payload.*.day' => ['required', 'string'],
            'payload.*.start_time' => ['required', 'string'],
            'payload.*.end_time' => ['required', 'string'],
            'year_id' => ['nullable', 'numeric', Rule::exists(Year::class, 'id')],
            'major_id' => ['nullable', 'numeric', Rule::exists(Major::class, 'id')],
            'term' => ['required', 'string'],
            'section_id' => ['nullable', 'numeric', Rule::exists(Section::class, 'id')],
        ]);

        $schedule->update($data);

        $user = $request->user();

        Log::create([
            'payload' => $user,
            'message' => sprintf('%s has updated a schedule.', $user->role),
        ]);

        return $schedule;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Schedule $schedule)
    {
        $schedule->delete();

        $user = $request->user();

        Log::create([
            'payload' => $user,
            'message' => sprintf('%s has deleted a schedule.', $user->role),
        ]);

        return response('', 204);
    }
}
