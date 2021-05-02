<?php

use Models\Course;
use Models\Subject;
use Models\User;

extend('dashboard.layouts.top') ?>
<div class="container-fluid">
	<div class="row justify-content-center">
		<div class="col-12">
			<h2 class="page-title"><?= $mode ?> Schedule</h2>
			<form id='schedule-form' action="<?= url('dashboard/schedules') ?>" method="POST">
				<?php if ($mode === 'Edit') : ?>
					<input type="text" class="d-none" name="id" value="<?= $this->id ?>">
					<input type="text" name="_method" class="d-none" value="PUT">
				<?php endif; ?>
				<div class="row">
					<div class="col-12">
						<div class="card shadow">
							<div class="card-body">
								<div class="form-row">
									<div class="form-group col-12 col-md-6 col-xl-3">
										<label for="course_id">Course</label>
										<select name="course_id" id="course_id" class="form-control" required>
											<option> -- Select -- </option>
											<?php $courses->each(function (Course $course) { ?>
												<option value="<?= $course->id ?>" <?= $this->course_id === $course->id ? 'selected' : '' ?>>
													<?= $course->code ?>
												</option>
											<?php }); ?>
										</select>
									</div>
									<div class="form-group col-12 col-md-6 col-xl-3">
										<label for="teacher_id">Teacher</label>
										<select name="teacher_id" id="teacher_id" class="form-control" required>
											<option> -- Select -- </option>
											<?php $teachers->each(function (User $teacher) { ?>
												<option value="<?= $teacher->id ?>" <?= $this->teacher_id === $teacher->id ? 'selected' : '' ?>>
													<?= $teacher->last_name ?>, <?= $teacher->first_name ?> <?= $teacher->middle_name ?>
												</option>
											<?php }); ?>
										</select>
									</div>
									<div class="form-group col-12 col-md-6 col-xl-3">
										<label for="subject_id">Subject</label>
										<select name="subject_id" id="subject_id" class="form-control" required>
											<option> -- Select -- </option>
											<?php $subjects->each(function (Subject $subject) { ?>
												<option value="<?= $subject->id ?>" <?= $this->subject === $subject->id ? 'selected' : '' ?>>
													<?= $subject->code ?>
												</option>
											<?php }); ?>
										</select>
									</div>
									<div class="form-group col-12 col-xl-3">
										<label for="year">Year Level</label>
										<select name="year" id="year" class="form-control" required>
											<option> -- Select -- </option>
											<option value="1st" <?= $this->year === '1st' ? 'selected' : '' ?>>1st</option>
											<option value="2nd" <?= $this->year === '2nd' ? 'selected' : '' ?>>2nd</option>
											<option value="3rd" <?= $this->year === '3rd' ? 'selected' : '' ?>>3rd</option>
											<option value="4th" <?= $this->year === '4th' ? 'selected' : '' ?>>4th</option>
										</select>
									</div>
									<div class="col-12 pt-3 table-responsive">
										<table id="schedules-table" class="table">
											<thead>
												<tr>
													<th>Day</th>
													<th>Start Time</th>
													<th>End Time</th>
												</tr>
											</thead>
											<tbody>
												<?php foreach (['Monday', 'Tuesday', 'Wednesday', 'Thursday'] as $day) : ?>
													<tr>
														<td>
															<input type="text" class="form-control" disabled value="<?= $day ?>">
														</td>
														<td>
															<input data-flatpickr data-flatpickr-time type="text" class="form-control" name="payload[<?= $day ?>][start_time]" value="<?= $mode === 'Add' ? 'N/A' : $this->payload->{$day}->start_time ?>">
														</td>
														<td>
															<input data-flatpickr data-flatpickr-time type="text" class="form-control" name="payload[<?= $day ?>][end_time]" value="<?= $mode === 'Add' ? 'N/A' : $this->payload->{$day}->end_time ?>">
														</td>
													</tr>
												<?php endforeach; ?>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-12 mt-2">
						<div class="card shadow">
							<div class="card-body">
								<div class="row">
									<div class="col-12 col-md-4">
										<a class="btn btn-secondary btn-block m-1" href="<?= url('dashboard/schedules/all') ?>">
											<span><i class="fe fe-arrow-left fe-16"></i></span>
											Return
										</a>
									</div>
									<div class="col-12 col-md-4 offset-md-4">
										<button type="submit" class="btn btn-primary btn-block m-1">
											<span><i class="fe fe-save fe-16"></i></span>
											<?= $mode === 'Add' ? 'Create New' : 'Update' ?> Schedule
										</button>
									</div>
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
<script src="<?= asset("app-js/schedules/form.js") ?>"></script>