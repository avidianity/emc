<?php

namespace Models;

class Session extends Model
{
	protected $fillable = ['id', 'payload', 'last_activity'];

	protected $timestamps = false;
}
