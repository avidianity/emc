<?php

use Libraries\Str;
use Models\Subject;

extend('dashboard.layouts.top') ?>
<div class="container">
	<div class="d-flex">
		<?php if (session()->get('user')->subjects->count() > 0) : ?>
			<a href="<?= url('registration-slip') ?>" class="btn btn-primary btn-sm" target="_blank" rel="noreferrer">
				Registration Slip
			</a>
		<?php endif; ?>
	</div>
	<h4>Select Subjects</h4>
	<form id="increment-form" action="<?= url('dashboard/admissions/increment') ?>" method="POST" class="form-row">
		<?php session()->get('user')->admission->course->subjects->filter(function (Subject $subject) {
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

			[$level, $term] = $map[session()->get('user')->admission->term][session()->get('user')->admission->level];

			return $subject->term === $term && $subject->level === $level;
		})->each(function (Subject $subject, $index) {
			$id = Str::random(); ?>
			<div class="col-12 form-group">
				<div class="custom-control custom-checkbox">
					<input type="checkbox" class="custom-control-input" name="subjects[<?= $index ?>]" id="<?= $id ?>" value="<?= $subject->id ?>">
					<label class="custom-control-label" for="<?= $id ?>"><?= $subject->code ?> - <?= $subject->description ?></label>
				</div>
			</div>
		<?php }); ?>
		<div class="col-12 pt-4">
			<button type="submit" class="btn btn-info btn-sm">
				Save
			</button>
		</div>
	</form>
</div>
<?php extend('dashboard.layouts.bottom') ?>
<script src="<?= asset('app-js/students/increment.js') ?>"></script>