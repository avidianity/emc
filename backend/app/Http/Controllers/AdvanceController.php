<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Major;
use App\Models\Schedule;
use App\Models\Section;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;

class AdvanceController extends Controller
{
    public function __invoke(Request $request)
    {
        $data = $request->validate([
            'course_id' => ['required', 'numeric', Rule::exists(Course::class, 'id')],
            'major_id' => ['nullable', 'numeric', Rule::exists(Major::class, 'id')],
            'level' => ['required', 'string'],
            'term' => ['required', 'string'],

            'schedule.subject_id' => ['required', 'numeric', Rule::exists(Subject::class, 'id')],
            'schedule.teacher_id' => ['required', 'numeric', Rule::exists(User::class, 'id')],
            'schedule.payload' => ['required', 'array'],
            'schedule.payload.*.day' => ['required', 'string'],
            'schedule.payload.*.start_time' => ['required', 'string'],
            'schedule.payload.*.end_time' => ['required', 'string'],

            'section.name' => ['required', 'string'],
            'section.limit' => ['required', 'numeric'],

            'force' => ['required', 'boolean'],
        ]);

        if (!$data['force']) {
            /**
             * @var \App\Models\Section|null
             */
            $section = Section::whereLevel($data['level'])
                ->whereTerm($data['term'])
                ->whereCourseId($data['course_id'])
                ->whereMajorId(isset($data['major_id']) ? $data['major_id'] : null)
                ->first();

            $scheduleBuilder =  Schedule::whereCourseId($data['course_id'])
                ->whereMajorId(isset($data['major_id']) ? $data['major_id'] : null)
                ->whereTeacherId($data['schedule']['teacher_id'])
                ->whereSubjectId($data['schedule']['subject_id'])
                ->whereYear('year', $data['level'])
                ->whereSectionId($section ? $section->id : null);

            if ($section && $scheduleBuilder->count() > 0) {
                return response(['message' => 'Data is already existing. Please save again to confirm.'], 409);
            }
        }

        $section = Section::create($data['section'] + Arr::only($data, ['course_id', 'major_id', 'level', 'term']));

        return [
            'section' => $section,
            'schedule' => Schedule::create($data['schedule'] + [
                'section_id' => $section->id,
                'year' => $data['level'],
                'term' => $data['term'],
            ]),
        ];
    }
}
