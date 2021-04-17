<?php

namespace Controllers;

use Libraries\Hash;
use Libraries\Str;
use Models\Admission;
use Models\Course;
use Models\User;
use Queues\SendMail;

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
		$data['active'] = true;
		$student = User::create($data);

		$subject = "New User Account Credentials | EMC Online";

		$queue = new SendMail($student->email, 'emails.account', $subject, [
			'name' => $student->first_name,
			'number' => $student->uuid,
			'password' => $password,
		]);

		queue()->register($queue);

		return $student->admissions()->create($data);
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
