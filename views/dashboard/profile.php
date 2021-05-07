<?php extend('dashboard.layouts.top') ?>
<div class="container">
	<div class="d-flex">
		<?php if (session()->get('user')->subjects->count() > 0) : ?>
			<a href="<?= url('registration-slip') ?>" class="btn btn-primary btn-sm" target="_blank" rel="noreferrer">
				Registration Slip
			</a>
		<?php endif; ?>
	</div>
	<form id="profile-form" action="<?= url('/dashboard/users?id=' . session()->get('user')->id) ?>" method="PUT" class="row">
		<div class="col-12 col-md-6">
			<div class="row">
				<div class="col-3 my-2">
					Student Number
				</div>
				<div class="col-9 my-2 d-flex align-items-center">
					<b><?= session()->get('user')->uuid ?></b>
				</div>
				<div class="col-3 my-2 d-flex align-items-center">
					Name
				</div>
				<div class="col-9 my-2 d-flex align-items-center">
					<b><?= session()->get('user')->last_name ?>, <?= session()->get('user')->first_name ?> <?= session()->get('user')->middle_name ?></b>
				</div>
				<div class="col-3 my-2 d-flex align-items-center">
					Gender
				</div>
				<div class="col-9 my-2 d-flex align-items-center">
					<b><?= session()->get('user')->gender ?></b>
				</div>
				<div class="col-3 my-2 d-flex align-items-center">
					Date of Birth
				</div>
				<div class="col-9 my-2 d-flex align-items-center">
					<b><?= DateTime::createFromFormat('Y-m-d', session()->get('user')->birthday)->format('F d, Y') ?></b>
				</div>
				<div class="col-3 my-2 d-flex align-items-center">
					Place of Birth
				</div>
				<div class="col-9 my-2 d-flex align-items-center">
					<input type="text" name="place_of_birth" value="<?= session()->get('user')->place_of_birth ?>" class="form-control">
				</div>
			</div>
		</div>
		<div class="col-12 col-md-6">
			<div class="row">
				<div class="col-3 my-2 d-flex align-items-center">
					Address
				</div>
				<div class="col-9 my-2 d-flex align-items-center">
					<input type="text" name="address" value="<?= session()->get('user')->address ?>" class="form-control">
				</div>
				<div class="col-3 my-2 d-flex align-items-center">
					Mobile Number
				</div>
				<div class="col-9 my-2 d-flex align-items-center">
					<input type="text" name="number" value="<?= session()->get('user')->number ?>" class="form-control">
				</div>
				<div class="col-3 my-2 d-flex align-items-center">
					Email Address
				</div>
				<div class="col-9 my-2 d-flex align-items-center">
					<input type="email" name="email" value="<?= session()->get('user')->email ?>" class="form-control">
				</div>
			</div>
		</div>
		<div class="col-12 text-center pt-5">
			<button type="submit" class="btn btn-info btn-sm">Save</button>
			<p class="my-3">
				<i>I hereby certify that all of the information provided are true and correct to the best of my knowledge.</i>
			</p>
		</div>
	</form>
</div>
<?php extend('dashboard.layouts.bottom') ?>
<script src="<?= asset('app-js/profile.js') ?>"></script>