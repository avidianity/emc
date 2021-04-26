<?php

namespace Models;

class Course extends Model
{
	protected $fillable = [
		'code',
		'description',
		'open',
	];

	protected $booleans = ['open'];

	protected static function events()
	{
		static::deleting(function (self $course) {
			$course->subjects()->delete();
			$course->admissions()->delete();
			$course->schedules()->delete();
		});
	}

	public function subjects()
	{
		return $this->hasMany(Subject::class, 'course_code', 'code');
	}

	public function admissions()
	{
		return $this->hasMany(Admission::class, 'course_code', 'code');
	}

	public function schedules()
	{
		return $this->hasMany(Schedule::class);
	}
}
