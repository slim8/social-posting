<?php

namespace App\Http\Traits;

use App\Models\ProviderToken;
use App\Models\User;
use App\Models\UsersAccounts;
use Illuminate\Support\Facades\Auth;

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
    public static function getCurrentAdminId()
    {
        return Auth::user()->id;
    }

    /**
     * Get Current TokenProvider Id.
     */
    public static function getCurrentProviderId()
    {
        $account = ProviderToken::where('created_by', UserTrait::getCurrentAdminId())->first();

        if (!$account) {
            return false;
        }

        return $account->id;
    }

    /**
     * Get Current TokenProvider Id. By User ID.
     */
    public static function getUniqueProviderTokenByProvider($accountUserId, string $provider = 'facebook' , int $userId = null)
    {
        $account = ProviderToken::where('createdBy', $userId ? $userId : UserTrait::getCurrentAdminId())->where('provider', $provider)->where('accountUserId', $accountUserId)->first();

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
        $account = ProviderToken::where('createdBy', UserTrait::getCurrentAdminId())->first();

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
        $account = ProviderToken::where('createdBy', UserTrait::getCurrentAdminId())->where('accountUserId', $uid)->first();

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
        $account = User::where('company_id', UserTrait::getCompanyId())->where('id', $user)->first();

        if (!$account) {
            return false;
        }

        return $account;
    }

    public static function setPermissionaccountToUser($userId, $accountId)
    {
        UsersAccounts::create([
            'account_id' => $accountId,
            'user_id' => $userId,
        ]);
    }
}
