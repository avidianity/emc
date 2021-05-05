<?php

return [
	'storage' => [
		'file' => \Libraries\Storage\FileStorage::class,
		'database' => \Libraries\Storage\DatabaseStorage::class,
		'dropbox' => \Libraries\Storage\DropboxStorage::class,
	],
	'cache' => [
		'memory' => \Libraries\Cache\MemoryCache::class,
	],
	'queue' => [
		'sync' => \Libraries\Queue\SyncManager::class,
		'file' => \Libraries\Queue\FileManager::class,
		'database' => \Libraries\Queue\DatabaseManager::class,
	],
	'session' => [
		'manager' => \Libraries\Session\Manager::class,
		'file' => \Libraries\Session\Drivers\FileHandler::class,
		'database' => \Libraries\Session\Drivers\DatabaseHandler::class,
	],
	'database' => [
		'mysql' => \Libraries\Database\Connection\MySQLConnection::class,
		'sqlite' => \Libraries\Database\Connection\SQLiteConnection::class,
	],
];
