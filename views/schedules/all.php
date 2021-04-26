<?php extend('dashboard.layouts.top') ?>
<div class="container-fluid">
	<div class="row justify-content-center">
		<div class="col-12">
			<h2 class="page-title">Schedule List</h2>
			<div></div>
			<div class="mb-1">
				<div class="card shadow">
					<div class="card-body">
						<div class="d-flex">
							<button class="btn btn-info btn-sm d-flex align-items-center" id="table-schedules-refresh">
								Refresh
							</button>
							<?php if (session()->get('user')->role === 'Registrar') : ?>
								<a class="btn btn-primary btn-sm text-white ml-auto d-flex align-items-center" href="<?= url('dashboard/schedules/create') ?>">
									<i class="fe fe-plus fe-16 mr-1"></i>
									<span class="mt-1">
										Add Schedule
									</span>
								</a>
							<?php endif; ?>
						</div>
					</div>
				</div>
			</div>
			<div class="card shadow">
				<div class="card-body table-responsive">
					<table id="table-schedules" class="table table-hover">
						<thead>
							<tr>
								<th>Course</th>
								<th>Teacher</th>
								<th>Year</th>
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
<script src="<?= asset('app-js/schedules/all.js') ?>"></script>