<?php

namespace Controllers;

use Libraries\Hash;
use Libraries\Str;
use Models\User;
use Queues\SendMail;

class RegistrarController extends Controller
{
	public function index()
	{
		return User::getAll()->filter(function (User $registrar) {
			return $registrar->role === 'Registrar';
		});
	}

	public function all()
	{
		if (!session()->has('user')) {
			return redirect('/login');
		}
		return view('registrars.all');
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
		return view('registrars.view');
	}

	public function store()
	{
		$data = input()->all();

		if (!session()->has('registrar-save')) {
			$registrars = find(
				User::class,
				only($data, ['first_name', 'last_name', 'email']) + [
					'role' => 'Registrar'
				]
			);

			if ($registrars->count() > 0) {
				session()->set('registrar-save', true);
				return response(['message' => 'Data is already existing. Please save again to confirm.'], 409);
			}
		} else {
			session()->remove('registrar-save');
		}

		$password = Str::random(5);

		$data['role'] = 'Registrar';
		$data['password'] = Hash::make($password);
		$data['password_unsafe'] = $password;
		$data['active'] = true;
		$registrar = User::create($data);

		$subject = "New User Account Credentials | EMC Online";

		$queue = new SendMail($registrar->email, 'emails.account', $subject, [
			'name' => $registrar->first_name,
			'number' => $registrar->uuid,
			'password' => $password,
		]);

		queue()->register($queue);

		return $registrar;
	}

	public function create()
	{
		if (!session()->has('user')) {
			return redirect('/login');
		}
		return view('registrars.form', ['mode' => 'Add']);
	}

	public function update()
	{
		$id = input()->id;

		$registrar = User::findOrFail($id);

		$data = input()->all();
		$data['role'] = 'Registrar';

		$registrar->update($data);

		return $registrar;
	}

	public function edit()
	{
		if (!session()->has('user')) {
			return redirect('/login');
		}
		$id = input()->id;

		$registrar = User::findOrFail($id);

		return view('registrars.form', ['mode' => 'Edit'] + $registrar->toArray());
	}

	public function destroy()
	{
		$id = input()->id;

		$registrar = User::findOrFail($id);

		$registrar->delete();

		return response('', 204);
	}
}
