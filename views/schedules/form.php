<?php

use Models\Course;
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
									<div class="form-group col-12 col-md-6 col-xl-4">
										<label for="course_id">Course</label>
										<select name="course_id" id="course_id" class="form-control">
											<option> -- Select -- </option>
											<?php $courses->each(function (Course $course) { ?>
												<option value="<?= $course->id ?>" <?= $this->course_id === $course->id ? 'selected' : '' ?>>
													<?= $course->code ?>
												</option>
											<?php }); ?>
										</select>
									</div>
									<div class="form-group col-12 col-md-6 col-xl-4">
										<label for="teacher_id">Teacher</label>
										<select name="teacher_id" id="teacher_id" class="form-control">
											<option> -- Select -- </option>
											<?php $teachers->each(function (User $teacher) { ?>
												<option value="<?= $teacher->id ?>" <?= $this->teacher_id === $teacher->id ? 'selected' : '' ?>>
													<?= $teacher->last_name ?>, <?= $teacher->first_name ?> <?= $teacher->middle_name ?>
												</option>
											<?php }); ?>
										</select>
									</div>
									<div class="form-group col-12 col-xl-4">
										<label for="year">Year Level</label>
										<select name="year" id="year" class="form-control">
											<option> -- Select -- </option>
											<option value="1st" <?= $this->year === '1st' ? 'selected' : '' ?>>1st</option>
											<option value="2nd" <?= $this->year === '2nd' ? 'selected' : '' ?>>2nd</option>
											<option value="3rd" <?= $this->year === '3rd' ? 'selected' : '' ?>>3rd</option>
											<option value="4th" <?= $this->year === '4th' ? 'selected' : '' ?>>4th</option>
										</select>
									</div>
									<div class="col-12 pt-3 table-responsive">
										<div class="d-flex mb-3">
											<button id="schedule-add-row" class="btn btn-info btn-sm">
												Add Row
											</button>
										</div>
										<table id="schedules-table" class="table">
											<thead>
												<tr>
													<th>Time</th>
													<th>Monday</th>
													<th>Tuesday</th>
													<th>Wednesday</th>
													<th>Thursday</th>
													<th></th>
												</tr>
											</thead>
											<tbody>
												<?php if ($this->payload) : ?>
													<?php collect($this->payload)->each(function ($row, $index) { ?>
														<tr>
															<?php foreach ($row as $key => $value) : ?>
																<td>
																	<input type="text" name="payload[<?= $index ?>][<?= $key ?>]" class="form-control" value="<?= $value ?>">
																</td>
															<?php endforeach; ?>
															<td>
																<button class='btn btn-danger btn-sm btn-row-remove'>Remove</button>
															</td>
														</tr>
													<?php }); ?>
												<?php endif; ?>
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