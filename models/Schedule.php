<?php

namespace Models;

class Schedule extends Model
{
	protected $fillable = [
		'course_id',
		'teacher_id',
		'subject_id',
		'year',
		'payload',
	];

	protected $jsons = ['payload'];

	public function course()
	{
		return $this->belongsTo(Course::class);
	}

	public function teacher()
	{
		return $this->belongsTo(User::class, 'teacher_id');
	}

	public function subject()
	{
		return $this->belongsTo(Subject::class);
	}
}
