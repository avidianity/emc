<?php

namespace Controllers;

use Libraries\Hash;
use Libraries\Log;
use Libraries\Str;
use Models\Admission;
use Models\Course;
use Models\Subject;
use Models\User;
use Queues\SendMail;
use Throwable;

class AdmissionController extends Controller
{
	public function increment()
	{
		/**
		 * @var \Models\User
		 */
		$user = session()->get('user');

		$isPassingGrades = true;

		foreach ($user->grades as $grade) {
			if ($grade->grade < 65) {
				$isPassingGrades = false;
			}
		}

		if (!$isPassingGrades) {
			return response(['message' => 'There are subjects that do not have passing grades.'], 400);
		}

		$map = [
			'1st Semester' => [
				'1st' => ['1st', '2nd Semester'],
				'2nd' => ['2nd', '2nd Semester'],
				'3rd' => ['3rd', '2nd Semester'],
				'4th' => ['4th', '2nd Semester'],
				'5th' => ['5th', '2nd Semester'],
			],
			'2nd Semester' => [
				'1st' => ['2nd', '1st Semester'],
				'2nd' => ['3rd', '1st Semester'],
				'3rd' => ['3rd', 'Summer'],
				'4th' => ['5th', '1st Semester'],
			],
			'Summer' => [
				'3rd' => ['4th', '1st Semester'],
			]
		];

		/**
		 * @var \Models\Admission
		 */
		$admission = $user->admission;

		if (isset($map[$admission->term]) && isset($map[$admission->term][$admission->level])) {
			[$level, $term] = $map[$admission->term][$admission->level];

			$admission->update(['level' => $level, 'term' => $term]);
			$user->update(['active' => false]);
			$user->subjects()->delete();
			foreach (input()->get('subjects', []) as $id) {
				$user->subjects()->create(['subject_id' => $id]);
			}
			session()->clear();
			return response('', 204);
		}
	}

	public function index()
	{
		return Admission::getAll()->load(['user']);
	}

	public function all()
	{
		return view('admissions.all');
	}

	public function show()
	{
		$id = input()->id;

		return Admission::findOrFail($id);
	}

	public function view()
	{
		return view('admissions.view');
	}

	public function store()
	{
		$data = input()->all();

		if (!session()->has('schedule-save')) {
			$students = find(User::class, only($data, ['first_name', 'last_name']) + ['role' => 'Student']);
			if ($students->count() > 0) {
				$admissions = find(
					Admission::class,
					only($data, ['level', 'course_code', 'term', 'status']) + [
						'user_id' => $students->first()->id,
					]
				);

				if ($admissions->count() > 0) {
					session()->set('schedule-save', true);
					return response(['message' => 'Data is already existing. Please save again to confirm.'], 409);
				}
			}
		} else {
			session()->remove('schedule-save');
		}

		$password = Str::random(5);

		$data['role'] = 'Student';
		$data['password'] = Hash::make($password);
		$data['password_unsafe'] = $password;
		$data['active'] = false;

		try {
			$student = User::create($data);

			if ($data['level'] === '1st' && empty(input()->get('subjects', []))) {
				foreach (find(Subject::class, only($data, ['course_code'])) as $subject) {
					$student->subjects()->create(['subject_id' => $subject->id]);
				}
			} else {
				foreach (input()->get('subjects', []) as $id) {
					$student->subjects()->create(['subject_id' => $id]);
				}
			}
		} catch (Throwable $exception) {
			Log::record($exception);
			return response(['message' => 'Student already exists.', 'exception' => $exception], 404);
		}

		$subject = "Student Admission Credentials | EMC Online";

		$admission = $student->admission()->create($data);

		$queue = new SendMail($student->email, 'emails.admission', $subject, [
			'name' => $student->first_name,
			'number' => $student->uuid,
			'password' => $password,
			'course_code' => $admission->course_code,
			'term' => $admission->term,
			'level' => $admission->level,
			'registrar_name' => session()->get('user')->getFullName(),
		]);

		queue()->register($queue);

		return $admission;
	}

	public function create()
	{
		$courses = Course::getAll();
		return view('admissions.form', ['mode' => 'Add', 'courses' => $courses]);
	}

	public function update()
	{
		$id = input()->id;

		$admission = Admission::findOrFail($id);

		$data = input()->all();

		$admission->update($data);
		$admission->user->update($data);

		if (isset($data['subjects'])) {
			$admission->user->subjects()->delete();

			foreach ($data['subjects'] as $id) {
				$admission->user->subjects()->create(['subject_id' => $id]);
			}
		}

		return $admission;
	}

	public function edit()
	{
		$id = input()->id;

		$admission = Admission::findOrFail($id);

		$admission->load(['user']);

		$admission->user->load(['subjects']);

		$courses = Course::getAll();

		return view('admissions.form', ['mode' => 'Edit', 'courses' => $courses] + $admission->toArray());
	}

	public function destroy()
	{
		$id = input()->id;

		$admission = Admission::findOrFail($id);

		$admission->delete();

		return response('', 204);
	}
}
