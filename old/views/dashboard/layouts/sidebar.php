<?php

use Libraries\View;
?>
<aside class="sidebar-left border-right bg-white shadow" id="leftSidebar" data-simplebar>
	<a href="#" class="btn collapseSidebar toggle-btn d-lg-none text-muted ml-2 mt-3" data-toggle="toggle">
		<i class="fe fe-x"><span class="sr-only"></span></i>
	</a>
	<nav class="vertnav navbar navbar-light">
		<div class="w-100 mb-4 d-flex">
			<a class="navbar-brand mx-auto mt-2 flex-fill text-center" href="<?= url('dashboard') ?>">
				<span class="avatar avatar-md mt-2">
					<img src="<?= asset('assets/images/logo.jpg') ?>" alt="..." class="avatar-img rounded-circle">
				</span>
			</a>
		</div>
		<ul class="navbar-nav flex-fill w-100 mb-2">
			<?php if (session()->get('user')->role !== 'Student') : ?>
				<li class="nav-item w-100">
					<a class="nav-link" href="<?= url('dashboard') ?>">
						<i class="fe fe-grid fe-16"></i>
						<span class="ml-3 item-text">Dashboard</span><span class="sr-only">(current)</span>
					</a>
				</li>
				<li class="nav-item w-100">
					<a class="nav-link" href="<?= url('dashboard/courses/all') ?>">
						<i class="fe fe-send fe-16"></i>
						<span class="ml-3 item-text">Courses</span>
					</a>
				</li>
				<li class="nav-item w-100">
					<a class="nav-link" href="<?= url('dashboard/students/all') ?>">
						<i class="fe fe-users fe-16"></i>
						<span class="ml-3 item-text">Students</span>
					</a>
				</li>
			<?php endif; ?>
			<?php if (!in_array(session()->get('user')->role, ['Teacher', 'Student'])) : ?>
				<li class="nav-item w-100">
					<a class="nav-link" href="<?= url('dashboard/teachers/all') ?>">
						<i class="fe fe-users fe-16"></i>
						<span class="ml-3 item-text">Teachers</span>
					</a>
				</li>
			<?php endif; ?>
			<?php if (session()->get('user')->role === 'Admin') : ?>
				<li class="nav-item w-100">
					<a class="nav-link" href="<?= url('dashboard/registrars/all') ?>">
						<i class="fe fe-users fe-16"></i>
						<span class="ml-3 item-text">Registrars</span>
					</a>
				</li>
				<li class="nav-item w-100">
					<a class="nav-link" href="<?= url('dashboard/users/all') ?>">
						<i class="fe fe-users fe-16"></i>
						<span class="ml-3 item-text">System Users</span>
					</a>
				</li>
				<li class="nav-item w-100">
					<a class="nav-link" href="<?= url('/dashboard/emails') ?>">
						<i class="fe fe-mail fe-16"></i>
						<span class="ml-3 item-text">Email Outbox</span>
					</a>
				</li>
			<?php endif; ?>
			<?php if (in_array(session()->get('user')->role, ['Registrar', 'Student', 'Teacher'])) : ?>
				<li class="nav-item w-100">
					<a class="nav-link" href="<?= url('dashboard/subjects/all') ?>">
						<i class="fe fe-book fe-16"></i>
						<span class="ml-3 item-text">Subjects</span>
					</a>
				</li>
				<li class="nav-item w-100">
					<a class="nav-link" href="<?= url('dashboard/schedules/all') ?>">
						<i class="fe fe-calendar fe-16"></i>
						<span class="ml-3 item-text">Schedules</span>
					</a>
				</li>
			<?php endif; ?>
			<?php if (session()->get('user')->role === 'Registrar') : ?>
				<li class="nav-item w-100">
					<a class="nav-link" href="<?= url('dashboard/admissions/all') ?>">
						<i class="fe fe-pen-tool fe-16"></i>
						<span class="ml-3 item-text">Admissions</span>
					</a>
				</li>
			<?php endif; ?>
			<?php if (session()->get('user')->role === 'Student') : ?>
				<li class="nav-item w-100">
					<a class="nav-link" href="<?= url('dashboard/profile') ?>">
						<i class="fe fe-user fe-16"></i>
						<span class="ml-3 item-text">Profile</span>
					</a>
				</li>
				<li class="nav-item w-100">
					<a class="nav-link" href="<?= url('dashboard/self/increment') ?>">
						<i class="fe fe-user fe-16"></i>
						<span class="ml-3 item-text">Enrollment</span>
					</a>
				</li>
			<?php endif; ?>
			<li class="nav-item w-100">
				<a class="nav-link" href="<?= url('/dashboard/change-password') ?>">
					<i class="fe fe-key fe-16"></i>
					<span class="ml-3 item-text">Change Password</span>
				</a>
			</li>
			<div class="btn-box w-100 mt-4 mb-1"></div>
			<p class="text-muted nav-heading mt-4 mb-1">
				<span>Signed in as:</span> <b><?= session()->get('user')->role ?></b>
			</p>
		</ul>
	</nav>
</aside>