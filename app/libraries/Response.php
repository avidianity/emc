<?php

namespace Libraries;

use Exception;
use Interfaces\Stringable;
use Models\Model;

class Response
{
	protected $data;
	protected $headers;
	protected $status;

	public function __construct($data = '', $status = 200, $headers = [])
	{
		$this->data = $data;
		$this->status = $status;
		$this->headers = $headers;
	}

	public function setStatus($status)
	{
		$this->status = $status;

		return $this;
	}

	public function send()
	{
		$result = $this->data;

		http_response_code($this->status);

		foreach ($this->headers as $header => $value) {
			setHeader($header, $value);
		}

		if ($result instanceof View) {
			$result->render();
			return;
		}

		if (is_string($result) || $result instanceof Stringable) {
			echo $result;
			return;
		}

		if ($this->expectsJson()) {
			if (!in_array('Content-Type', array_keys($this->headers))) {
				setHeader('Content-Type', 'application/json');
			}
			echo json_encode($result);
			return;
		}

		if ($result instanceof Model || is_array($result) || $result instanceof Collection || $result instanceof Exception || is_object($result)) {
			if (!in_array('Content-Type', array_keys($this->headers))) {
				setHeader('Content-Type', 'application/json');
			}
			echo json_encode($result);
			return;
		}
	}

	public function setHeader($key, $value)
	{
		$this->headers[$key] = $value;

		return $this;
	}

	protected function expectsJson()
	{
		if (getHeader('Accept') === 'application/json') {
			return true;
		}
		if (in_array('Content-Type', array_keys($this->headers)) && $this->headers['Content-Type'] === 'application/json') {
			return true;
		}
		return false;
	}
}
