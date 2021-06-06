<?php

use App\Http\Controllers\AdmissionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\YearController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('/auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::get('/admissions', [AuthController::class, 'admissions']);
        Route::get('/check', [AuthController::class, 'check']);
        Route::post('/profile', [AuthController::class, 'profile']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/users/change', [UserController::class, 'change']);
    Route::post('/users/{user}/subjects', [SubjectController::class, 'enroll']);
    Route::post('/admissions/increment', [AdmissionController::class, 'increment']);
    Route::apiResources([
        'admissions' => AdmissionController::class,
        'courses' => CourseController::class,
        'grades' => GradeController::class,
        'mails' => MailController::class,
        'schedules' => ScheduleController::class,
        'subjects' => SubjectController::class,
        'users' => UserController::class,
        'years' => YearController::class,
        'logs' => LogController::class,
    ]);
});
