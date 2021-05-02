<?php

use Controllers\AdmissionController;
use Controllers\AnalyticsController;
use Controllers\AuthController;
use Controllers\CourseController;
use Controllers\GradeController;
use Controllers\MailController;
use Controllers\PageController;
use Controllers\RegistrarController;
use Controllers\ScheduleController;
use Controllers\StudentController;
use Controllers\SubjectController;
use Controllers\TeacherController;
use Controllers\UserController;
use Libraries\Router;

$router = Router::getInstance();

$router->get('/', [PageController::class, 'home']);
$router->get('/login', [PageController::class, 'login']);
$router->get('/forgot-password', [PageController::class, 'forgotPassword']);
$router->group('/dashboard', function (Router $router) {
	$router->get('/', [PageController::class, 'dashboard']);
	$router->get('/emails', [PageController::class, 'emails']);
	$router->get('/change-password', [PageController::class, 'changePassword']);
	$router->get('/profile', [PageController::class, 'profile']);
	$router->resource('/users', UserController::class);
	$router->resource('/registrars', RegistrarController::class);
	$router->resource('/teachers', TeacherController::class);
	$router->resource('/courses', CourseController::class);
	$router->resource('/subjects', SubjectController::class);
	$router->resource('/admissions', AdmissionController::class);
	$router->resource('/students', StudentController::class);
	$router->resource('/schedules', ScheduleController::class);
});

$router->group('/api', function (Router $router) {
	$router->group('/auth', function (Router $router) {
		$router->post('/login', [AuthController::class, 'login']);
		$router->post('/logout', [AuthController::class, 'logout']);
		$router->put('/self', [AuthController::class, 'self']);
	});

	$router->get('/emails', [MailController::class, 'index']);

	$router->get('/grades/self', [GradeController::class, 'self']);

	$router->group('/analytics', function (Router $router) {
		$router->get('/students', [AnalyticsController::class, 'students']);
		$router->get('/courses', [AnalyticsController::class, 'courses']);
		$router->get('/genders', [AnalyticsController::class, 'genders']);
		$router->get('/graduates', [AnalyticsController::class, 'graduates']);
		$router->get('/enrollees', [AnalyticsController::class, 'enrollees']);
	});

	$router->apiResource('/grades', GradeController::class);
});

return $router;
