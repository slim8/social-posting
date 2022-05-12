<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\testController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Auth\ApiAuthController;
use App\Http\Middleware\RedirectIfAuthenticated;
use \Illuminate\Http\Request;
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


$redirect = new RedirectIfAuthenticated;
$request = new Request;


Route::group(['middleware' => ['cors']], function () {
    Route::post('/login', [ApiAuthController::class, 'login'])->name('login.api');
    Route::post('/register', [ApiAuthController::class, 'register'])->name('register.api');
    Route::post('/logout', [ApiAuthController::class, 'logout'])->name('logout.api');
});


Route::group(['middleware' => ['checkroles','role:user']], function () {
   
   Route::get('/loginjwt', 'App\Http\Controllers\Functions\RoutersController@index')->name('dashboard');
    Route::post('/loginjwt', 'App\Http\Controllers\Functions\RoutersController@index')->name('dashboard');
 });
