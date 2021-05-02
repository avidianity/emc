<?php

namespace Models;

class User extends Model
{
	protected $fillable = [
		'first_name',
		'last_name',
		'middle_name',
		'address',
		'birthday',
		'gender',
		'role',
		'email',
		'number',
		'active',
		'password',
		'password_unsafe',
		'uuid',
		'fathers_name',
		'mothers_name',
		'fathers_occupation',
		'mothers_occupation',
		'place_of_birth',
	];

	protected $hidden = ['password'];

	protected $booleans = ['active'];

	protected static function events()
	{
		static::deleting(function (self $user) {
			$user->admission()->delete();
			$user->schedules()->delete();
			$user->grades()->delete();
		});
	}

	public function getFullName()
	{
		return sprintf('%s, %s %s', $this->last_name, $this->first_name, $this->middle_name);
	}

	public function admission()
	{
		return $this->hasOne(Admission::class);
	}

	public function schedules()
	{
		return $this->hasMany(Schedule::class, 'teacher_id');
	}

	public function grades()
	{
		return $this->hasMany(Grade::class);
	}
}
