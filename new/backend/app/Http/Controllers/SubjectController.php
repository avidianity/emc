<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Major;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        /**
         * @var \App\Models\User
         */
        $user = $request->user();
        $builder = Subject::with('course', 'schedules', 'major');

        if ($user->role === 'Teacher' && !$request->has('all')) {
            $builder = $builder->whereHas('schedules', function (Builder $builder) use ($user) {
                return $builder->where('teacher_id', $user->id);
            });
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
            'code' => ['required', 'string'],
            'description' => ['required', 'string'],
            'course_id' => ['required', 'numeric', Rule::exists(Course::class, 'id')],
            'level' => ['required', 'string'],
            'term' => ['required', 'string'],
            'units' => ['required', 'string'],
            'force' => ['required', 'boolean'],
            'major_id' => ['nullable', 'numeric', Rule::exists(Major::class, 'id')],
        ]);

        if (!$data['force']) {
            $builder = Subject::whereCode($data['code'])
                ->whereDescription($data['description'])
                ->whereCourseId($data['course_id'])
                ->whereLevel($data['level']);

            if (isset($data['major_id'])) {
                $builder = $builder->whereMajorId($data['major_id']);
            }

            if ($builder->count() > 0) {
                return response(['message' => 'Data is already existing. Please save again to confirm.'], 409);
            }
        }

        return Subject::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Subject  $subject
     * @return \Illuminate\Http\Response
     */
    public function show(Subject $subject)
    {
        $subject->load('course.majors');
        return $subject;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Subject  $subject
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Subject $subject)
    {
        $data = $request->validate([
            'code' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'course_id' => ['nullable', 'numeric', Rule::exists(Course::class, 'id')],
            'level' => ['nullable', 'string'],
            'term' => ['nullable', 'string'],
            'units' => ['nullable', 'string'],
            'major_id' => ['nullable', 'numeric', Rule::exists(Major::class, 'id')],
        ]);

        $subject->update($data);

        return $subject;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Subject  $subject
     * @return \Illuminate\Http\Response
     */
    public function destroy(Subject $subject)
    {
        $subject->delete();

        return response('', 204);
    }

    public function enroll(Request $request, User $user)
    {
        $data = $request->all();

        $subjects = Subject::find($data['subjects']);

        $units = $subjects->reduce(function ($previous, Subject $subject) {
            $units = (int)$subject->units;
            return $previous + $units;
        }, 0);

        if ($units > $user->allowed_units) {
            return response(['message' => 'Number of subjects exceed student\'s maximum allowed units.'], 400);
        }

        $user->subjects()->sync($data['subjects']);
        $user->load(['subjects']);
        return $user;
    }
}
