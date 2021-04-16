<?php

namespace Models;

class Course extends Model
{
	protected $fillable = [
		'code',
		'description',
		'open',
	];

	protected static function events()
	{
		static::saving(function (self $course) {
			$course->open = $course->open ? 1 : 0;
		});

		static::serializing(function (self $course) {
			$course->open = $course->open ? true : false;
		});
	}
}
