<?php extend('layouts.header') ?>
<div class="">
	<div class="float-left">
		<a class="nav-link text-muted my-2" href="<?= url() ?>">
			<i class="fe fe-home fe-16"></i>
		</a>
	</div>
	<div class="float-right">
		<a class="nav-link text-muted my-2" href="#" id="modeSwitcher" data-mode="dark">
			<i class="fe fe-sun fe-16"></i>
		</a>
	</div>
</div>
<div class="wrapper vh-100">
	<div class="row align-items-center h-100">
		<form id="login-form" class="col-lg-4 col-md-4 col-12 col-sm-12 mx-auto text-center" action="<?= url('/api/auth/login') ?>" method="POST" accept-charset="utf-8" autocomplete="off">
			<a class="navbar-brand mx-auto mt-2 flex-fill text-center">
				<span class="avatar avatar-lg mt-2">
					<img src="<?= asset('assets/images/logo.jpg') ?>" alt="..." class="avatar-img rounded-circle" style="height: 100px; width: 100px;">
				</span>
			</a>
			<h1 class="h6 mb-3">Log In</h1>
			<div class="form-group">
				<label for="email" class="sr-only">Student No. / Teacher No. / Registrar No. /Email address</label>
				<input type="text" id="email" name="email" class="form-control form-control-lg" placeholder="Student No. / Teacher No. / Registrar No." required="" autofocus="">
			</div>
			<div class="form-group">
				<label for="password" class="sr-only">Password</label>
				<input type="password" id="password" name="password" class="form-control form-control-lg" placeholder="Password" required="">
			</div>
			<button class="btn btn-lg btn-primary btn-block" type="submit">Log In</button>
			<div class="mt-2">
				<br>
				<a href="<?= url('forgot-password') ?>">Forgot password?</a>
				<br>
				<a href="<?= url() ?>">Return to home page</a>
			</div>

			<p class="mt-5 mb-3 text-muted"> © 2021</p>
		</form>
	</div>
</div>
<script src="<?= asset('app-js/login.js') ?>"></script>
<?php extend('layouts.footer') ?>