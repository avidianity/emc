<?php

namespace Libraries\Database\Connection;

use Interfaces\Database\Connection\Connection;
use Traits\Database\Connection\Bootable;
use PDO;
use RuntimeException;
use Traits\Singleton;

class SQLiteConnection extends PDO implements Connection
{
	use Bootable, Singleton;

	public function __construct($credentials = [])
	{
		$path = $credentials['path'];
		if (!file_exists($path)) {
			throw new RuntimeException(sprintf('%s does not exist.'));
		}
		parent::__construct(
			sprintf('sqlite:%s', $path)
		);
		$this->boot();
	}
}
