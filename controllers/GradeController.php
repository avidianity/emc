<?php

namespace Controllers;

use Models\Grade;

class GradeController extends Controller
{
	public function index()
	{
		return Grade::getAll()->load(['student', 'subject']);
	}

	public function show()
	{
		$id = input()->id;

		return Grade::findOrFail($id);
	}

	public function store()
	{
		$data = input()->all();

		$data['teacher_id'] = session()->get('user')->id;

		$pdo = Grade::getConnection();

		$query  = sprintf('SELECT * FROM %s WHERE %s = :student_id AND %s = :subject_id LIMIT 1;', Grade::table(), ...Grade::justifyKeys(['student_id', 'subject_id']));

		$statement = $pdo->prepare($query);

		$statement->execute([
			':student_id' => input()->student_id,
			':subject_id' => input()->subject_id,
		]);

		if ($statement->rowCount() > 0) {
			$grade = Grade::from($statement->fetch());

			$grade->update($data);
		} else {
			$grade = Grade::create($data);
		}

		return $grade;
	}

	public function update()
	{
		$id = input()->id;

		$grade = Grade::findOrFail($id);

		$data = input()->all();

		$data['teacher_id'] = session()->get('user')->id;

		$grade->update($data);

		return $grade;
	}

	public function destroy()
	{
		$id = input()->id;

		$grade = Grade::findOrFail($id);

		$grade->delete();

		return response('', 204);
	}

	public function self()
	{
		$pdo = Grade::getConnection();

		$subject_id = input()->subject_id;

		$query = sprintf('SELECT * FROM %s WHERE %s = :subject_id AND %s = :student_id LIMIT 1;', Grade::table(), ...Grade::justifyKeys(['subject_id', 'student_id']));

		$statement = $pdo->prepare($query);

		$statement->execute([
			':subject_id' => $subject_id,
			':student_id' => session()->get('user')->id,
		]);

		if ($statement->rowCount() > 0) {
			$grade = Grade::from($statement->fetch())->load(['subject', 'student', 'teacher']);
			$grade->student->load(['admission']);
			return $grade;
		}

		return null;
	}
}
