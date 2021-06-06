<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Subject;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $builder = Schedule::with('course', 'teacher', 'subject');
        /**
         * @var \App\Models\User
         */
        $user = $request->user();
        $admission = $user->admissions->last();

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
        return Schedule::create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function show(Schedule $schedule)
    {
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
        $schedule->update($request->all());

        return $schedule;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        return response('', 204);
    }
}
