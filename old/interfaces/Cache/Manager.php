<?php

namespace Interfaces\Cache;

use Interfaces\Singleton;

/**
 * The base interface for cache managers
 */
interface Manager extends Singleton
{
	public function get($key, $default = null);
	public function set($key, $value);
	public function has($key);
	public function store($key, $callable);
}
