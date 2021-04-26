<?php

namespace Models;

class Admission extends Model
{
	protected $fillable = [
		'course_code',
		'level',
		'status',
		'term',
		'user_id',
		'type',
		'graduated',
	];

	protected $booleans = ['graduated'];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function course()
	{
		return $this->belongsTo(Course::class, 'course_code', 'code');
	}
}
