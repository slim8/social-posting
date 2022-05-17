<?php

namespace App\Http\Traits;

use Illuminate\Support\Facades\Auth;

trait UserTrait
{
    public static function getCompanyId()
    {
        return Auth::user()->company_id;
    }
}
