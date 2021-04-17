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

	public function course()
	{
		return $this->belongsTo(Course::class, 'course_code', 'code');
	}
}
