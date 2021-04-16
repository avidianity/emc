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
				<h1 class="display-1 m-0 font-weight-bolder text-muted" style="font-size:80px;">500</h1>
				<h1 class="mb-1 text-muted font-weight-bold">OOPS!</h1>
				<h6 class="mb-3 text-muted">Something went wrong here.</h6>
				<a href="<?= backURL() ?>" class="btn btn-lg btn-primary px-5">Go Back</a>
				<?php if (config('app.debug') === true) : ?>
					<br />
					<button type="button" class="btn btn-info px-5 mt-3" data-toggle="modal" data-target="#stacktracemodal">
						View Stack Trace
					</button>
					<div class="modal fade" id="stacktracemodal" tabindex="-1" role="dialog" aria-labelledby="stacktracemodaltitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="stacktracemodaltitle">Stacktrace</h5>
									<button type="button" class="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body text-left">
									<p class="text-muted mt-3"><?= $exception->getMessage() ?></p>
									<hr />
									<h5>Trace:</h5>
									<?php foreach ($exception->getTrace() as $trace) : ?>
										<h6>File: <?= $trace['file'] ?></h6>
										<h6>Line: <?= $trace['line'] ?></h6>
										<h6>Function: <?= $trace['function'] ?></h6>
										<hr />
									<?php endforeach; ?>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
								</div>
							</div>
						</div>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</div>
	<script src="<?= asset('js/jquery.min.js') ?>"></script>
	<script src="<?= asset('js/popper.min.js') ?>"></script>
	<script src="<?= asset('js/moment.min.js') ?>"></script>
	<script src="<?= asset('js/bootstrap.min.js') ?>"></script>
	<script src="<?= asset('js/simplebar.min.js') ?>"></script>
	<script src='<?= asset('js/daterangepicker.js') ?>'></script>
	<script src='<?= asset('js/jquery.stickOnScroll.js') ?>'></script>
	<script src="<?= asset('js/tinycolor-min.js') ?>"></script>
	<script src="<?= asset('js/config.js') ?>"></script>
	<script src="<?= asset('js/apps.js') ?>"></script>
</body>

</html>
</body>

</html>