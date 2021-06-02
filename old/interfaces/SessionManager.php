<?php

namespace Interfaces;

use JsonSerializable;

interface SessionManager extends JsonSerializable
{
	/**
	 * @param string $key
	 * @param mixed $default
	 * @return mixed|null
	 */
	public function get($key, $default = null);

	/**
	 * @param string $key
	 * @param mixed $data
	 * @return static
	 */
	public function set($key, $data);

	/**
	 * @param string $key
	 * @return bool
	 */
	public function has($key);

	/**
	 * @param string $key
	 * @return static
	 */
	public function remove($key);

	/**
	 * @return static
	 */
	public function clear();
}
