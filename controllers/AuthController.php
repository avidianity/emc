<?php

namespace Controllers;

use Libraries\Hash;
use Models\User;

class AuthController extends Controller
{
	public function login()
	{
		$pdo = User::getConnection();

		$query  = sprintf('SELECT * FROM %s WHERE %s = :email OR %s = :uuid LIMIT 1', User::table(), User::justifyKey('email'), User::justifyKey('uuid'));

		$statement = $pdo->prepare($query);

		$email = input()->email;

		$statement->execute([':email' => $email, ':uuid' => $email]);

		if ($statement->rowCount() === 0) {
			return response(['message' => 'Email does not exist.'], 404);
		}

		$user = User::from($statement->fetch());

		if (!Hash::check(input()->password, $user->password)) {
			return response(['message' => 'Password is incorrect.'], 403);
		}

		session()->set('user', $user);

		return response(['user' => $user]);
	}

	public function logout()
	{
		session()->clear();

		return response('', 204);
	}

	public function self()
	{
		$user = session()->get('user');

		if (!Hash::check(input()->current_password, $user->password)) {
			return response(['message' => 'Password is incorrect.'], 403);
		}

		$user->update(['password' => Hash::make(input()->new_password)]);

		session()->set('user', $user);

		return $user;
	}
}
