<?php

namespace Controllers;

use Models\Course;
use Models\Schedule;
use Models\StudentSubject;
use Models\Subject;

class SubjectController extends Controller
{
	public function index()
	{
		$subjects = Subject::getAll();
		if (session()->get('user')->role === 'Student') {
			return session()->get('user')->subjects->map(function (StudentSubject $studentSubject) {
				return $studentSubject->subject;
			});
		}

		if (session()->get('user')->role === 'Teacher') {
			return session()->get('user')->schedules->load(['subject'])->map(function (Schedule $schedule) {
				return $schedule->subject;
			});
		}

		return $subjects;
	}

	public function all()
	{
		return view('subjects.all');
	}

	public function show()
	{
		$id = input()->id;

		return Subject::findOrFail($id);
	}

	public function view()
	{
		return view('subjects.view');
	}

	public function store()
	{
		$data = input()->all();

		if (!session()->has('subject-save')) {
			$subjects = find(
				Subject::class,
				only($data, ['code', 'description', 'course_code', 'level'])
			);

			if ($subjects->count() > 0) {
				session()->set('subject-save', true);
				return response(['message' => 'Data is already existing. Please save again to confirm.'], 409);
			}
		} else {
			session()->remove('subject-save');
		}

		return Subject::create($data);
	}

	public function create()
	{
		$courses = Course::getAll();

		return view('subjects.form', ['mode' => 'Add', 'courses' => $courses]);
	}

	public function update()
	{
		$id = input()->id;

		$subject = Subject::findOrFail($id);

		$data = input()->all();

		$subject->update($data);

		return $subject;
	}

	public function edit()
	{
		$id = input()->id;

		$subject = Subject::findOrFail($id);

		$courses = Course::getAll();

		return view('subjects.form', ['mode' => 'Edit', 'courses' => $courses] + $subject->toArray());
	}

	public function destroy()
	{
		$id = input()->id;

		$subject = Subject::findOrFail($id);

		$subject->delete();

		return response('', 204);
	}
}
