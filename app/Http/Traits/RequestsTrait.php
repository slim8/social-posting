<?php

namespace App\Http\Traits;

use App\Models\Account;
use Illuminate\Support\Facades\DB;

trait RequestsTrait
{
    use UserTrait;

    public static function getSavedAccountFromDB(string $provider = 'facebook', string $providerType = 'page')
    {
        $AllPages = [];

        foreach (DB::table('accounts')->where('company_id', UserTrait::getCompanyId())->where('provider', $provider)->where('providerType', $providerType)->where('status', 1)->orderBy('id')->lazy() as $account) {
            $id = $account->id;
            $uid = $account->uid;
            $pageFacebookPageLink = $account->profilePicture;
            $category = $account->category;
            $name = $account->name;
            $AllPages[] = ['id' => $id, 'pageId' => $uid, 'pagePictureUrl' => $pageFacebookPageLink, 'category' => $category,  'pageName' => $name];
        }

        return $AllPages;
    }

    public static function findAccountByUid($value, string $key = 'uid')
    {
        $account = Account::where('uid', $value)->where('company_id', UserTrait::getCompanyId())->first();

        return $account;
    }
}
