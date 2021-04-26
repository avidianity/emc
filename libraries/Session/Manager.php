<?php

namespace Libraries\Session;

use Interfaces\SessionManager;
use Interfaces\Singleton as SingletonContract;
use Traits\Singleton;
use SessionHandlerInterface;

class Manager implements SessionManager, SingletonContract
{
	use Singleton;

	/**
	 * The session handler
	 *
	 * @var SessionHandlerInterface
	 */
	protected $handler;

	public function __construct()
	{
		$driver = config('session.driver');
		$class = map("session.{$driver}");

		session_set_save_handler(new $class(), true);

		session_start();
	}

	public function get($key, $default = null)
	{
		return $this->has($key) ? $_SESSION[$key] : $default;
	}

	public function has($key)
	{
		return array_key_exists($key, $_SESSION);
	}

	public function set($key, $data)
	{
		$_SESSION[$key] = $data;

		return $this;
	}

	public function remove($key)
	{
		if ($this->has($key)) {
			unset($_SESSION[$key]);
		}

		return $this;
	}

	public function clear()
	{
		session_destroy();
		session_start();

		return $this;
	}

	public function jsonSerialize()
	{
		return $_SESSION;
	}
}
