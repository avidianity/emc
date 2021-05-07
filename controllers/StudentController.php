<?php

namespace Controllers;

use Libraries\Hash;
use Libraries\Str;
use Models\User;
use Queues\SendMail;

class StudentController extends Controller
{
	public function index()
	{
		return User::getAll()->filter(function (User $student) {
			if ($student->role === 'Student') {
				$student->load(['admission']);
				return true;
			}
			return false;
		});
	}

	public function all()
	{
		return view('students.all');
	}

	public function show()
	{
		$id = input()->id;

		$student = User::findOrFail($id)->load(['admission']);

		$student->load(['subjects']);
		$student->subjects->load(['subject']);

		return $student;
	}

	public function view()
	{
		return view('students.view');
	}

	public function store()
	{
		$data = input()->all();

		$password = Str::random(5);

		$data['role'] = 'Student';
		$data['password'] = Hash::make($password);
		$data['password_unsafe'] = $password;
		$data['active'] = true;
		$student = User::create($data);

		$subject = "New User Account Credentials | EMC Online";

		$queue = new SendMail($student->email, 'emails.account', $subject, [
			'name' => $student->first_name,
			'number' => $student->uuid,
			'password' => $password,
		]);

		queue()->register($queue);

		return $student;
	}

	public function create()
	{
		return view('students.form', ['mode' => 'Add']);
	}

	public function update()
	{
		$id = input()->id;

		$student = User::findOrFail($id);

		$data = input()->except(['password']);
		$data['role'] = 'Student';

		$student->update($data);

		return $student;
	}

	public function edit()
	{
		$id = input()->id;

		$student = User::findOrFail($id)->load(['admission', 'subjects']);

		return view('students.form', ['mode' => 'Edit'] + $student->toArray());
	}

	public function destroy()
	{
		$id = input()->id;

		$student = User::findOrFail($id);

		$student->delete();

		return response('', 204);
	}
}
