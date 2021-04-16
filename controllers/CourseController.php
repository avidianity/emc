<?php

namespace Controllers;

use Models\Course;

class CourseController extends Controller
{
	public function index()
	{
		return Course::getAll();
	}

	public function all()
	{
		return view('courses.all');
	}

	public function show()
	{
		$id = input()->id;

		return Course::findOrFail($id);
	}

	public function view()
	{
		return view('courses.view');
	}

	public function store()
	{
		$data = input()->all();

		$data['open'] = array_key_exists('open', $data) && $data['open'] === 'on' ? true : false;

		return Course::create($data);
	}

	public function create()
	{
		return view('courses.form', ['mode' => 'Add']);
	}

	public function update()
	{
		$id = input()->id;

		$course = Course::findOrFail($id);

		$data = input()->all();

		$data['open'] = array_key_exists('open', $data) && $data['open'] === 'on' ? true : false;

		$course->update($data);

		return $course;
	}

	public function edit()
	{
		$id = input()->id;

		$course = Course::findOrFail($id);

		return view('courses.form', ['mode' => 'Edit'] + $course->toArray());
	}

	public function destroy()
	{
		$id = input()->id;

		$course = Course::findOrFail($id);

		$course->delete();

		return response('', 204);
	}
}
