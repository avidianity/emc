<?php

namespace Controllers;

use Libraries\Hash;
use Libraries\Str;
use Models\User;
use Queues\SendMail;

class TeacherController extends Controller
{
	public function index()
	{
		return User::getAll()->filter(function (User $teacher) {
			return $teacher->role === 'Teacher';
		});
	}

	public function all()
	{
		return view('teachers.all');
	}

	public function show()
	{
		$id = input()->id;

		return User::findOrFail($id);
	}

	public function view()
	{
		return view('teachers.view');
	}

	public function store()
	{
		$data = input()->all();

		$password = Str::random(5);

		$data['role'] = 'Registrar';
		$data['password'] = Hash::make($password);
		$data['active'] = true;
		$teacher = User::create($data);

		$subject = "New User Account Credentials | EMC Online";

		$queue = new SendMail($teacher->email, 'emails.account', $subject, [
			'name' => $teacher->first_name,
			'number' => $teacher->uuid,
			'password' => $password,
		]);

		queue()->register($queue);

		return $teacher;
	}

	public function create()
	{
		return view('teachers.form', ['mode' => 'Add']);
	}

	public function update()
	{
		$id = input()->id;

		$teacher = User::findOrFail($id);

		$data = input()->all();
		$data['role'] = 'Registrar';

		$teacher->update($data);

		return $teacher;
	}

	public function edit()
	{
		return view('teachers.form', ['mode' => 'Edit']);
	}

	public function destroy()
	{
		$id = input()->id;

		$teacher = User::findOrFail($id);

		$teacher->delete();

		return response('', 204);
	}
}
