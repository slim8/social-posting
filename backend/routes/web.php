<?php

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

Route::get('/', function () {
    return view('welcome');
});

// Route::get('/dashboard', function () {
//     return view('dashboard');
// })->middleware(['auth'])->name('dashboard');



Route::group(['middleware' => ['auth']], function () {
    Route::get('/dashboard','App\Http\Controllers\DashboardController@index')->name('dashboard');
    // return view('dashboard');
});

Route::group(['middleware' => ['auth']], function () {
    Route::get('/admin','App\Http\Controllers\AdminController@index')->name('dashboard');
    // return view('dashboard');
});

Route::group(['middleware' => ['auth']], function () {
    Route::get('/user','App\Http\Controllers\UserController@index')->name('dashboard');
    // return view('dashboard');
});

require __DIR__.'/auth.php';
