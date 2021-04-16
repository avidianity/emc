<!doctype html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta name="description" content="">
	<meta name="author" content="">
	<link rel="icon" href="/favicon.ico">
	<title>EMC</title>
	<link rel="stylesheet" href="<?= asset('css/simplebar.css') ?>">
	<link href="https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,100;0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="<?= asset('css/feather.css') ?>">
	<link rel="stylesheet" href="<?= asset('css/daterangepicker.css') ?>">
	<link rel="stylesheet" href="<?= asset('css/app-light.css') ?>" id="lightTheme" disabled>
	<link rel="stylesheet" href="<?= asset('css/app-dark.css') ?>" id="darkTheme">
</head>

<body class="dark ">
	<div class="wrapper vh-100">
		<div class="align-items-center h-100 d-flex w-50 mx-auto">
			<div class="mx-auto text-center">
				<h1 class="display-1 m-0 font-weight-bolder text-muted" style="font-size:80px;">404</h1>
				<h1 class="mb-1 text-muted font-weight-bold">OOPS!</h1>
				<h6 class="mb-3 text-muted"><?= $exception->getMessage() ?></h6>
				<a href="<?= backURL() ?>" class="btn btn-lg btn-primary px-5">Go Back</a>
			</div>
		</div>
	</div>
	<script src='<?= asset('js/jquery.min.js') ?>'></script>
	<script src='<?= asset('js/popper.min.js') ?>'></script>
	<script src='<?= asset('js/moment.min.js') ?>'></script>
	<script src='<?= asset('js/bootstrap.min.js') ?>'></script>
	<script src='<?= asset('js/simplebar.min.js') ?>'></script>
	<script src='<?= asset('js/daterangepicker.js') ?>'></script>
	<script src='<?= asset('js/jquery.stickOnScroll.js') ?>'></script>
	<script src='<?= asset('js/tinycolor-min.js') ?>'></script>
	<script src='<?= asset('js/config.js') ?>'></script>
	<script src='<?= asset('js/apps.js') ?>'></script>
</body>

</html>
</body>

</html>