<?php

use Models\StudentSubject;
use Models\Subject;

extend('layouts.header') ?>
<div id="container" style="background-color: #fff; height: 1100px; width: 816px;">
	<div class="container px-5 pt-5">
		<div class="d-flex mt-3">
			<img src="<?= asset('assets/images/logo.jpg') ?>" style="height: 80px; width: 80px" alt="EMC" class="rounded-circle ml-auto mr-4">
			<div class="text-dark align-self-center text-center pt-4">
				<h3 class="text-dark">EASTERN MINDORO COLLEGE</h3>
				<p>BB2, Bongabong, Oriental Mindoro</p>
			</div>
			<div style="height: 80px; width: 80px" class="mr-auto ml-4"></div>
		</div>
		<h5 class="text-dark text-center">REGISTRATION SLIP</h5>
		<p class="text-center text-dark"><?= session()->get('user')->admission->course->description ?> - <?= session()->get('user')->admission->course->code ?></p>
		<div class="row pt-4 text-dark">
			<div class="col-6">
				Name: <b><?= session()->get('user')->last_name ?>, <?= session()->get('user')->first_name ?></b>
			</div>
			<div class="col-6 pl-5">
				Sex: <?= session()->get('user')->gender ?>
			</div>
			<div class="col-6">
				Student Number: <?= session()->get('user')->uuid ?>
			</div>
			<div class="col-6 pl-5">
				Contact No.: <?= session()->get('user')->number ?>
			</div>
			<div class="col-6">
				Address: <?= session()->get('user')->address ?>
			</div>
		</div>
		<div class="table-responsive text-center">
			<table class="table table-sm mt-4">
				<thead>
					<tr>
						<th class="text-dark font-weight-bold">NO.</th>
						<th class="text-dark font-weight-bold">SUBJECT CODE</th>
						<th class="text-dark font-weight-bold">SUBJECT</th>
						<th class="text-dark font-weight-bold">UNITS</th>
					</tr>
				</thead>
				<tbody>
					<?php session()->get('user')
						->subjects
						->filter(function ($item) {
							return $item instanceof StudentSubject;
						})
						->map(function (StudentSubject $studentSubject) {
							return $studentSubject->subject;
						})->each(function (Subject $subject, $index) { ?>
						<tr>
							<td class="text-dark"><?= $index + 1 ?></td>
							<td class="text-dark"><?= $subject->code ?></td>
							<td class="text-dark"><?= $subject->description ?></td>
							<td class="text-dark"><?= $subject->units ?></td>
						</tr>
					<?php }); ?>
				</tbody>
			</table>
		</div>
	</div>
</div>
<?php extend('layouts.footer') ?>
<script src="<?= asset('app-js/registration-slip.js') ?>"></script>