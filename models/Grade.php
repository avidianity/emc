<?php

namespace Models;

class Grade extends Model
{
	protected $fillable = [
		'student_id',
		'subject_id',
		'grade',
		'teacher_id',
	];

	public function student()
	{
		return $this->belongsTo(User::class, 'student_id');
	}

	public function subject()
	{
		return $this->belongsTo(Subject::class);
	}

	public function teacher()
	{
		return $this->belongsTo(User::class, 'teacher_id');
	}
}
