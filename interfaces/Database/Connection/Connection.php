<?php

namespace Interfaces\Database\Connection;

use Interfaces\Singleton;

interface Connection extends Singleton
{
	/**
	 * @return bool
	 */
	public function beginTransaction();

	/**
	 * @return bool
	 */
	public function commit();

	/**
	 * @return string
	 */
	public function errorCode();

	/**
	 * @return array
	 */
	public function errorInfo();

	/**
	 * 
	 * @param string $statement
	 * @return int
	 */
	public function exec(string $statement);

	/**
	 * 
	 * @param int $attribute
	 * @return mixed
	 */
	public function getAttribute(int $attribute);

	/**
	 * @return array
	 */
	public static function getAvailableDrivers();

	/**
	 * @return bool
	 */
	public function inTransaction();

	/**
	 * 
	 * @param string|null $name
	 * @return string
	 */
	public function lastInsertId(string $name = null);

	/**
	 * @param string $statement
	 * @param array $driver_options
	 * @return \PDOStatement
	 */
	public function prepare(string $statement, array $driver_options = array());

	/**
	 * 
	 * @param string $statement
	 * @return \PDOStatement
	 */
	public function query(string $statement);

	/**
	 * @param string $string
	 * @param int $parameter_type
	 * @return string
	 */
	public function quote(string $string, int $parameter_type = \PDO::PARAM_STR);

	/**
	 * @return bool
	 */
	public function rollBack();

	/**
	 * @param int $attribute
	 * @param mixed $value
	 * @return bool
	 */
	public function setAttribute(int $attribute, mixed $value);
}
