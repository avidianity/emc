<!doctype html>
<html lang="en">

<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width,initial-scale=1" />
	<meta name="theme-color" content="#000000" />
	<link rel="icon" href="<?= asset('assets/images/logo.jpg') ?>">
	<title>EMC</title>
	<meta name="title" content="EMC">
	<meta name="description" content="EMC">
	<link href="https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,100;0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />

	<link rel="stylesheet" href="<?= asset('css/simplebar.css') ?>" />
	<link rel="stylesheet" href="<?= asset('css/feather.css') ?>" />
	<link rel="stylesheet" href="<?= asset('css/select2.css') ?>" />
	<link rel="stylesheet" href="<?= asset('css/dropzone.css') ?>" />
	<link rel="stylesheet" href="<?= asset('css/uppy.min.css') ?>" />
	<link rel="stylesheet" href="<?= asset('css/jquery.steps.css') ?>" />
	<link rel="stylesheet" href="<?= asset('css/jquery.timepicker.css') ?>" />
	<link rel="stylesheet" href="<?= asset('css/quill.snow.css') ?>" />
	<link rel="stylesheet" href="<?= asset('css/daterangepicker.css') ?>" />
	<link rel="stylesheet" href="<?= asset('css/dataTables.bootstrap4.css') ?>">
	<link rel="stylesheet" href="<?= asset('css/app-light.css') ?>" id="lightTheme" disabled />
	<link rel="stylesheet" href="<?= asset('css/app-dark.css') ?>" id="darkTheme" />
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css">
	<?php if (session()->has('user')) : ?>
		<script>
			localStorage.setItem('user', '<?= json_encode(session()->get('user')) ?>')
		</script>
	<?php endif; ?>
	<script src="<?= asset('js/jquery.min.js') ?>"></script>
	<script src="<?= asset('js/popper.min.js') ?>"></script>
	<script src="<?= asset('js/moment.min.js') ?>"></script>
	<script src="<?= asset('js/bootstrap.min.js') ?>"></script>
	<script src="<?= asset('js/jquery.dataTables.min.js') ?>"></script>
	<script src="<?= asset('js/dataTables.bootstrap4.min.js') ?>"></script>
	<script src="<?= asset('js/simplebar.min.js') ?>"></script>
	<script src="<?= asset('js/daterangepicker.js') ?>"></script>
	<script src="<?= asset('js/jquery.stickOnScroll.js') ?>"></script>
	<script src="<?= asset('js/tinycolor-min.js') ?>"></script>
	<script src="<?= asset('js/config.js') ?>"></script>
	<script src="<?= asset('js/d3.min.js') ?>"></script>
	<script src="<?= asset('js/topojson.min.js') ?>"></script>
	<script src="<?= asset('js/datamaps.all.min.js') ?>"></script>
	<script src="<?= asset('js/datamaps-zoomto.js') ?>"></script>
	<script src="<?= asset('js/datamaps.custom.js') ?>"></script>
	<script src="<?= asset('js/Chart.min.js') ?>"></script>
	<script>
		Chart.defaults.global.defaultFontFamily = base.defaultFontFamily;
		Chart.defaults.global.defaultFontColor = colors.mutedColor;
	</script>
	<script src="<?= asset('js/gauge.min.js') ?>"></script>
	<script src="<?= asset('js/jquery.sparkline.min.js') ?>"></script>
	<script src="<?= asset('js/apexcharts.min.js') ?>"></script>
	<script src="<?= asset('js/apexcharts.custom.js') ?>"></script>
	<script src="<?= asset('js/jquery.mask.min.js') ?>"></script>
	<script src="<?= asset('js/select2.min.js') ?>"></script>
	<script src="<?= asset('js/jquery.steps.min.js') ?>"></script>
	<script src="<?= asset('js/jquery.validate.min.js') ?>"></script>
	<script src="<?= asset('js/jquery.timepicker.js') ?>"></script>
	<script src="<?= asset('js/dropzone.min.js') ?>"></script>
	<script src="<?= asset('js/uppy.min.js') ?>"></script>
	<script src="<?= asset('js/quill.min.js') ?>"></script>
	<script>
		$('.select2').select2({
			theme: 'bootstrap4',
		});
		$('.select2-multi').select2({
			multiple: true,
			theme: 'bootstrap4',
		});
		$('.drgpicker').daterangepicker({
			singleDatePicker: true,
			timePicker: false,
			showDropdowns: true,
			locale: {
				format: 'MM/DD/YYYY',
			},
		});
		$('.time-input').timepicker({
			scrollDefault: 'now',
			zindex: '9999' /* fix modal open */ ,
		});
		/** date range picker */
		if ($('.datetimes').length) {
			$('.datetimes').daterangepicker({
				timePicker: true,
				startDate: moment().startOf('hour'),
				endDate: moment().startOf('hour').add(32, 'hour'),
				locale: {
					format: 'M/DD hh:mm A',
				},
			});
		}
		var start = moment().subtract(29, 'days');
		var end = moment();

		function cb(start, end) {
			$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
		}
		$('#reportrange').daterangepicker({
				startDate: start,
				endDate: end,
				ranges: {
					Today: [moment(), moment()],
					Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
					'Last 7 Days': [moment().subtract(6, 'days'), moment()],
					'Last 30 Days': [moment().subtract(29, 'days'), moment()],
					'This Month': [moment().startOf('month'), moment().endOf('month')],
					'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
				},
			},
			cb
		);
		cb(start, end);
		$('.input-placeholder').mask('00/00/0000', {
			placeholder: '__/__/____',
		});
		$('.input-zip').mask('00000-000', {
			placeholder: '____-___',
		});
		$('.input-money').mask('#.##0,00', {
			reverse: true,
		});
		$('.input-phoneus').mask('(000) 000-0000');
		$('.input-mixed').mask('AAA 000-S0S');
		$('.input-ip').mask('0ZZ.0ZZ.0ZZ.0ZZ', {
			translation: {
				Z: {
					pattern: /[0-9]/,
					optional: true,
				},
			},
			placeholder: '___.___.___.___',
		});
		// editor
		var editor = document.getElementById('editor');
		if (editor) {
			var toolbarOptions = [
				[{
					font: [],
				}, ],
				[{
					header: [1, 2, 3, 4, 5, 6, false],
				}, ],
				['bold', 'italic', 'underline', 'strike'],
				['blockquote', 'code-block'],
				[{
						header: 1,
					},
					{
						header: 2,
					},
				],
				[{
						list: 'ordered',
					},
					{
						list: 'bullet',
					},
				],
				[{
						script: 'sub',
					},
					{
						script: 'super',
					},
				],
				[{
						indent: '-1',
					},
					{
						indent: '+1',
					},
				], // outdent/indent
				[{
					direction: 'rtl',
				}, ], // text direction
				[{
						color: [],
					},
					{
						background: [],
					},
				], // dropdown with defaults from theme
				[{
					align: [],
				}, ],
				['clean'], // remove formatting button
			];
			var quill = new Quill(editor, {
				modules: {
					toolbar: toolbarOptions,
				},
				theme: 'snow',
			});
		}
		// Example starter JavaScript for disabling form submissions if there are invalid fields
		(function() {
			'use strict';
			window.addEventListener(
				'load',
				function() {
					// Fetch all the forms we want to apply custom Bootstrap validation styles to
					var forms = document.getElementsByClassName('needs-validation');
					// Loop over them and prevent submission
					var validation = Array.prototype.filter.call(forms, function(form) {
						form.addEventListener(
							'submit',
							function(event) {
								if (form.checkValidity() === false) {
									event.preventDefault();
									event.stopPropagation();
								}
								form.classList.add('was-validated');
							},
							false
						);
					});
				},
				false
			);
		})();
	</script>
	<script>
		var uptarg = document.getElementById('drag-drop-area');
		if (uptarg) {
			var uppy = Uppy.Core()
				.use(Uppy.Dashboard, {
					inline: true,
					target: uptarg,
					proudlyDisplayPoweredByUppy: false,
					theme: 'dark',
					width: 770,
					height: 210,
					plugins: ['Webcam'],
				})
				.use(Uppy.Tus, {
					endpoint: 'https://master.tus.io/files/',
				});
			uppy.on('complete', (result) => {
				console.log('Upload complete! We’ve uploaded these files:', result.successful);
			});
		}
	</script>
	<script src="<?= asset('js/apps.js') ?>"></script>
	<script src="//unpkg.com/dayjs@1.8.21/plugin/relativeTime.js"></script>
	<script src="//unpkg.com/dayjs@1.8.21/dayjs.min.js"></script>
	<script>
		dayjs.extend(window.dayjs_plugin_relativeTime)
	</script>
	<script src="//cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>
	<script src="//unpkg.com/axios@0.20.0-0/dist/axios.min.js"></script>
	<script src="<?= asset('app-js/helpers.js') ?>"></script>
	<script src="<?= asset('app-js/global.js') ?>"></script>
</head>

<body class="vertical dark">