<?php extend('dashboard.layouts.top') ?>
<div class="container-fluid">
	<div class="row justify-content-center">
		<div class="col-12">
			<h2 class="page-title">College Course</h2>
			<form id="course-form" action="<?= url('dashboard/courses') ?>" method="<?= $mode === 'Add' ? 'POST' : 'PUT' ?>" class="card shadow">
				<?php if ($mode === 'Edit') : ?>
					<input type="text" class="d-none" name="id" value="<?= $this->id ?>">
				<?php endif; ?>
				<div class="card card-shadow">
					<div class="card-body">
						<h5 class="card-title"><?= $mode ?> Course</h5>
						<p class="card-text"></p>
						<div class="form-group">
							<label for="course_code" class="col-form-label">Course Code</label>
							<input type="text" class="form-control" id="course_code" name="code" value="<?= $this->code ?>" <?= $this->id ? 'disabled' : '' ?> required="">
							<small class="text-muted <?= $mode === 'Edit' ? 'd-none' : '' ?>">
								<i>Course code may not be editable in the future, be careful on your entry</i>
							</small>
						</div>
						<div class="form-group">
							<label for="course_description" class="col-form-label">Course Description</label>
							<textarea class="form-control" id="course_description" name="description" required=""><?= $this->description ?></textarea>
						</div>
						<div class="form-group">
							<div class="form-check">
								<label class="form-check-label" for="status">
									<input class="form-check-input" type="checkbox" name="open" id="status" <?= $this->open ? 'checked' : '' ?>>
									Open For Enrollment
								</label>
							</div>
						</div>
					</div>
					<div class="card-footer">
						<div class="row">
							<div class="col-12 col-md-4">
								<a class="btn mb-2 btn-secondary btn-block" href="<?= url('dashboard/courses/all') ?>">
									<span><i class="fe fe-arrow-left fe-16"></i></span>
									Course List
								</a>
							</div>
							<div class="col-12 col-md-4 offset-md-4">
								<button type="submit" class="btn mb-2 btn-primary btn-block">Save</button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
<?php extend('dashboard.layouts.bottom') ?>
<script src="<?= asset("app-js/courses/form.js") ?>"></script>