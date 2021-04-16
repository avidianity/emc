<?php

namespace Models;

class Mail extends Model
{
	protected $fillable = [
		'uuid',
		'to',
		'subject',
		'status',
		'sent',
		'body',
	];
}
