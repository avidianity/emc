<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Log;
use App\Models\Major;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Unit::with([
            'course',
            'major',
        ])->get();
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
            'units' => ['required', 'numeric'],
            'course_id' => ['required', 'numeric', Rule::exists(Course::class, 'id')],
            'major_id' => ['nullable', 'numeric', Rule::exists(Major::class, 'id')],
            'level' => ['required', 'string'],
            'term' => ['required', 'string'],
        ]);

        /**
         * @var \App\Models\Unit|null
         */
        $unit = Unit::whereCourseId($data['course_id'])
            ->whereMajorId(isset($data['major_id']) ? $data['major_id'] : null)
            ->whereLevel($data['level'])
            ->whereTerm($data['term'])
            ->first();

        if ($unit) {
            $unit->update($data);
        } else {
            $unit = Unit::create($data);
        }

        $user = $request->user();

        Log::create([
            'payload' => $user,
            'message' => sprintf('%s has created a unit for a course.', $user->role),
        ]);

        return $unit;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Unit  $unit
     * @return \Illuminate\Http\Response
     */
    public function show(Unit $unit)
    {
        $unit->load('course', 'major');

        return $unit;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Unit  $unit
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Unit $unit)
    {
        $data = $request->validate([
            'units' => ['nullable', 'numeric'],
            'course_id' => ['nullable', 'numeric', Rule::exists(Course::class, 'id')],
            'major_id' => ['nullable', 'numeric', Rule::exists(Major::class, 'id')],
            'level' => ['nullable', 'string'],
            'term' => ['nullable', 'string'],
        ]);

        $unit->update($data);

        $user = $request->user();

        Log::create([
            'payload' => $user,
            'message' => sprintf('%s has updated a unit for a course.', $user->role),
        ]);

        return $unit;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Unit  $unit
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Unit $unit)
    {
        $unit->delete();

        $user = $request->user();

        Log::create([
            'payload' => $user,
            'message' => sprintf('%s has deleted a unit for a course.', $user->role),
        ]);

        return response('', 204);
    }
}
