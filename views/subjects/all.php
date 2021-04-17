<?php extend('dashboard.layouts.top') ?>
<div class="container-fluid">
	<div class="row justify-content-center">
		<div class="col-12">
			<h2 class="page-title">Subject List</h2>
			<div></div>
			<div class="mb-1">
				<div class="card shadow">
					<div class="card-body">
						<div class="d-flex">
							<button class="btn btn-info btn-sm d-flex align-items-center" id="table-subjects-refresh">
								Refresh
							</button>
							<a class="btn btn-primary btn-sm text-white ml-auto d-flex align-items-center" href="<?= url('dashboard/subjects/create') ?>">
								<i class="fe fe-plus fe-16 mr-1"></i>
								<span class="mt-1">
									Add Subject
								</span>
							</a>
						</div>
					</div>
				</div>
			</div>
			<div class="card shadow">
				<div class="card-body">
					<table id="table-subjects" class="table table-hover">
						<thead>
							<tr>
								<th>Subject Code</th>
								<th>Subject Description</th>
								<th>Course Code</th>
								<th>Year Level</th>
								<th>Selemester</th>
								<th>Units</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
<?php extend('dashboard.layouts.bottom') ?>
<script src="<?= asset('app-js/subjects/all.js') ?>"></script>