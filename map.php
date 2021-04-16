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
        'native' => \Libraries\Session\Native::class,
    ],
];
