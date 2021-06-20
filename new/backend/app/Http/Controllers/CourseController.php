<?php

namespace App\Http\Controllers;

use App\Models\Course;
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
    public function index()
    {
        return Course::with('majors')
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
            'code' => ['required', 'string'],
            'description' => ['required', 'string'],
            'open' => ['required', 'boolean'],
            'majors' => ['nullable', 'array'],
            'majors.*.name' => ['required', 'string'],
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
        ]);

        $course->update($data);

        if (isset($data['majors'])) {
            $course->majors()->delete();
            $course->majors()->createMany($data['majors']);
        }

        return $course;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Course  $course
     * @return \Illuminate\Http\Response
     */
    public function destroy(Course $course)
    {
        $course->delete();

        return response('', 204);
    }
}
