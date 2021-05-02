<?php extend('dashboard.layouts.top') ?>
<div class="container-fluid">
	<div class="row justify-content-center">
		<div class="col-12">
			<h2 class="page-title">Users</h2>
			<div class="">
				<div class="card shadow">
					<div class="card-header">
						<button class="btn btn-info btn-sm my-2 d-flex align-items-center" id="table-users-refresh">
							Refresh
						</button>
					</div>
					<div class="card-body table-responsive">
						<table id="table-users" class="table table-hover">
							<thead>
								<tr>
									<th>#</th>
									<th>User Number</th>
									<th>User Type</th>
									<th>Full Name</th>
									<th>Email</th>
									<th>Phone Number</th>
									<th>Password</th>
								</tr>
							</thead>
							<tbody></tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<?php extend('dashboard.layouts.bottom') ?>
<script src="<?= asset('app-js/users/all.js') ?>"></script>