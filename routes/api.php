<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Auth\ApiAuthController;
use App\Http\Controllers\DictionaryController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\functions\ExempleController;
use App\Http\Controllers\Password\ForgotPasswordController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProviderTokenController;
use App\Http\Controllers\Roles\AdminsController;
use App\Http\Controllers\Roles\CompanyAdminsController;
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
    Route::post('/forget-password', [ForgotPasswordController::class, 'forgetPassword']);
    Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);
    Route::get('/dictionary', [DictionaryController::class, 'index']);
    Route::get('/dictionary/{lang}/{key}', [DictionaryController::class, 'show']);
});

Route::group(['middleware' => ['checkroles', 'role:companyadmin']], function () {
    Route::post('/get-meta-pages-groups', [GeneralSocialController::class, 'getMetaPagesAndGroups'])->name('get-meta-pages-groups.api');
    Route::post('/save-meta-pages-groups', [GeneralSocialController::class, 'saveMetaPagesAndGroups'])->name('save-meta-pages-groups.api');
    Route::post('/register-user', [ApiAuthController::class, 'registerUser'])->name('register-user.api');
    Route::post('/facebook/get-longlife-token', [FacebookController::class, 'getLongLifeToken'])->name('get-longlife-facebook-token.api');
    Route::get('/get-connected-accounts', [ProviderTokenController::class, 'getConnectedAccounts'])->name('get-connected-accounts.api');
    Route::post('/token/disconnect', [ProviderTokenController::class, 'disconnectToken'])->name('disconnect-token.api');
    Route::post('/token/{tokenId}/delete', [ProviderTokenController::class, 'deleteToken'])->name('delete-token.api');
    Route::post('/accounts/status/{action}/{accountId}', [AccountController::class, 'disconnectAccount'])->name('disconnect-account.api');
    Route::post('/accounts/token/refresh/{accountId}', [ProviderTokenController::class, 'refreshToken'])->name('disconnect-token.api');
    Route::post('/accounts/{accountId}/delete', [AccountController::class, 'deleteAccount'])->name('delete-accounts.api');
    Route::post('/managment/permissions/add', [CompanyAdminsController::class, 'addAccountToUser'])->name('add-permissions.api');
    Route::post('/managment/permissions/remove', [CompanyAdminsController::class, 'removeAccountFromUser'])->name('remove-permissions.api');
    Route::get('/managment/users', [AdminsController::class, 'getAllUsers'])->name('get-admin-users.api');
});

Route::group(['middleware' => ['checkroles', 'role:companyadmin|user']], function () {
    Route::get('/check-logged-in', [ApiAuthController::class, 'checkLoggedIn'])->name('check-logged-in-api');
    Route::post('/send-post', [GeneralSocialController::class, 'sendToPost'])->name('send-general-post.api');
    Route::get('/accounts', [GeneralSocialController::class, 'getAllAccountsByCompanyId'])->name('load-accounts.api'); // For Managment Account
    Route::get('/accounts/{accountId}', [GeneralSocialController::class, 'getAllAccountsByCompanyId'])->name('load-accounts.api');
    Route::get('/accounts/{id}/posts', [PostController::class, 'getPostsByAccountId'])->name('check-logged-in-api');
    Route::get('/posts', [PostController::class, 'getPosts'])->name('get-posts-api');
    Route::get('/posts/{postId}', [PostController::class, 'getPosts'])->name('get-posts-api');
    Route::post('/uploadfile', [FileController::class, 'uploadFile'])->name('uploadfile.api');
    Route::post('/uploadbase64', [FileController::class, 'uploadBase64'])->name('uploadbase64.api');
    Route::post('/searchusers', [GeneralSocialController::class, 'searchUsers'])->name('search.users.api');
    Route::post('/searchtags', [GeneralSocialController::class, 'searchTags'])->name('search.tags.api');
    Route::post('/drafts/delete', [PostController::class, 'deleteDraft'])->name('delete.draft.api');
    Route::post('/drafts/publish/{postId}', [PostController::class, 'publishDraft'])->name('publish.draft.api');
});

Route::group(['middleware' => ['checkroles', 'role:admin']], function () {
    Route::get('/admin/companies', [AdminsController::class, 'getAllCompanies'])->name('get-admin-companies.api');
    Route::get('/admin/users', [AdminsController::class, 'getAllUsers'])->name('get-admin-users.api');
    Route::get('/profile/{id}', [ProfileController::class, 'show'])->name('get-custom-profile.api');
    Route::apiResource('/dictionary', DictionaryController::class)->except(['show']);
});

Route::group(['middleware' => ['checkroles', 'role:companyadmin|user|admin']], function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('get-profile.api');
    Route::post('/profile', [ProfileController::class, 'update'])->name('update-profile.api');
    Route::post('/change-password', [ProfileController::class, 'changePassword']);
});
