<?php

namespace Controllers;

use Models\Course;
use Models\Subject;

class SubjectController extends Controller
{
	public function index()
	{
		$subjects = Subject::getAll();
		if (session()->get('user')->role === 'Student') {
			return $subjects->filter(function (Subject $subject) {
				return session()->get('user')->admission->level === $subject->level;
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
