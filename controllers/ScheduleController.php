<?php

namespace Controllers;

use Models\Course;
use Models\Schedule;
use Models\Subject;
use Models\User;

class ScheduleController extends Controller
{
	public function index()
	{
		$schedules = Schedule::getAll()->load(['course', 'teacher', 'subject']);

		if (session()->get('user')->role === 'Student') {
			return $schedules->filter(function (Schedule $schedule) {
				return $schedule->subject->level === session()->get('user')->admission->level;
			});
		}

		return $schedules;
	}

	public function all()
	{
		return view('schedules.all');
	}

	public function show()
	{
		$id = input()->id;

		$schedule = Schedule::findOrFail($id);

		$schedule->load(['course', 'teacher', 'subject']);

		return $schedule;
	}

	public function view()
	{
		return view('schedules.view');
	}

	public function store()
	{
		$data = input()->all();

		return Schedule::create($data);
	}

	public function create()
	{
		$courses = Course::getAll();
		$subjects = Subject::getAll();
		$teachers = User::getAll()->filter(function (User $user) {
			return $user->role === 'Teacher';
		});

		return view('schedules.form', [
			'mode' => 'Add',
			'courses' => $courses,
			'teachers' => $teachers,
			'subjects' => $subjects
		]);
	}

	public function update()
	{
		$id = input()->id;

		$schedule = Schedule::findOrFail($id);

		$data = input()->all();

		if (!input()->has('payload')) {
			$data['payload'] = [];
		}

		$schedule->update($data);

		return $schedule;
	}

	public function edit()
	{
		$id = input()->id;

		$schedule = Schedule::findOrFail($id);

		$courses = Course::getAll();
		$subjects = Subject::getAll();
		$teachers = User::getAll()->filter(function (User $user) {
			return $user->role === 'Teacher';
		});

		return view('schedules.form', [
			'mode' => 'Edit',
			'courses' => $courses,
			'teachers' => $teachers,
			'subjects' => $subjects,
		] + $schedule->toArray());
	}

	public function destroy()
	{
		$id = input()->id;

		$schedule = Schedule::findOrFail($id);

		$schedule->delete();

		return response('', 204);
	}
}
