<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Major;
use App\Models\Section;
use App\Models\Year;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SectionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Section::with([
            'schedules',
            'course',
            'year',
            'major',
        ])
            ->withCount('students')
            ->get();
    }

    public function advance()
    {
        return Section::whereNull('year_id')
            ->with([
                'schedules',
                'course',
                'major',
            ])
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
            'name' => ['required', 'string'],
            'level' => ['required', 'string'],
            'term' => ['required', 'string'],
            'course_id' => ['required', 'numeric', Rule::exists(Course::class, 'id')],
            'year_id' => ['nullable', 'numeric', Rule::exists(Year::class, 'id')],
            'major_id' => ['nullable', 'numeric', Rule::exists(Major::class, 'id')],
            'limit' => ['required', 'numeric'],
        ]);

        $builder = Section::whereLevel($data['level'])
            ->whereTerm($data['term'])
            ->whereCourseId($data['course_id'])
            ->whereYearId(isset($data['year_id']) ? $data['year_id'] : null)
            ->whereMajorId(isset($data['major_id']) ? $data['major_id'] : null);

        if ($builder->count() > 0) {
            return response(['message' => 'Data is already existing. Please save again to confirm.'], 409);
        }

        return Section::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Section  $section
     * @return \Illuminate\Http\Response
     */
    public function show(Section $section)
    {
        $section->load([
            'schedules',
            'course',
            'year',
            'major',
        ]);

        return $section;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Section  $section
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Section $section)
    {
        $data = $request->validate([
            'name' => ['nullable', 'string'],
            'level' => ['nullable', 'string'],
            'term' => ['nullable', 'string'],
            'course_id' => ['nullable', 'numeric', Rule::exists(Course::class, 'id')],
            'year_id' => ['nullable', 'numeric', Rule::exists(Year::class, 'id')],
            'major_id' => ['nullable', 'numeric', Rule::exists(Major::class, 'id')],
            'limit' => ['nullable', 'numeric'],
        ]);

        $section->update($data);

        return $section;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Section  $section
     * @return \Illuminate\Http\Response
     */
    public function destroy(Section $section)
    {
        $section->delete();

        return response('', 204);
    }

    public function current(Request $request)
    {
        return $request->user()
            ->sections()
            ->whereHas('year', function (Builder $builder) {
                return $builder->where('current', true);
            })
            ->first();
    }
}
