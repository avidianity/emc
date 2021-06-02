<?php

namespace Controllers;

use Models\Course;
use Models\Schedule;
use Models\StudentSubject;
use Models\Subject;
use Models\User;

class ScheduleController extends Controller
{
	public function index()
	{
		if (session()->get('user')->role === 'Student') {
			$schedules = session()->get('user')->subjects->map(function (StudentSubject $studentSubject) {
				return $studentSubject->subject->schedules;
			});

			$payload = [];

			foreach ($schedules as $scheduleSet) {
				foreach ($scheduleSet as $schedule) {
					$payload[] = $schedule;
				}
			}

			return collect($payload)->filter(function (Schedule $schedule) {
				return $schedule->subject->level === session()->get('user')->admission->level
					&& $schedule->subject->term === session()->get('user')->admission->term;
			})->load(['course', 'teacher', 'subject']);
		}

		if (!session()->get('user')->role === 'Teacher') {
			return session()->get('user')->schedules->load(['course', 'teacher', 'subject']);
		}

		return Schedule::getAll()->load(['course', 'teacher', 'subject']);
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

		if (!session()->has('schedule-save')) {
			$schedules = find(
				Schedule::class,
				only($data, ['course_id', 'teacher_id', 'subject_id', 'year'])
			);

			if ($schedules->count() > 0) {
				session()->set('schedule-save', true);
				return response(['message' => 'Data is already existing. Please save again to confirm.'], 409);
			}
		} else {
			session()->remove('schedule-save');
		}

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
		if (!session()->has('user')) {
			return redirect('/login');
		}
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
