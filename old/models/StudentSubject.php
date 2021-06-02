<?php

namespace Models;

class StudentSubject extends Model
{
	protected $fillable = [
		'user_id',
		'subject_id',
	];

	protected static $table = 'student_subject';

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function subject()
	{
		return $this->belongsTo(Subject::class);
	}
}
