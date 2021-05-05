<?php

namespace Interfaces\Database;

use Interfaces\Singleton;

interface Manager extends Singleton
{
	/**
	 * Create a database connection
	 *
	 * @param string $key
	 * @return static
	 */
	public function create($key = 'default');

	/**
	 * Get a database connection
	 * 
	 * @param string $key
	 * @return \Interfaces\Database\Connection\Connection
	 */
	public function get($key = 'default');

	/**
	 * Remove a database connection
	 * 
	 * @param string $key
	 * @return static
	 */
	public function remove($key);
}
