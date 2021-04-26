<?php

namespace Libraries\Validation;

/**
 * @property-read bool $passes
 */
class Validator
{
	protected $passes;

	public function __get($name)
	{
		return $this->{$name};
	}
}
