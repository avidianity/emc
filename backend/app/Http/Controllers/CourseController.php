<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Log;
use App\Models\Major;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class CourseController extends Controller
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
         * @var \App\Models\User
         */
        $user = $request->user('sanctum');

        $builder = Course::with('majors');

        if ($user && $user->role === 'Teacher') {
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
            'open' => ['required', 'boolean'],
            'majors' => ['nullable', 'array'],
            'majors.*.name' => ['required', 'string'],
            'majors.*.short_name' => ['required', 'string'],
            'force' => ['required', 'boolean'],
        ]);

        if (
            !$data['force'] && Course::whereCode($data['code'])
            ->whereDescription($data['description'])
            ->count() > 0
        ) {
            return response(['message' => 'Data is already existing. Please save again to confirm.'], 409);
        }

        $course = Course::create($data);

        if (isset($data['majors'])) {
            $course->majors()->createMany($data['majors']);
        }

        $user = $request->user();

        Log::create([
            'payload' => $user,
            'message' => sprintf('%s has created a course.', $user->role),
        ]);

        return $course;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Course  $course
     * @return \Illuminate\Http\Response
     */
    public function show(Course $course)
    {
        $course->load('majors');
        return $course;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Course  $course
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Course $course)
    {
        $data = $request->validate([
            'code' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'open' => ['nullable', 'boolean'],
            'majors' => ['nullable', 'array'],
            'majors.*.name' => ['required', 'string'],
            'majors.*.short_name' => ['required', 'string'],
        ]);

        if (isset($data['majors'])) {
            if (empty($data['majors'])) {
                $course->majors->each(function (Major $major) {
                    return $major->delete();
                });
            }

            $names = collect($data['majors'])->map(function ($major) {
                return $major['name'];
            })->toArray();

            $majors = $course->majors()->whereNotIn('name', $names)->get();

            $majors->each(function (Major $major) {
                $major->delete();
            });

            $left = $course->majors()->get()->map(function (Major $major) {
                return $major->name;
            })->toArray();

            $majors = collect($data['majors'])->filter(function ($major) use ($left) {
                return !in_array($major['name'], $left);
            })->toArray();

            $course->majors()->createMany($majors);
        } else {
            $course->majors->each(function (Major $major) {
                $major->delete();
            });
        }

        $course->update($data);

        $user = $request->user();

        Log::create([
            'payload' => $user,
            'message' => sprintf('%s has updated a course.', $user->role),
        ]);

        return $course;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Course  $course
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Course $course)
    {
        $course->delete();
        $user = $request->user();

        Log::create([
            'payload' => $user,
            'message' => sprintf('%s has deleted a course.', $user->role),
        ]);

        return response('', 204);
    }
}
