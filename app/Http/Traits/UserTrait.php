<?php

namespace App\Http\Traits;

use App\Models\ProviderToken;
use App\Models\User;
use App\Models\UsersAccounts;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\TraitController;

trait UserTrait
{
    /**
     * get Connected User Object.
     */
    public static function getUserObject()
    {
        return Auth::user();
    }

    /**
     * get current Company Id.
     */
    public static function getCompanyId()
    {
        return Auth::user()->companyId;
    }

    /**
     * Get Current user Id.
     */
    public static function getCurrentId()
    {
        return Auth::user()->id;
    }

    /**
     * Get Current TokenProvider Id.
     */
    public static function getCurrentProviderId()
    {
        $traitController = new TraitController();
        $account = ProviderToken::where('created_by', $traitController->getCurrentId())->first();

        if (!$account) {
            return false;
        }

        return $account->id;
    }

    /**
     * Get Current TokenProvider Id. By User ID.
     */
    public static function getUniqueProviderTokenByProvider($accountUserId, string $provider = 'facebook', int $userId = null)
    {
        $traitController = new TraitController();
        $account = ProviderToken::where('createdBy', $userId ? $userId : $traitController->getCurrentId())->where('provider', $provider)->where('accountUserId', $accountUserId)->first();

        if (!$account) {
            return false;
        }

        return $account->id;
    }

    /**
     * Get Current Provider Object.
     */
    public static function getCurrentProviderObject()
    {
        $traitController = new TraitController();
        $account = ProviderToken::where('createdBy', $traitController->getCurrentId())->first();

        if (!$account) {
            return false;
        }

        return $account;
    }

    /**
     * Get ProviderT By Provider UID.
     */
    public static function getProviderTByProviderUID($uid)
    {
        $traitController = new TraitController();
        $account = ProviderToken::where('createdBy', $traitController->getCurrentId())->where('accountUserId', $uid)->first();

        if (!$account) {
            return false;
        }

        return $account;
    }

    /**
     * Get Current Provider Object.
     */
    public static function isUserLinkedToActualCompany($user)
    {
        $traitController = new TraitController();
        $account = User::where('companyId', $traitController->getCompanyId())->where('id', $user)->first();

        if (!$account) {
            return false;
        }

        return $account;
    }

    /**
     * Give Account permission To user.
     */
    public static function setPermissionaccountToUser($userId, $accountId)
    {
        UsersAccounts::create([
            'accountId' => $accountId,
            'userId' => $userId,
        ]);
    }

    /**
     * Remove Account Permission from User.
     */
    public static function removePermissionaccountFromUser($userId, $accountId)
    {
        $traitController = new TraitController();
        Log::channel('info')->info('[removePermissionaccountFromUser] User '.$traitController->getCurrentId().' has remove Account : '.$accountId.' From User '.$userId);
        UsersAccounts::where('accountId', $accountId)->where('userId', $userId)->delete();
    }

    /**
     * Get Users who has permissions of Specific Account.
     */
    public static function getUsersLinkedToAccounts($accountId)
    {
        $users = [];
        $usersAccounts = UsersAccounts::where('accountId', $accountId)->get();
        foreach ($usersAccounts as $usersAccount) {
            $users[] = $usersAccount->userId;
        }

        return $users;
    }

    /**
     * Get Accounts linked to Specific User.
     */
    public static function getAccountsLinkedToUser($userId)
    {
        $accounts = [];
        $usersAccounts = UsersAccounts::where('userId', $userId)->get();
        foreach ($usersAccounts as $usersAccount) {
            $accounts[] = $usersAccount->accountId;
        }

        return $accounts;
    }
}
