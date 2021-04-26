<?php

namespace Relations;

use Interfaces\HasRelationships;
use LogicException;
use Models\Model;

class MorphMany implements HasRelationships
{
	protected $class;
	protected $morphable;

	/**
	 * @var Model
	 */
	protected $instance;

	public function __construct($class, $morphable, Model &$instance)
	{
		$this->class = $class;
		$this->morphable = $morphable;
		$this->instance = $instance;
	}

	protected function getChildTable()
	{
		$class = $this->class;
		return (new $class())->getTable();
	}

	public function get()
	{
		$pdo = Model::getConnection();

		$type = $this->morphable . '_type';
		$key = $this->morphable . '_id';

		$query  = 'SELECT * FROM ' . $this->getChildTable() . ' ';
		$query .= "WHERE {$type} = :{$type} ";
		$query .= "AND {$key} = :{$key};";

		$statement = $pdo->prepare($query);

		$statement->execute([
			":{$type}" => get_class($this->instance),
			":{$key}" => $this->instance->id,
		]);

		if ($statement->rowCount() === 0) {
			return collect();
		}

		$class = $this->class;

		return collect($statement->fetchAll())->map(function ($row) use ($class) {
			return $class::from($row);
		});
	}

	public function count()
	{
		$pdo = Model::getConnection();

		$type = $this->morphable . '_type';
		$key = $this->morphable . '_id';

		$query  = 'SELECT * FROM ' . $this->getChildTable() . ' ';
		$query .= "WHERE {$type} = :{$type} ";
		$query .= "AND {$key} = :{$key};";

		$statement = $pdo->prepare($query);

		$statement->execute([
			":{$type}" => get_class($this->instance),
			":{$key}" => $this->instance->id,
		]);

		return $statement->rowCount();
	}

	public function create($data)
	{
		$data[$this->morphable . '_type'] = get_class($this->instance);
		$data[$this->morphable . '_id'] = $this->instance->id;

		$class = $this->class;

		return $class::create($data);
	}

	public function update($data)
	{
		return $this->get()->map(function ($row) use ($data) {
			return $row->update($data);
		});
	}

	public function delete()
	{
		return collect($this->get())->map(function ($row) {
			return $row->delete();
		});
	}

	public function has(): bool
	{
		return $this->get()->count() > 0;
	}
}
