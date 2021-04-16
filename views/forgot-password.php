<?php extend('layouts.header') ?>
<div class="">
	<div class="float-left">
		<a class="nav-link text-muted my-2" href="<?= url() ?>">
			<i class="fe fe-home fe-16"></i>
		</a>
	</div>
	<div class="float-right">
		<a class="nav-link text-muted my-2" href="" id="modeSwitcher" data-mode="dark">
			<i class="fe fe-sun fe-16"></i>
		</a>
	</div>
</div>
<div class="wrapper vh-100">
	<div class="row align-items-center h-100">
		<form class="col-lg-3 col-md-4 col-12 col-sm-12 mx-auto text-center" action="<?= url('/api/auth/forgot-password') ?>" method="POST" accept-charset="utf-8" autocomplete="off">
			<a class="navbar-brand mx-auto mt-2 flex-fill text-center">
				<span class="avatar avatar-lg mt-2">
					<img src="<?= asset('assets/images/logo.jpg') ?>" alt="..." class="avatar-img rounded-circle">
				</span>
			</a>
			<h1 class="h6 mb-3">Forgot Password</h1>
			<div class="form-group">
				<label for="username" class="col-form-label">Student No. / Registrar No. / Teacher No.</label>
				<input type="text" class="form-control" id="username" name="username" value="" required="">
			</div>
			<div class="form-group">
				<label for="email" class="col-form-label">Email Address</label>
				<input type="email" class="form-control" id="email" name="email" value="" required="">
			</div>
			<hr>
			<button class="btn btn-md btn-primary btn-block" type="submit">Reset Password</button>
			<br>
			<a href="<?= url('login') ?>">Log In</a>
			<br>
			<a href="<?= url() ?>">Return to home page</a>
			<p class="mt-5 mb-3 text-muted text-center">EMC | Registration System © 2021</p>

		</form>
	</div>
</div>
<?php extend('layouts.footer') ?>