<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Auth\ApiAuthController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\functions\ExempleController;
use App\Http\Controllers\Password\ForgotPasswordController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProviderTokenController;
use App\Http\Controllers\RoutingController;
use App\Http\Controllers\Socials\FacebookController;
use App\Http\Controllers\Socials\GeneralSocialController;
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
    Route::get('/refresh-token', [ProviderTokenController::class, 'refreshToken'])->name('refreshToken.api');
    Route::post('/forget-password', [ForgotPasswordController::class,'forgetPassword']);
    // Route::apiResource('profile', ProfileController::class)->only(['show' , 'update']);

    Route::post('/reset-password', [ForgotPasswordController::class,'resetPassword']);
    Route::post('/change-password', [ProfileController::class,'changePassword']);
    // Route::get('/profile/{id}', [ProfileController::class,'show']);
    // Route::post('/profile/{id}', [ProfileController::class,'update']);
});

Route::group(['middleware' => ['checkroles', 'role:companyadmin']], function () {
    Route::post('/get-meta-pages-groups', [GeneralSocialController::class, 'getMetaPagesAndGroups'])->name('get-meta-pages-groups.api');
    Route::post('/save-meta-pages-groups', [GeneralSocialController::class, 'saveMetaPagesAndGroups'])->name('save-meta-pages-groups.api');
    Route::post('/register-user', [ApiAuthController::class, 'registerUser'])->name('register-user.api');
    Route::post('/facebook/get-longlife-token', [FacebookController::class, 'getLongLifeToken'])->name('get-longlife-facebook-token.api');
    Route::get('/get-connected-accounts', [ProviderTokenController::class, 'getConnectedAccounts'])->name('get-connected-accounts.api');
    Route::post('/disconnect-token', [ProviderTokenController::class, 'disconnectToken'])->name('disconnect-token.api');
    Route::post('/account/status/{action}/{accountId}', [AccountController::class, 'disconnectAccount'])->name('disconnect-account.api');

     // Route::apiResource('profile', ProfileController::class)->only(['show' , 'update']);
});

Route::group(['middleware' => ['checkroles', 'role:companyadmin|user']], function () {
    Route::get('/check-logged-in', [ApiAuthController::class, 'checkLoggedIn'])->name('check-logged-in-api');
    Route::post('/send-post', [GeneralSocialController::class, 'sendToPost'])->name('send-general-post.api');
    Route::get('/load-accounts', [GeneralSocialController::class, 'getAllAccountsByCompanyId'])->name('load-accounts.api');
    Route::get('/accounts/get-posts/{id}', [PostController::class, 'getPostsByAccountId'])->name('check-logged-in-api');
    Route::get('/posts', [PostController::class, 'getPosts'])->name('get-posts-api');
    Route::get('/posts/{postId}', [PostController::class, 'getPosts'])->name('get-posts-api');
    Route::post('/uploadfile', [ExempleController::class, 'uploadfile'])->name('uploadfile.api');
    Route::get('/profile', [ProfileController::class, 'show'])->name('get-admin-companies.api');
});

Route::group(['middleware' => ['checkroles', 'role:admin']], function () {
    Route::get('/admin/companies', [RoutingController::class, 'getAllCompanies'])->name('get-admin-companies.api');
    Route::get('/admin/users', [RoutingController::class, 'getAllAdminsUsers'])->name('get-admin-users.api');
    Route::get('/profile/{id}', [ProfileController::class, 'show'])->name('get-admin-companies.api');
    Route::get('/profile', [ProfileController::class, 'show'])->name('get-admin-companies.api');
});
