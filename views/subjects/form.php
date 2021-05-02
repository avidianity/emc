<?php

use Libraries\Str;
use Models\Course;

extend('dashboard.layouts.top') ?>
<div class="container-fluid">
	<div class="row justify-content-center">
		<div class="col-12">
			<h2 class="page-title"><?= $mode ?> Subject</h2>
			<form id='subject-form' action="<?= url('dashboard/subjects') ?>" method="<?= $mode === 'Add' ? 'POST' : 'PUT' ?>">
				<?php if ($mode === 'Edit') : ?>
					<input type="text" class="d-none" name="id" value="<?= $this->id ?>">
				<?php endif; ?>
				<div class="card card-shadow">
					<div class="card-body">
						<div class="row">
							<div class="form-group col-12 col-md-6">
								<label for="code">Subject Code</label>
								<input type="text" name="code" id="code" class="form-control" <?= $mode === 'Edit' ? 'disabled' : '' ?> value="<?= $this->code ?>">
							</div>
							<div class="form-group col-12 col-md-6">
								<label for="description">Description</label>
								<input type="text" name="description" id="description" class="form-control" value="<?= $this->course_code ?>">
							</div>
							<div class="form-group col-12 col-md-4">
								<label for="course_code">Course Code</label>
								<select name="course_code" id="course_code" class="form-control">
									<option> -- Select -- </option>
									<?php $courses->each(function (Course $course) { ?>
										<option value="<?= $course->code ?>" <?= $this->course_code === $course->code ? 'selected' : '' ?>>
											<?= $course->code ?>
										</option>
									<?php }); ?>
								</select>
							</div>
							<div class="form-group col-12 col-md-4">
								<label for="level">Year Level</label>
								<select name="level" id="level" class="form-control">
									<option> -- Select -- </option>
									<option value="1st" <?= $this->level === '1st' ? 'selected' : '' ?>>1st</option>
									<option value="2nd" <?= $this->level === '2nd' ? 'selected' : '' ?>>2nd</option>
									<option value="3rd" <?= $this->level === '3rd' ? 'selected' : '' ?>>3rd</option>
									<option value="4th" <?= $this->level === '4th' ? 'selected' : '' ?>>4th</option>
								</select>
							</div>
							<div class="form-group col-12 col-md-4">
								<label for="units">Number of Units</label>
								<select name="units" id="units" class="form-control">
									<option> -- Select -- </option>
									<?php for ($x = 1; $x <= 7; $x++) : ?>
										<option value="<?= $x ?>" <?= $this->units === "{$x}" ? 'selected' : '' ?>><?= $x ?></option>
									<?php endfor; ?>
								</select>
							</div>
							<div class="form-group col-12">
								<label class="col-form-label">Term</label>
								<div class="custom-control custom-radio">
									<input type="radio" id="1st-semester" name="term" class="custom-control-input" value="1st Semester" <?= $this->term === '1st Semester' ? 'checked' : '' ?>>
									<label class="custom-control-label" for="1st-semester">First Semester</label>
								</div>
								<div class="custom-control custom-radio">
									<input type="radio" id="2nd-semester" name="term" class="custom-control-input" value="2nd Semester" <?= $this->term === '2nd Semester' ? 'checked' : '' ?>>
									<label class="custom-control-label" for="2nd-semester">Second Semester</label>
								</div>
								<div class="custom-control custom-radio">
									<input type="radio" id="summer" name="term" class="custom-control-input" value="Summer" <?= $this->term === 'Summer' ? 'checked' : '' ?>>
									<label class="custom-control-label" for="summer">Summer</label>
								</div>
							</div>
							<div class="col-12 mt-2">
								<div class="row">
									<div class="col-12 col-md-4">
										<a class="btn btn-secondary btn-block m-1" href="<?= url('dashboard/subjects/all') ?>">
											<span><i class="fe fe-arrow-left fe-16"></i></span>
											Return
										</a>
									</div>
									<div class="col-12 col-md-4 offset-md-4">
										<button type="submit" class="btn btn-primary btn-block m-1">
											<span><i class="fe fe-save fe-16"></i></span>
											<?= $mode === 'Add' ? 'Create New' : 'Update' ?> Subject Account
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
			</form>
		</div>
	</div>
</div>
<?php extend('dashboard.layouts.bottom') ?>
<script src="<?= asset("app-js/subjects/form.js") ?>"></script>