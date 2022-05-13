<?php

use App\Http\Controllers\Auth\ApiAuthController;
use App\Http\Middleware\RedirectIfAuthenticated;
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

$redirect = new RedirectIfAuthenticated();
$request = new Request();

Route::group(['middleware' => ['cors']], function () {
    Route::post('/login', [ApiAuthController::class, 'login'])->name('login.api');
    Route::post('/register', [ApiAuthController::class, 'register'])->name('register.api');
    Route::post('/logout', [ApiAuthController::class, 'logout'])->name('logout.api');
});

Route::group(['middleware' => ['checkroles', 'role:user']], function () {
    Route::get('/testifloggedin', 'App\Http\Controllers\Functions\RoutersController@index')->name('dashboard');
    Route::post('/testifloggedin', 'App\Http\Controllers\Functions\RoutersController@index')->name('dashboard');
});

 Route::group(['middleware' => ['checkroles', 'role:admin']], function () {
     Route::post('/register-user', [ApiAuthController::class, 'registerUser'])->name('register-user.api');
 });
