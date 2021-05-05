<?php

namespace Traits\Database\Connection;

trait Bootable
{
	public function boot()
	{
		$this->setAttribute(static::ATTR_DEFAULT_FETCH_MODE, static::FETCH_OBJ);
		$this->setAttribute(static::ATTR_ERRMODE, static::ERRMODE_EXCEPTION);
		$this->setAttribute(static::ATTR_EMULATE_PREPARES, false);
		$this->setAttribute(static::ATTR_STRINGIFY_FETCHES, false);
	}
}
