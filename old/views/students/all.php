<?php extend('dashboard.layouts.top') ?>
<div class="container-fluid">
	<div class="row justify-content-center">
		<div class="col-12">
			<h2 class="page-title">Student List</h2>
			<div></div>
			<div class="mb-1">
				<div class="card shadow">
					<div class="card-body">
						<div class="d-flex">
							<button class="btn btn-info btn-sm d-flex align-items-center" id="table-students-refresh">
								Refresh
							</button>
						</div>
					</div>
				</div>
			</div>
			<div class="card shadow">
				<div class="card-body table-responsive">
					<table id="table-students" class="table table-hover">
						<thead>
							<tr>
								<th>ID Number</th>
								<th>Name</th>
								<th>Year</th>
								<th>Course</th>
								<th>Status</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody></tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="add-student-grade-modal" tabindex="-1" role="dialog">
	<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Add Grade</h5>
				<button type="button" class="close" data-dismiss="modal">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<form action="<?= url('/api/grades') ?>">
				<input type="text" id="student_id" name="student_id" class="d-none">
				<div class="modal-body">
					<div class="container">
						<div class="form-row">
							<div class="form-group col-12 col-md-6">
								<label for="student">Student</label>
								<input type="text" name="student" id="student" class="form-control" disabled>
							</div>
							<div class="form-group col-12 col-md-6">
								<label for="subject_id">Subject</label>
								<select name="subject_id" id="subject_id" class="form-control"></select>
							</div>
							<div class="form-group col-12">
								<label for="grade">Grade</label>
								<input type="number" name="grade" min="0" max="100" id="grade" class="form-control" value="65" required>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="submit" class="btn btn-info btn-sm">Submit</button>
					<button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>
				</div>
			</form>
		</div>
	</div>
</div>
<?php extend('dashboard.layouts.bottom') ?>
<script src="<?= asset('app-js/students/all.js') ?>"></script>