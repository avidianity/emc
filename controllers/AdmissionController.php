<?php

namespace Controllers;

use Libraries\Hash;
use Libraries\Log;
use Libraries\Str;
use Models\Admission;
use Models\Course;
use Models\User;
use Queues\SendMail;
use Throwable;

class AdmissionController extends Controller
{
	public function index()
	{
		return Admission::getAll()->load(['user']);
	}

	public function all()
	{
		return view('admissions.all');
	}

	public function show()
	{
		$id = input()->id;

		return Admission::findOrFail($id);
	}

	public function view()
	{
		return view('admissions.view');
	}

	public function store()
	{
		$data = input()->all();

		$password = Str::random(5);

		$data['role'] = 'Student';
		$data['password'] = Hash::make($password);
		$data['password_unsafe'] = $password;
		$data['active'] = false;

		try {
			$student = User::create($data);
		} catch (Throwable $exception) {
			Log::record($exception);
			return response(['message' => 'Student already exists.'], 404);
		}

		$subject = "Student Admission Credentials | EMC Online";

		$admission = $student->admission()->create($data);

		$queue = new SendMail($student->email, 'emails.admission', $subject, [
			'name' => $student->first_name,
			'number' => $student->uuid,
			'password' => $password,
			'course_code' => $admission->course_code,
			'term' => $admission->term,
			'level' => $admission->level,
			'registrar_name' => session()->get('user')->getFullName(),
		]);

		queue()->register($queue);

		return $admission;
	}

	public function create()
	{
		$courses = Course::getAll();
		return view('admissions.form', ['mode' => 'Add', 'courses' => $courses]);
	}

	public function update()
	{
		$id = input()->id;

		$admission = Admission::findOrFail($id);

		$data = input()->all();

		$admission->update($data);

		return $admission;
	}

	public function edit()
	{
		$id = input()->id;

		$admission = Admission::findOrFail($id);

		$admission->load(['user']);

		$courses = Course::getAll();

		return view('admissions.form', ['mode' => 'Edit', 'courses' => $courses] + $admission->toArray());
	}

	public function destroy()
	{
		$id = input()->id;

		$admission = Admission::findOrFail($id);

		$admission->delete();

		return response('', 204);
	}
}
