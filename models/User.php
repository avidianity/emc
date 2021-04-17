<?php

namespace Models;

class User extends Model
{
	protected $fillable = [
		'first_name',
		'last_name',
		'middle_name',
		'role',
		'email',
		'number',
		'active',
		'password',
		'uuid',
	];

	protected $hidden = ['password'];

	protected static function events()
	{
		static::saving(function (self $user) {
			$user->active = $user->active ? 1 : 0;
		});

		static::serializing(function (self $user) {
			$user->active = $user->active ? true : false;
		});
	}

	public function admissions()
	{
		return $this->hasMany(Admission::class);
	}
}
