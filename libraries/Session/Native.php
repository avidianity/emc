<?php

namespace Libraries\Session;

use Interfaces\SessionManager;
use Interfaces\Singleton as SingletonContract;
use Traits\Singleton;

class Native implements SessionManager, SingletonContract
{
    use Singleton;

    public function __construct()
    {
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
