<?php extend('dashboard.layouts.top') ?>
<div class="container-fluid">
	<div class="row justify-content-center">
		<div class="col-12">
			<form id="change-password-form" action="<?= url('api/auth/self') ?>" method="PUT">
				<div class="container pt-3">
					<div class="row">
						<div class="col-12 col-md-4 offset-md-4">
							<h2 class="page-title">Change Password</h2>
							<div class="form-group">
								<label for="current_password">Current Password:</label>
								<input type="password" id="current_password" class="form-control" name="current_password" value="" required="">
							</div>
							<div class="form-group">
								<label for="new_password">New Password:</label>
								<input type="password" id="new_password" class="form-control" name="new_password" value="" required="">
							</div>
							<button class="btn btn-lg btn-primary btn-block" type="submit">Change Password</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
<?php extend('dashboard.layouts.bottom') ?>
<script src="<?= asset('app-js/change-password.js') ?>"></script>