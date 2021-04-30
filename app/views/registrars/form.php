<?php

use Libraries\Str;

extend('dashboard.layouts.top') ?>
<div class="container-fluid">
	<div class="row justify-content-center">
		<div class="col-12">
			<h2 class="page-title"><?= $mode ?> Registrar</h2>
			<form id='registrar-form' action="<?= url('dashboard/registrars') ?>" method="<?= $mode === 'Add' ? 'POST' : 'PUT' ?>">
				<?php if ($mode === 'Edit') : ?>
					<input type="text" class="d-none" name="id" value="<?= $this->id ?>">
				<?php endif; ?>
				<div class="row">
					<div class="col-12 col-md-6">
						<div class="card shadow h-100">
							<div class="card-body">
								<div class="form-group">
									<label for="first_name" class="col-form-label">First Name</label>
									<input data-uppercase type="text" class="form-control" id="first_name" name="first_name" value="<?= $this->first_name ?>" required="">
								</div>
								<div class="form-group">
									<label for="last_name" class="col-form-label">Last Name</label>
									<input data-uppercase type="text" class="form-control" id="last_name" name="last_name" value="<?= $this->last_name ?>" required="">
								</div>
								<div class="form-group">
									<label for="gender" class="col-form-label">Gender</label>
									<select name="gender" id="gender" class="form-control">
										<option> -- Select -- </option>
										<option value="Male" <?= $this->gender === 'Male' ? 'selected' : '' ?>>Male</option>
										<option value="Female" <?= $this->gender === 'Female' ? 'selected' : '' ?>>Female</option>
									</select>
								</div>
								<div class="form-group mt-4">
									<label for="birthday">Birthday</label>
									<input data-flatpickr type="text" name="birthday" id="birthday" class="form-control" value="<?= $this->birthday ?>" required="">
								</div>
							</div>
						</div>
					</div>
					<div class="col-12 col-md-6">
						<div class="card shadow h-100">
							<div class="card-body">
								<div class="form-group">
									<label for="username" class="col-form-label">Registrar Number</label>
									<input type="text" class="form-control" id="username" name="uuid" <?= $this->id ? 'disabled' : '' ?> value="<?= $this->uuid ? $this->uuid : 'registrar-' . Str::random(5) . '-' . date('Y') ?>" required="">
								</div>
								<div class="form-group">
									<label for="email" class="col-form-label">Email Address</label>
									<input type="email" class="form-control" id="email" name="email" value="<?= $this->email ?>" required="">
								</div>
								<div class="form-group">
									<label for="phone_number" class="col-form-label">Phone Number</label>
									<input data-phone-number type="text" class="form-control" id="phone_number" name="number" value="<?= $this->number ?>" required="">
								</div>
								<div class="form-group">
									<label for="address" class="col-form-label">Address</label>
									<input type="text" class="form-control" id="address" name="address" value="<?= $this->address ?>" required="">
								</div>
							</div>
						</div>
					</div>
					<div class="col-12 mt-2">
						<div class="card shadow">
							<div class="card-body">
								<div class="row">
									<div class="col-12 d-flex">
										<p class="ml-auto">
											<i>Account credentials will be sent via email.</i>
										</p>
									</div>
									<div class="col-12 col-md-4">
										<a class="btn btn-secondary btn-block m-1" href="<?= url('dashboard/registrars/all') ?>">
											<span><i class="fe fe-arrow-left fe-16"></i></span>
											Return
										</a>
									</div>
									<div class="col-12 col-md-4 offset-md-4">
										<button type="submit" class="btn btn-primary btn-block m-1">
											<span><i class="fe fe-save fe-16"></i></span>
											<?= $mode === 'Add' ? 'Create New' : 'Update' ?> Registrar Account
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
<script src="<?= asset("app-js/registrars/form.js") ?>"></script>