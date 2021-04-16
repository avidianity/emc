<?php

namespace Libraries\Queue;

use Interfaces\Queue\Manager;
use Interfaces\Queue\Queueable;
use Libraries\Log;
use Throwable;

class SyncManager extends Manager
{
	public function register(Queueable $queueable)
	{
		try {
			$queueable->boot();
			$queueable->run();
			$queueable->cleanup();
			return true;
		} catch (Throwable $e) {
			$queueable->report($e);
			Log::record($e);
			return false;
		}
	}

	public function work()
	{
		echo "\nNo Queues to run. Exiting...\n";
		exit;
	}
}
