<?php

use Controllers\AuthController;
use Controllers\CourseController;
use Controllers\MailController;
use Controllers\PageController;
use Controllers\RegistrarController;
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
	$router->resource('/users', UserController::class);
	$router->resource('/registrars', RegistrarController::class);
	$router->resource('/teachers', TeacherController::class);
	$router->resource('/courses', CourseController::class);
});

$router->group('/api', function (Router $router) {
	$router->group('/auth', function (Router $router) {
		$router->post('/login', [AuthController::class, 'login']);
		$router->post('/logout', [AuthController::class, 'logout']);
		$router->put('/self', [AuthController::class, 'self']);
	});

	$router->get('/emails', [MailController::class, 'index']);
});

return $router;
