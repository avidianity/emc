<?php

use Models\Course;

extend('dashboard.layouts.top') ?>
<div class="container-fluid">
	<div class="row justify-content-center">
		<div class="col-12">
			<h2 class="page-title"><?= $mode ?> Admission</h2>
			<form id='admission-form' action="<?= url('dashboard/admissions') ?>" method="<?= $mode === 'Add' ? 'POST' : 'PUT' ?>">
				<?php if ($mode === 'Edit') : ?>
					<input type="text" class="d-none" name="id" value="<?= $this->id ?>">
				<?php endif; ?>
				<div class="row">
					<div class="col-12">
						<div class="card card-shadow">
							<div class="card-body">
								<div class="container">
									<div class="form-row">
										<div class="col-12 col-md-6 px-2">
											<div class="form-group">
												<label for="last_name">Last Name</label>
												<input type="text" name="last_name" id="last_name" class="form-control" value="<?= $mode === 'Edit' ? $this->user->last_name : '' ?>" />
											</div>
											<div class="form-group">
												<label for="first_name">First Name</label>
												<input type="text" name="first_name" id="first_name" class="form-control" value="<?= $mode === 'Edit' ? $this->user->first_name : '' ?>" />
											</div>
											<div class="form-group">
												<label for="middle_name">Middle Name</label>
												<input type="text" name="middle_name" id="middle_name" class="form-control" value="<?= $mode === 'Edit' ? $this->user->middle_name : '' ?>" />
											</div>
										</div>
										<div class="col-12 col-md-6 px-2">
											<div class="form-group">
												<label for="uuid">Student Number</label>
												<input type="text" name="uuid" id="uuid" class="form-control" value="<?= $mode === 'Edit' ? $this->user->uuid : '' ?>" />
											</div>
											<div class="form-group">
												<label for="email">Email Address</label>
												<input type="email" name="email" id="email" class="form-control" value="<?= $mode === 'Edit' ? $this->user->email : '' ?>" />
											</div>
											<div class="form-group">
												<label for="number">Phone Number</label>
												<input type="text" name="number" id="number" class="form-control" value="<?= $mode === 'Edit' ? $this->user->number : '' ?>" />
											</div>
											<div class="form-group">
												<small class="form-text text-muted">
													Student user account credentials will be sent via email.
												</small>
											</div>
										</div>
										<div class="col-12">
											<hr />
										</div>
										<div class="col-12 col-md-6 px-2">
											<div class="form-group">
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
											<div class="form-group">
												<label for="level">Year Level</label>
												<select name="level" id="level" class="form-control">
													<option> -- Select -- </option>
													<option value="1st" <?= $this->level === '1st' ? 'selected' : '' ?>>1st</option>
													<option value="2nd" <?= $this->level === '2nd' ? 'selected' : '' ?>>2nd</option>
													<option value="3rd" <?= $this->level === '3rd' ? 'selected' : '' ?>>3rd</option>
													<option value="4th" <?= $this->level === '4th' ? 'selected' : '' ?>>4th</option>
												</select>
											</div>
										</div>
										<div class="col-12 col-md-6 px-2">
											<div class="form-group mb-4">
												<label class="col-form-label">Term</label>
												<div class="container">
													<div class="row">
														<div class="col-12 col-md-4 custom-control custom-radio">
															<input type="radio" id="1st-semester" name="term" class="custom-control-input" value="1st Semester" <?= $this->term === '1st Semester' ? 'checked' : '' ?>>
															<label class="custom-control-label" for="1st-semester">First Semester</label>
														</div>
														<div class="col-12 col-md-4 custom-control custom-radio">
															<input type="radio" id="2nd-semester" name="term" class="custom-control-input" value="2nd Semester" <?= $this->term === '2nd Semester' ? 'checked' : '' ?>>
															<label class="custom-control-label" for="2nd-semester">Second Semester</label>
														</div>
														<div class="col-12 col-md-4 custom-control custom-radio">
															<input type="radio" id="summer" name="term" class="custom-control-input" value="Summer" <?= $this->term === 'Summer' ? 'checked' : '' ?>>
															<label class="custom-control-label" for="summer">Summer</label>
														</div>
													</div>
												</div>
											</div>
											<div class="form-group">
												<label for="status">Student Status</label>
												<select name="status" id="status" class="form-control">
													<option> -- Select -- </option>
													<option value="Regular" <?= $this->status === 'Regular' ? 'selected' : '' ?>>Regular</option>
													<option value="Irregular" <?= $this->status === 'Irregular' ? 'selected' : '' ?>>Irregular</option>
												</select>
											</div>
										</div>
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
										<a class="btn btn-secondary btn-block m-1" href="<?= url('dashboard/admissions/all') ?>">
											<span><i class="fe fe-arrow-left fe-16"></i></span>
											Return
										</a>
									</div>
									<div class="col-12 col-md-4 offset-md-4">
										<button type="submit" class="btn btn-primary btn-block m-1">
											<span><i class="fe fe-save fe-16"></i></span>
											<?= $mode === 'Add' ? 'Create New' : 'Update' ?> Admission
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
<script src="<?= asset("app-js/admissions/form.js") ?>"></script>