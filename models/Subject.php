<?php

namespace Models;

class Subject extends Model
{
	protected $fillable = [
		'code',
		'description',
		'course_code',
		'level',
		'term',
		'units',
	];

	protected static function events()
	{
		static::deleting(function (self $subject) {
			$subject->schedules()->delete();
			$subject->studentSubjects()->delete();
		});
	}

	public function course()
	{
		return $this->belongsTo(Course::class, 'course_code', 'code');
	}

	public function schedules()
	{
		return $this->hasMany(Schedule::class);
	}

	public function studentSubjects()
	{
		return $this->hasMany(StudentSubject::class);
	}
}
