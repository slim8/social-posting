<?php

use App\Http\Controllers\AngularController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

Route::any('/de/{any}', [AngularController::class, 'index'])->where('any', '^(?!api).*$');
Route::any('/de', [AngularController::class, 'index'])->where('any', '^(?!api).*$');

Route::any('/{any}', [AngularController::class, 'index'])->where('any', '^(?!api|de).*$');

// Route::group(['middleware' => ['role:user']], function () {
//     Route::get('/dashboard', 'App\Http\Controllers\DashboardController@index')->name('dashboard');
//     Route::get('/user', 'App\Http\Controllers\UserController@index')->name('dashboard');
//     Route::get('/loginjwt', 'App\Http\Controllers\Functions\RoutersController@index')->name('dashboard');
//     Route::get('/testconnectedjwt', 'App\Http\Controllers\Functions\RoutersController@index')->name('dashboard');
// });

// Route::group(['middleware' => ['role:admin']], function () {
//     Route::get('/admin', 'App\Http\Controllers\AdminController@index')->name('dashboard');
// });

require __DIR__.'/auth.php';
