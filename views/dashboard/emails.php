<?php extend('dashboard.layouts.top') ?>
<div class="container-fluid">
	<div class="row justify-content-center">
		<div class="col-12">
			<h2 class="page-title">Email Outbox</h2>
			<hr />
			<div class="">
				<div class="card shadow">
					<div class="card-header">
						<button class="btn btn-info btn-sm my-2 d-flex align-items-center" id="table-emails-refresh">
							Refresh
						</button>
					</div>
					<div class="card-body table-responsive">
						<table id="table-emails" class="table table-hover">
							<thead>
								<tr>
									<th>Created</th>
									<th>To</th>
									<th>Subject</th>
									<th>Status</th>
									<th>Sent</th>
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
</div>
<?php extend('dashboard.layouts.bottom') ?>
<script src="<?= asset('app-js/emails.js') ?>"></script>