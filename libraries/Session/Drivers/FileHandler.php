<?php

namespace Libraries\Session\Drivers;

use SessionHandlerInterface;

class FileHandler implements SessionHandlerInterface
{
	protected $path;

	public function __construct()
	{
		$this->path = config('session.file.path');
	}

	public function open($path, $name)
	{
		$directory = $this->path . $path;
		if (!is_dir($directory)) {
			mkdir($directory, 0777);
		}

		return true;
	}

	public function close()
	{
		return true;
	}

	public function read($id)
	{
		return (string)@file_get_contents($this->path . DIRECTORY_SEPARATOR . "avidian_session_" . $this->sanitize($id));
	}

	public function write($id, $data)
	{
		return file_put_contents($this->path . DIRECTORY_SEPARATOR . "avidian_session_" . $this->sanitize($id), $data) === false ? false : true;
	}

	public function destroy($id)
	{
		$file = $this->path . DIRECTORY_SEPARATOR . "avidian_session_" . $this->sanitize($id);
		if (file_exists($file)) {
			unlink($file);
		}

		return true;
	}

	public function gc($maxlifetime)
	{
		foreach (glob($this->path . DIRECTORY_SEPARATOR . "avidian_session_*") as $file) {
			if (filemtime($file) + $maxlifetime < time() && file_exists($file)) {
				unlink($file);
			}
		}

		return true;
	}

	protected function sanitize($data)
	{
		return str_replace(DIRECTORY_SEPARATOR, '.', $data);
	}
}
