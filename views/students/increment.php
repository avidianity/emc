<?php

use Libraries\Str;
use Models\Subject;

extend('dashboard.layouts.top') ?>
<div class="container">
	<h4>Select Subjects</h4>
	<form id="increment-form" action="<?= url('dashboard/admissions/increment') ?>" method="POST" class="form-row">
		<?php session()->get('user')->admission->course->subjects->filter(function (Subject $subject) {
			$map = [
				'1st' => '2nd',
				'2nd' => '3rd',
				'3rd' => '4th',
				'4th' => '5th',
			];

			$level = session()->get('user')->admission->level;

			return isset($map[$level]) && $subject->level === $map[$level];
		})->each(function (Subject $subject, $index) {
			$id = Str::random(); ?>
			<div class="col-12 col-md-6 col-lg-4 col-xl-3 form-group">
				<div class="custom-control custom-checkbox">
					<input type="checkbox" class="custom-control-input" name="subjects[<?= $index ?>]" id="<?= $id ?>" value="<?= $subject->id ?>">
					<label class="custom-control-label" for="<?= $id ?>"><?= $subject->code ?></label>
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