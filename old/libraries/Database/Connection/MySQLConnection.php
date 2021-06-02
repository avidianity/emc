<?php

namespace Libraries\Database\Connection;

use Interfaces\Database\Connection\Connection;
use Traits\Database\Connection\Bootable;
use PDO;
use Traits\Singleton;

class MySQLConnection extends PDO implements Connection
{
	use Bootable, Singleton;

	public function __construct($credentials = [])
	{
		parent::__construct(
			sprintf('mysql:dbname=%s;host=%s;port=%s', $credentials['name'], $credentials['host'], $credentials['port']),
			$credentials['username'],
			isset($credentials['password']) ? $credentials['password'] : null
		);
		$this->boot();
	}
}
