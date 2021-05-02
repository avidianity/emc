<?php

namespace Libraries\Session\Drivers;

use Libraries\Log;
use Models\Session;
use SessionHandlerInterface;
use Throwable;

class DatabaseHandler implements SessionHandlerInterface
{
	/**
	 * The database connection
	 *
	 * @var \Libraries\Database
	 */
	protected $pdo;

	public function open($path, $name)
	{
		$this->pdo = Session::getConnection();
		return true;
	}

	public function close()
	{
		return true;
	}

	public function read($id)
	{
		$session = Session::find($id);

		if (!$session) {
			return '';
		}

		return $session->payload;
	}

	public function write($id, $data)
	{
		try {
			$session = Session::find($id);

			$payload = [
				'payload' => $data,
				'id' => $id,
				'last_activity' => time(),
			];

			if ($session) {
				$session->update($payload);
			} else {
				Session::create($payload);
			}
			return true;
		} catch (Throwable $exception) {
			Log::record($exception);
			return false;
		}
	}

	public function destroy($id)
	{
		$session = Session::find($id);

		if ($session) {
			$session->delete();
		}

		return true;
	}

	public function gc($maxlifetime)
	{
		Session::getAll()->each(function (Session $session) use ($maxlifetime) {
			if ($session->last_activity + $maxlifetime < time()) {
				$session->delete();
			}
		});


		return true;
	}
}
