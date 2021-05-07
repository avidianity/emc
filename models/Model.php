<?php

namespace Models;

use Exceptions\NotFoundException;
use Interfaces\Arrayable;
use Interfaces\HasRelationships;
use Interfaces\JSONable;
use Libraries\Collection;
use Libraries\Database;
use stdClass;
use Traits\HasEvents;
use Traits\HasRelations;
use Traits\Macroable;

abstract class Model implements JSONable, Arrayable
{
	use HasRelations, HasEvents, Macroable;

	/**
	 * Attributes that are serialized
	 * 
	 * @var array
	 */
	protected $casts = [];

	/**
	 * Current data associated with this model
	 * 
	 * @var array
	 */
	protected $data = [];

	/**
	 * Properties that can be mass-assigned
	 * 
	 * @var array
	 */
	protected $fillable = [];

	/**
	 * Properties that should be hidden when serialized.
	 * 
	 * @var array
	 */
	protected $hidden = [];

	/**
	 * The model's table name. It will be inferred if its null
	 * 
	 * @var null|string
	 */
	protected static $table = null;

	/**
	 * Current database connection used
	 * 
	 * @var \Interfaces\Database\Connection\Connection
	 */
	protected static $pdo = null;

	/**
	 * Indicates if model is newly created
	 * @var bool
	 */
	protected $fresh = false;

	/**
	 * Whether the model has timestamps.
	 * @var bool
	 */
	protected $timestamps = true;

	/**
	 * Boolean attributes of the model
	 * @var string[]
	 */
	protected $booleans = [];

	/**
	 * Attributes of the model that is cast in to JSON
	 * @var string[]
	 */
	protected $jsons = [];

	/**
	 * Create a new instance of the model and fill any data if any
	 * 
	 * @param mixed $data
	 */
	public function __construct($data = null)
	{
		if ($data !== null) {
			$this->fill($data);
		}
		$this->boot();
		$this->events();
	}

	/**
	 * Boot the model
	 * 
	 * @return void
	 */
	protected function boot()
	{

		collect($this->booleans)->each(function (string $key) {
			static::serializing(function ($model) use ($key) {
				$value = $model->{$key};
				$model->{$key} = $value ? true : false;
			});
		});

		collect($this->jsons)->each(function (string $key) {
			static::serializing(function ($model) use ($key) {
				$value = $model->{$key};
				if (is_string($value)) {
					$model->{$key} = json_decode($value);
				}
			});
		});
	}

	/**
	 * Get boolean attributes
	 * 
	 * @return string[]
	 */
	public function getBooleans()
	{
		return $this->booleans;
	}

	/**
	 * Get json attributes
	 * 
	 * @return string[]
	 */
	public function getJsons()
	{
		return $this->jsons;
	}
	/**
	 * Magically set a value into the data
	 * 
	 * @param string $key
	 * @param mixed $value
	 * @return void
	 */
	public function __set($key, $value)
	{
		$this->data[$key] = $value;
	}

	/**
	 * Magically get a value from the data
	 * 
	 * @param string $key
	 * @return mixed
	 */
	public function __get($key)
	{
		if (in_array($key, array_keys($this->data))) {
			$value = $this->data[$key];
			if (array_key_exists($key, $this->booleans)) {
				return $value ? true : false;
			}
			if (array_key_exists($key, $this->jsons)) {
				return json_decode($value);
			}
			return $value;
		}
		if (in_array($key, array_keys($this->relationships))) {
			return $this->relationships[$key];
		}
		if (method_exists($this, $key)) {
			$result = $this->{$key}();
			if ($result instanceof HasRelationships) {
				$this->load([$key]);
				return $this->relationships[$key];
			}
		}
		return null;
	}

	/**
	 * Cast value if any cast exists
	 * 
	 * @param string $key
	 * @param string $value
	 * @param string $type
	 */
	protected function cast($key, $value, $type)
	{
		//
	}

	/**
	 * Mass-assign values into the the data
	 * 
	 * @param mixed|array $data
	 * @return static
	 */
	public function fill($data)
	{
		return $this->forceFill(only($data, $this->fillable));
	}

	/**
	 * Force mass-assign values by ignoring the fillable array
	 * 
	 * @param mixed|array $data
	 * @return static
	 */
	public function forceFill($data)
	{
		foreach ($data as $key => $value) {
			$this->data[$key] = $value;
		}
		return $this;
	}

	/**
	 * Get the model's table name
	 * 
	 * @return string
	 */
	public function getTable()
	{
		return static::table();
	}

	/**
	 * Get the model's table name
	 * 
	 * @return string
	 */
	public static function table()
	{
		if (!static::$table) {
			$split = explode('\\', get_class(new static()));
			return strtolower($split[count($split) - 1]);
		}

		return static::$table;
	}

	/**
	 * Make an unsaved instance of a model
	 * 
	 * @param array $attributes
	 * @return static
	 */
	public static function make($attributes)
	{
		return new static($attributes);
	}

	/**
	 * Serialize the model's data into an object
	 * 
	 * @return object
	 */
	public function toJSON(): object
	{
		$object = new stdClass();

		$data = $this->toArray();

		$dates = [];

		if (in_array('created_at', array_keys($data))) {
			$dates['created_at'] = $data['created_at'];
			unset($data['created_at']);
		}

		if (in_array('updated_at', array_keys($data))) {
			$dates['updated_at'] = $data['updated_at'];
			unset($data['updated_at']);
		}

		foreach ($data as $property => $value) {
			$object->{$property} = $value;
		}

		foreach ($dates as $key => $value) {
			$object->{$key} = $value;
		}

		return $object;
	}

	/**
	 * Serialize the model's data into an array
	 * 
	 * @return array
	 */
	public function toArray(): array
	{
		$data = except($this->data, $this->hidden);

		foreach ($this->relationships as $relation => $instance) {
			$data[$relation] = $instance;
		}

		foreach ($data as $key => $value) {
			if (in_array($key, $this->booleans)) {
				$data[$key] = $value ? true : false;
			}
			if (in_array($key, $this->jsons)) {
				if (is_string($value)) {
					$data[$key] = json_decode($value);
				}
			}
		}

		return $data;
	}

	/**
	 * Set the current connection
	 * 
	 * @param \Interfaces\Database\Connection\Connection $pdo
	 * @return void
	 */
	public static function setConnection($pdo)
	{
		static::$pdo = $pdo;
	}

	/**
	 * Get the current connection
	 * 
	 * @return \Interfaces\Database\Connection\Connection
	 */
	public static function getConnection()
	{
		return static::$pdo;
	}

	/**
	 * Get raw data of the current instance
	 * 
	 * @return mixed
	 */
	public function getData()
	{
		return $this->data;
	}

	/**
	 * Attaches the database name into the keys
	 * 
	 * @param string[] $keys
	 * @return string[]
	 */
	public static function justifyKeys($keys)
	{
		return collect($keys)->map(function ($key) {
			return static::justifyKey($key);
		})->toArray();
	}

	/**
	 * Attaches the database name into the key
	 * 
	 * @param string $key
	 * @return string
	 */
	public static function justifyKey($key)
	{
		return static::table() . '.' . $key;
	}

	/**
	 * Determines if the model has timestamps
	 * 
	 * @return bool
	 */
	public function hasTimestamps()
	{
		return $this->timestamps;
	}

	/**
	 * Create a new entry in the database
	 * 
	 * @param mixed $data
	 * @param bool $safe
	 * @return static
	 */
	public static function create($data, $safe = true)
	{
		$instance = new static();

		if ($safe === false) {
			$instance->forceFill($data);
		} else {
			$instance->fill($data);
		}

		$instance
			->fireEvent('creating')
			->fireEvent('saving');

		$data = $instance->getData();

		if ($instance->hasTimestamps()) {
			$data['created_at'] = date('Y-m-d H:i:s');
			$data['updated_at'] = date('Y-m-d H:i:s');
		}

		$table = $instance->getTable();

		$query  = 'INSERT INTO ' . $table . ' (';
		$query .= implode(', ', static::justifyKeys(array_keys($data))) . ') VALUES (';
		$query .= collect(array_keys($data))->map(function ($key) {
			return ':' . $key;
		})->join(',') . ');';

		$statement = static::$pdo->prepare($query);

		$inputs = [];

		$booleans = (new static())->getBooleans();
		$jsons = (new static())->getJsons();

		foreach ($data as $key => $value) {
			if (in_array($key, $booleans)) {
				$inputs[":{$key}"] = $value ? 1 : 0;
			} else if (in_array($key, $jsons)) {
				if (!is_string($value)) {
					$inputs[":{$key}"] = json_encode($value);
				}
			} else {
				$inputs[":{$key}"] = $value;
			}
		}

		$statement->execute($inputs);

		$id = static::$pdo->lastInsertId();

		$newInstance = static::find($id);

		if (!$newInstance && isset($data['id'])) {
			$newInstance = static::find($data['id']);
		}

		$newInstance->setFresh(true);

		$newInstance
			->fireEvent('created')
			->fireEvent('saved');

		return $newInstance;
	}

	/**
	 * Count rows from the database
	 * 
	 * @return int
	 */
	public static function count()
	{
		$pdo = static::getConnection();

		$query  = 'SELECT COUNT(*) as count FROM ' . static::table() . ';';

		$statement = $pdo->prepare($query);

		$statement->execute();

		$row = $statement->fetch();

		return $row->count;
	}

	/**
	 * Get current database name
	 * 
	 * @return string
	 */
	protected static function getDatabaseName()
	{
		$env = config('app.env');
		return config("database.$env.name");
	}

	/**
	 * Update current entry to the database
	 * 
	 * @param mixed $data
	 * @return static
	 */
	public function update($data = [])
	{
		$this->fill($data);

		$this
			->fireEvent('updating')
			->fireEvent('saving');

		$data = $this->data;
		$id = $data['id'];
		unset($data['id']);
		unset($data['created_at']);

		if ($this->hasTimestamps()) {
			$data['updated_at'] = date('Y-m-d H:i:s');
		}

		$table = $this->getTable();

		$query  = 'UPDATE ' . $table . ' SET ';

		$params = [];

		foreach (array_keys($data) as $key) {
			$params[] = static::justifyKey($key) . ' = :' . $key;
		}

		$query .= implode(', ', $params) . ' ';

		$query .= 'WHERE ' . static::justifyKey('id') . ' = :id;';

		$statement = static::$pdo->prepare($query);

		$inputs = [
			':id' => $id,
		];

		foreach ($data as $key => $value) {
			if (in_array($key, $this->booleans)) {
				$inputs[":{$key}"] = $value ? 1 : 0;
			} else if (in_array($key, $this->jsons)) {
				if (!is_string($value)) {
					$inputs[":{$key}"] = json_encode($value);
				}
			} else {
				$inputs[":{$key}"] = $value;
			}
		}

		$statement->execute($inputs);

		$instance = static::find($this->id);

		$this->forceFill($instance->getData());

		$this
			->fireEvent('updated')
			->fireEvent('saved');

		return $this;
	}

	/**
	 * Save the current instance into the database
	 * 
	 * @return static
	 */
	public function save()
	{
		if (in_array('id', array_keys($this->data))) {
			return $this->update();
		}
		$instance = static::create($this->data, false);
		return $this->forceFill($instance->getData());
	}

	/**
	 * Deletes the current instance from the database
	 * 
	 * @return static
	 */
	public function delete()
	{
		$this->fireEvent('deleting');

		$statement = static::$pdo->prepare('DELETE FROM ' . $this->getTable() . ' WHERE ' . static::justifyKey('id') . ' = :id;');

		$statement->execute([':id' => $this->id]);

		$this->fireEvent('deleted');

		return $this;
	}

	/**
	 * Deletes the instances or ids from the database
	 * 
	 * @param array|static[] $ids
	 * @return void
	 */
	public static function deleteMany($ids = [])
	{
		if (count($ids) === 0) {
			return;
		}
		$ids = collect($ids)->map(function ($entry) {
			if ($entry instanceof static) {
				return $entry->id;
			}
			return $entry;
		});

		$instances = static::find($ids);

		foreach ($instances as $instance) {
			$instance->fireEvent('deleting');
		}

		$query = 'DELETE FROM ' . static::table() . ' WHERE ' . static::justifyKey('id') . ' IN(' . collect($ids)->map(function () {
			return '?';
		})->join(',') . ');';
		$statement = static::$pdo->prepare($query);

		$statement->execute($ids);

		foreach ($instances as $instance) {
			$instance->fireEvent('deleted');
		}
	}

	/**
	 * Gets all rows from the database
	 * 
	 * @return \Libraries\Collection<int, static>
	 */
	public static function getAll()
	{
		$statement = static::$pdo->query('SELECT * FROM ' . static::table() . ';');

		return collect($statement->fetchAll())->map(function ($row) {
			return static::from($row);
		});
	}

	/**
	 * Finds an id or ids in the database
	 * 
	 * @param int|int[] $ids
	 * @return static|\Libraries\Collection|null
	 */
	public static function find($ids = [])
	{
		if (is_array($ids) && count($ids) === 0) {
			return [];
		}
		$single = false;
		if (!is_array($ids)) {
			$single = true;
			$ids = [$ids];
		}

		$query  = 'SELECT * FROM ' . static::table() . ' ';
		$query .= 'WHERE ' . static::justifyKey('id') . ' IN (' . collect($ids)->map(function () {
			return '?';
		})->join(',') . ');';

		$statement = static::$pdo->prepare($query);

		$statement->execute($ids);

		if ($statement->rowCount() === 0 && $single) {
			return null;
		}

		$result = $statement->fetchAll();

		if ($single) {
			return static::from($result[0]);
		}
		return collect($result)->map(function ($row) {
			return static::from($row);
		});
	}

	/**
	 * Get first row in the database.
	 * 
	 * @return static|null
	 */
	public static function first()
	{
		$statement = static::$pdo->query(sprintf('SELECT * FROM %s LIMIT 1;', static::table()));

		if ($statement->rowCount() === 0) {
			return null;
		}

		return static::from($statement->fetch());
	}

	/**
	 * Get last row in the database.
	 * 
	 * @return static|null
	 */
	public static function last()
	{
		$statement = static::$pdo->query(sprintf('SELECT * FROM %s ORDER BY %s DESC LIMIT 1;', static::table(), static::justifyKey('id')));

		if ($statement->rowCount() === 0) {
			return null;
		}

		return static::from($statement->fetch());
	}

	/**
	 * Finds an id or ids in the database
	 * 
	 * @param int|int[] $ids
	 * @return static|\Libraries\Collection
	 * @throws \Exceptions\NotFoundException if it does not exist
	 */
	public static function findOrFail($ids)
	{
		$results = static::find($ids);

		if ($results === null || ((is_array($results) || $results instanceof Collection) && count($results) === 0)) {
			throw new NotFoundException('Model does not exist.');
		}

		return $results;
	}

	/**
	 * Make a new instance from a database row
	 * 
	 * @param mixed $data
	 * @return static
	 */
	public static function from($data)
	{
		return (new static())->forceFill($data);
	}

	/**
	 * Specify data which should be encoded into JSON
	 * 
	 * @return object
	 */
	public function jsonSerialize()
	{
		$this->fireEvent('serializing');
		return $this->toJSON();
	}

	/**
	 * Check if model is fresh
	 * 
	 * @return bool
	 */
	public function isFresh()
	{
		return $this->fresh;
	}

	/**
	 * Indicate current freshness of instance
	 * 
	 * @param bool $fresh
	 * @return static
	 */
	public function setFresh($fresh)
	{
		$this->fresh = $fresh;

		return $this;
	}
}
