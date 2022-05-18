<?php

use App\Http\Controllers\Auth\ApiAuthController;
use App\Http\Controllers\functions\ExempleController;
use App\Http\Controllers\Socials\FacebookController;
use App\Http\Controllers\Socials\InstagramController;
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
    Route::post('/sendmail', [ExempleController::class, 'sendmail'])->name('sendmail.api');
});

Route::group(['middleware' => ['checkroles', 'role:user']], function () {
    Route::get('/testifloggedin', 'App\Http\Controllers\Functions\RoutersController@index')->name('dashboard');
    Route::post('/testifloggedin', 'App\Http\Controllers\Functions\RoutersController@index')->name('dashboard');
});

Route::group(['middleware' => ['checkroles', 'role:admin']], function () {
    Route::post('/get-instagram-accounts', [InstagramController::class, 'getAccountsList'])->name('get-instagram-accounts.api');
    Route::post('/instagram/get-accounts', [InstagramController::class, 'getAccountsList'])->name('get-instagram-accounts.api');
    Route::post('/get-facebook-pages', [FacebookController::class, 'getPagesList'])->name('get-facebook-pages.api');
    Route::post('/facebook/get-pages', [FacebookController::class, 'getPagesList'])->name('get-facebook-pages.api');
    Route::post('/facebook/save-pages', [FacebookController::class, 'savePagesList'])->name('save-facebook-pages.api');
    Route::post('/save-facebook-pages', [FacebookController::class, 'savePagesList'])->name('save-facebook-pages.api');
    Route::post('/register-user', [ApiAuthController::class, 'registerUser'])->name('register-user.api');
    Route::post('/facebook/get-longlife-token', [FacebookController::class, 'getLongLifeToken'])->name('get-longlife-facebook-token.api');
});

Route::group(['middleware' => ['checkroles', 'role:admin|user']], function () {
    Route::get('/load-facebook-pages', [FacebookController::class, 'getAllPagesByCompanyId'])->name('load-facebook-pages.api');
    Route::get('/facebook/load-pages', [FacebookController::class, 'getAllPagesByCompanyId'])->name('load-facebook-pages.api');
    Route::post('/facebook/send-post', [FacebookController::class, 'postToFacebook'])->name('send-post.api');
    Route::post('/send-facebook-post', [FacebookController::class, 'postToFacebook'])->name('send-post.api');
});
