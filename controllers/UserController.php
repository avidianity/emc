<?php

namespace Controllers;

use Libraries\Hash;
use Models\User;

class UserController extends Controller
{
	public function index()
	{
		return User::getAll();
	}

	public function all()
	{
		return view('users.all');
	}

	public function show()
	{
		$id = input()->id;

		return User::findOrFail($id);
	}

	public function view()
	{
		return view('users.view');
	}

	public function store()
	{
		return User::create(input()->all());
	}

	public function create()
	{
		return view('users.form', ['mode' => 'Add']);
	}

	public function update()
	{
		$id = input()->id;

		$user = User::findOrFail($id);

		$data = input()->all();

		if (isset($data['password'])) {
			$data['password'] = Hash::make($data['password']);
		}

		$user->update($data);

		return $user;
	}

	public function edit()
	{
		return view('users.form', ['mode' => 'Edit']);
	}

	public function destroy()
	{
		$id = input()->id;

		$user = User::findOrFail($id);

		$user->delete();

		return response('', 204);
	}
}
