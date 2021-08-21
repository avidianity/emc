<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Log;
use App\Models\Major;
use App\Models\Schedule;
use App\Models\Section;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdvanceController extends Controller
{
    public function schedule(Request $request)
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
                ->whereSectionId($data['section_id'])
                ->whereYearId(null)
                ->count() > 0
            ) {
                return response(['message' => 'Data is already existing. Please save again to confirm.'], 409);
            }
        }

        $user = $request->user();

        Log::create([
            'payload' => $user,
            'message' => sprintf('%s has created an advance schedule.', $user->role),
        ]);

        return Schedule::create($data);
    }

    public function section(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string'],
            'level' => ['required', 'string'],
            'term' => ['required', 'string'],
            'course_id' => ['required', 'numeric', Rule::exists(Course::class, 'id')],
            'major_id' => ['nullable', 'numeric', Rule::exists(Major::class, 'id')],
            'limit' => ['required', 'numeric'],
            'force' => ['required', 'boolean'],
            'room_name' => ['required', 'string'],
        ]);

        if (!$data['force']) {
            if (
                Section::whereLevel($data['level'])
                ->whereTerm($data['term'])
                ->whereCourseId($data['course_id'])
                ->whereMajorId(isset($data['major_id']) ? $data['major_id'] : null)
                ->whereYearId(null)
                ->whereName($data['name'])
                ->whereRoomName($data['room_name'])
                ->count() > 0
            ) {
                return response(['message' => 'Data is already existing. Please save again to confirm.'], 409);
            }
        }

        return Section::create($data);
    }
}
