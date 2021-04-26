<div class="container <?= session()->get('user')->role === 'Student' ? 'd-none' : '' ?>">
	<div class="row">
		<div class="col-12 col-md-6 col-xl-3">
			<div class="card shadow">
				<div class="card-body">
					<div class="row align-items-center">
						<div class="col-3 text-center">
							<span class="circle circle-sm bg-primary-light">
								<i class="fe fe-16 fe-users mb-0"></i>
							</span>
						</div>
						<div class="col pr-0">
							<p class="small text-light mb-0">Old Students</p>
							<span class="h3 mb-0" id="old-students">0</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="col-12 col-md-6 col-xl-3">
			<div class="card shadow">
				<div class="card-body">
					<div class="row align-items-center">
						<div class="col-3 text-center">
							<span class="circle circle-sm bg-primary-light">
								<i class="fe fe-16 fe-users mb-0"></i>
							</span>
						</div>
						<div class="col pr-0">
							<p class="small text-light mb-0">New Students</p>
							<span class="h3 mb-0" id="new-students">0</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="col-12 col-md-6 col-xl-3">
			<div class="card shadow">
				<div class="card-body">
					<div class="row align-items-center">
						<div class="col-3 text-center">
							<span class="circle circle-sm bg-primary-light">
								<i class="fe fe-16 fe-users mb-0"></i>
							</span>
						</div>
						<div class="col pr-0">
							<p class="small text-light mb-0">Male Students</p>
							<span class="h3 mb-0" id="male-students">0</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="col-12 col-md-6 col-xl-3">
			<div class="card shadow">
				<div class="card-body">
					<div class="row align-items-center">
						<div class="col-3 text-center">
							<span class="circle circle-sm bg-primary-light">
								<i class="fe fe-16 fe-users mb-0"></i>
							</span>
						</div>
						<div class="col pr-0">
							<p class="small text-light mb-0">Female Students</p>
							<span class="h3 mb-0" id="female-students">0</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<?php if (session()->get('user')->role === 'Registrar') : ?>
			<div class="col-12 col-md-6 mt-5">
				<div class="card shadow">
					<div class="card-body">
						<div class="row align-items-center">
							<div class="col-3 text-center">
								<span class="circle circle-sm bg-primary-light">
									<i class="fe fe-16 fe-users mb-0"></i>
								</span>
							</div>
							<div class="col pr-0">
								<p class="small text-light mb-0">Pending Enrollees</p>
								<span class="h3 mb-0" id="pending-enrollees">0</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-12 col-md-6 mt-5">
				<div class="card shadow">
					<div class="card-body">
						<div class="row align-items-center">
							<div class="col-3 text-center">
								<span class="circle circle-sm bg-primary-light">
									<i class="fe fe-16 fe-users mb-0"></i>
								</span>
							</div>
							<div class="col pr-0">
								<p class="small text-light mb-0">Graduates</p>
								<span class="h3 mb-0" id="graduates">0</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		<?php endif; ?>
		<div class="col-12">
			<div class="container mt-5">
				<div class="card shadow">
					<div class="card-header">
						<h4 class="card-title">Students per Course</h4>
					</div>
					<div class="card-body table-responsive">
						<table id="analytics-courses-table" class="table table-hover">
							<thead>
								<tr>
									<th>Code</th>
									<th>Description</th>
									<th>Students</th>
									<th>Status</th>
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
<script src="<?= asset('app-js/analytics.js') ?>"></script>