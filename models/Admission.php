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
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
