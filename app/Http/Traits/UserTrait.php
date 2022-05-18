<?php

namespace App\Http\Traits;

use App\Models\ProviderToken;
use Illuminate\Support\Facades\Auth;

trait UserTrait
{
    /**
     * get current Company Id.
     */
    public static function getCompanyId()
    {
        return Auth::user()->company_id;
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
}
