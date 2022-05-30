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

// ALL commented Routes will be deleted after Some verifications ...

Route::group(['middleware' => ['cors']], function () {
    Route::post('/login', [ApiAuthController::class, 'login'])->name('login.api');
    Route::post('/register', [ApiAuthController::class, 'register'])->name('register.api');
    Route::post('/logout', [ApiAuthController::class, 'logout'])->name('logout.api');
    Route::post('/sendmail', [ExempleController::class, 'sendmail'])->name('sendmail.api');
    Route::post('/uploadimage', [ExempleController::class, 'uploadimage'])->name('uploadimage.api');
});

Route::group(['middleware' => ['checkroles', 'role:companyadmin']], function () {
    Route::post('/get-meta-pages-groups', [GeneralSocialController::class, 'getMetaPagesAndGroups'])->name('get-meta-pages-groups.api');
    Route::post('/save-meta-pages-groups', [GeneralSocialController::class, 'saveMetaPagesAndGroups'])->name('save-meta-pages-groups.api');
    Route::post('/register-user', [ApiAuthController::class, 'registerUser'])->name('register-user.api');
    Route::post('/facebook/get-longlife-token', [FacebookController::class, 'getLongLifeToken'])->name('get-longlife-facebook-token.api');
});

Route::group(['middleware' => ['checkroles', 'role:companyadmin|user']], function () {
    Route::get('/check-logged-in', [ApiAuthController::class, 'checkLoggedIn'])->name('check-logged-in-api');
    Route::post('/send-post', [GeneralSocialController::class, 'sendToPost'])->name('send-general-post.api');
    Route::get('/load-accounts', [GeneralSocialController::class, 'getAllAccountsByCompanyId'])->name('load-accounts.api');
    Route::get('/accounts/get-posts/{id}', [GeneralSocialController::class, 'getPostsByAccountId'])->name('check-logged-in-api');
});

Route::group(['middleware' => ['checkroles', 'role:admin']], function () {
    Route::get('/admin/companies', [RoutingController::class, 'getAllCompanies'])->name('get-admin-companies.api');
    Route::get('/admin/users', [RoutingController::class, 'getAllAdminsUsers'])->name('get-admin-users.api');
});
