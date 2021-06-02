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
		if (!session()->has('user')) {
			return redirect('/login');
		}
		return view('teachers.all');
	}

	public function show()
	{
		$id = input()->id;

		return User::findOrFail($id);
	}

	public function view()
	{
		if (!session()->has('user')) {
			return redirect('/login');
		}
		return view('teachers.view');
	}

	public function store()
	{
		$data = input()->all();

		if (!session()->has('teacher-save')) {
			$teachers = find(
				User::class,
				only($data, ['first_name', 'last_name', 'email']) + [
					'role' => 'Teacher'
				]
			);

			if ($teachers->count() > 0) {
				session()->set('teacher-save', true);
				return response(['message' => 'Data is already existing. Please save again to confirm.'], 409);
			}
		} else {
			session()->remove('teacher-save');
		}

		$password = Str::random(5);

		$data['role'] = 'Teacher';
		$data['password'] = Hash::make($password);
		$data['password_unsafe'] = $password;
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
		if (!session()->has('user')) {
			return redirect('/login');
		}
		return view('teachers.form', ['mode' => 'Add']);
	}

	public function update()
	{
		$id = input()->id;

		$teacher = User::findOrFail($id);

		$data = input()->all();
		$data['role'] = 'Teacher';

		$teacher->update($data);

		return $teacher;
	}

	public function edit()
	{
		if (!session()->has('user')) {
			return redirect('/login');
		}
		$id = input()->id;

		$teacher = User::findOrFail($id);

		return view('teachers.form', ['mode' => 'Edit'] + $teacher->toArray());
	}

	public function destroy()
	{
		$id = input()->id;

		$teacher = User::findOrFail($id);

		$teacher->delete();

		return response('', 204);
	}
}