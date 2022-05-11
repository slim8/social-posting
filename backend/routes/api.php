<?php

use App\Http\Controllers\Auth\ApiAuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\testController;
use App\Http\Controllers\UserController;
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




Route::group(['middleware' => ['cors', 'json.response']], function () {
    Route::post('/login', [ApiAuthController::class, 'login'])->name('login.api');
    Route::post('/register', [ApiAuthController::class, 'register'])->name('register.api');
    Route::post('/logout', [ApiAuthController::class, 'logout'])->name('logout.api');
});



Route::group(['middleware' => 'auth'], function () {
    Route::get('/dashboard', 'App\Http\Controllers\DashboardController@index')->name('dashboard');
    Route::get('user', 'App\Http\Controllers\UserController@index')->name('dashboard');
    Route::get('/loginjwt', 'App\Http\Controllers\Functions\RoutersController@index')->name('dashboard');
    Route::get('/testconnectedjwt', 'App\Http\Controllers\Functions\RoutersController@index')->name('dashboard');

    Route::get('/test', 'App\Http\Controllers\testController@index')->name('dashboard');
    // Route::get('/testconnectedjwt', $RoutersController->index('hi'))->name('dashboard');
    // return view('dashboard');
    // Route::apiResources(['dashboard' => DashboardController::class, 'user' => UserController::class, 'test' => testController::class]);
});

// Route::group(['middleware' => ['auth']], function () {
//     Route::get('/admin', 'App\Http\Controllers\AdminController@index')->name('dashboard');
// });

// Route::group(['middleware' => ['role:user']], function () {
//     Route::get('/dashboard', 'App\Http\Controllers\DashboardController@index')->name('dashboard');
//     Route::get('/user', 'App\Http\Controllers\UserController@index')->name('dashboard');
// });
