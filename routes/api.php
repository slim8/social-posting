<?php

use App\Http\Controllers\Auth\ApiAuthController;
use App\Http\Controllers\functions\ExempleController;
use App\Http\Controllers\RoutingController;
use App\Http\Controllers\Socials\FacebookController;
use App\Http\Controllers\Socials\GeneralSocialController;
use App\Http\Controllers\Socials\InstagramController;
use App\Http\Middleware\RedirectIfAuthenticated;
use App\Models\Account;
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
    Route::post('/uploadimage', [ExempleController::class, 'uploadimage'])->name('uploadimage.api');
});

Route::group(['middleware' => ['checkroles', 'role:user']], function () {

    Route::post('/testifloggedin', 'App\Http\Controllers\Functions\RoutersController@index')->name('dashboard');
});

Route::group(['middleware' => ['checkroles', 'role:companyadmin']], function () {
    Route::post('/get-instagram-accounts', [InstagramController::class, 'getAccountsList'])->name('get-instagram-accounts.api');
    Route::post('/instagram/get-accounts', [InstagramController::class, 'getAccountsList'])->name('get-instagram-accounts.api');
    // Route::post('/instagram/save-accounts', [InstagramController::class, 'savePagesList'])->name('save-instagram-accounts.api');
    Route::post('/get-facebook-pages', [FacebookController::class, 'getPagesList'])->name('get-facebook-pages.api');



    Route::post('/get-meta-pages-groups', [GeneralSocialController::class, 'getMetaPagesAndGroups'])->name('get-meta-pages-groups.api');
    Route::post('/save-meta-pages-groups', [GeneralSocialController::class, 'saveMetaPagesAndGroups'])->name('save-meta-pages-groups.api');



    Route::post('/facebook/get-pages', [FacebookController::class, 'getPagesList'])->name('get-facebook-pages.api');
    // Route::post('/facebook/save-pages', [FacebookController::class, 'savePagesList'])->name('save-facebook-pages.api');
    // Route::post('/save-facebook-pages', [FacebookController::class, 'savePagesList'])->name('save-facebook-pages.api');
    Route::post('/register-user', [ApiAuthController::class, 'registerUser'])->name('register-user.api');
    Route::post('/facebook/get-longlife-token', [FacebookController::class, 'getLongLifeToken'])->name('get-longlife-facebook-token.api');
});

Route::group(['middleware' => ['checkroles', 'role:companyadmin|user']], function () {
    Route::get('/check-logged-in',  [ApiAuthController::class, 'checkLoggedIn'])->name('check-logged-in-api');
    Route::get('/facebook/load-pages', [FacebookController::class, 'getAllPagesByCompanyId'])->name('load-facebook-pages.api');
    Route::post('/send-post', [GeneralSocialController::class, 'sendToPost'])->name('send-general-post.api');
    Route::get('/load-accounts', [GeneralSocialController::class, 'getAllAccountsByCompanyId'])->name('load-accounts.api');
    Route::get('/instagram/load-accounts', [InstagramController::class, 'getAllPagesByCompanyId'])->name('load-instagram-accounts.api');
});

Route::group(['middleware' => ['checkroles', 'role:admin']], function () {
    Route::get('/admin/companies', [RoutingController::class, 'getAllCompanies'])->name('get-admin-companies.api');
    Route::get('/admin/users', [RoutingController::class, 'getAllAdminsUsers'])->name('get-admin-users.api');
});

Route::get('/test', function () {
    return Account::with('posts')->whereHas('posts', function ($query) {
        $query->with('media');
    })->get();
});
