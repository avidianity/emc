<?php

namespace Libraries\Database;

use Interfaces\Database\Manager as ManagerContract;
use RuntimeException;
use Traits\Singleton;

class Manager implements ManagerContract
{
	use Singleton;

	protected $connections = [];

	public function create($key = 'default')
	{
		$driver = config('database.driver');
		$config = config("database.{$driver}.{$key}");

		$class = map("database.{$driver}");

		if (!class_exists($class)) {
			throw new RuntimeException(sprintf('%s does not exist.', $class));
		}

		$this->connections[$key] = new $class($config);

		return $this;
	}

	public function get($key = 'default')
	{
		if (!isset($this->connections[$key])) {
			$this->create($key);
		}

		return $this->connections[$key];
	}

	public function remove($key)
	{
		if (isset($this->connections[$key])) {
			unset($this->connections[$key]);
		}

		return $this;
	}
}
