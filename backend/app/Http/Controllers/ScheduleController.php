<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Log;
use App\Models\Major;
use App\Models\Schedule;
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
        $builder = Schedule::with('course', 'teacher', 'subject', 'major');
        /**
         * @var \App\Models\User
         */
        $user = $request->user();
        $admission = $user->admissions()->whereHas('year', function (Builder $builder) {
            return $builder->where('current', true);
        })->first();

        if ($user->role === 'Student') {
            $subjects = $user->subjects->map(function (Subject $subject) {
                return $subject->id;
            });

            if ($admission) {
                $builder = $builder->where('year', $admission->level);
            }

            $builder = $builder->whereIn('subject_id', $subjects->toArray());
        } else if ($user->role === 'Teacher') {
            $builder = $builder->where('teacher_id', $user->id);
        }

        return $builder->get();
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
            'subject_id' => ['required', 'numeric', Rule::exists(Subject::class, 'id')],
            'teacher_id' => ['required', 'numeric', Rule::exists(User::class, 'id')],
            'year' => ['required', 'string'],
            'payload' => ['required', 'array'],
            'payload.*.day' => ['required', 'string'],
            'payload.*.start_time' => ['required', 'string'],
            'payload.*.end_time' => ['required', 'string'],
            'year_id' => ['required', 'numeric', Rule::exists(Year::class, 'id')],
            'major_id' => ['nullable', 'numeric', Rule::exists(Major::class, 'id')],
            'force' => ['required', 'boolean'],
        ]);

        if (!$data['force']) {
            if (
                Schedule::whereCourseId($data['course_id'])
                ->whereTeacherId($data['teacher_id'])
                ->whereSubjectId($data['subject_id'])
                ->whereYear('year', $data['year'])
                ->whereYearId($data['year_id'])
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
     * @param  \App\Models\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function show(Schedule $schedule)
    {
        $schedule->load('course.majors', 'teacher', 'subject');
        return $schedule;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Schedule  $schedule
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
     * @param  \App\Models\Schedule  $schedule
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
