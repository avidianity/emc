<?php extend('dashboard.layouts.top') ?>
<div class="container-fluid">
	<div class="row justify-content-center">
		<div class="col-12">
			<h2 class="page-title">Registrar List</h2>
			<div></div>
			<div class="mb-1">
				<div class="card shadow">
					<div class="card-body">
						<div class="d-flex">
							<button class="btn btn-info btn-sm d-flex align-items-center" id="table-registrars-refresh">
								Refresh
							</button>
							<a class="btn btn-primary btn-sm text-white ml-auto d-flex align-items-center" href="<?= url('dashboard/registrars/create') ?>">
								<i class="fe fe-plus fe-16 mr-1"></i>
								<span class="mt-1">
									Add Registrar
								</span>
							</a>
						</div>
					</div>
				</div>
			</div>
			<div class="card shadow">
				<div class="card-body table-responsive">
					<table id="table-registrars" class="table table-hover">
						<thead>
							<tr>
								<th>Registrar #</th>
								<th>Name</th>
								<th>Phone Number</th>
								<th>Email</th>
								<th>Address</th>
								<th>Gender</th>
								<th>Birthday</th>
								<th>Age</th>
								<th>Status</th>
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
<script src="<?= asset('app-js/registrars/all.js') ?>"></script>