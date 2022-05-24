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

    public static function getAllAccountsFromDB()
    {
        $AllPages = [];

        foreach (DB::table('accounts')->where('company_id', UserTrait::getCompanyId())->where('status', 1)->orderBy('id')->lazy() as $account) {
            $id = $account->id;
            $uid = $account->uid;
            $provider = $account->provider;
            $pageProfilePicture = $account->profilePicture;
            $category = $account->category;
            $name = $account->name;
            $AllPages[] = ['id' => $id, 'pageId' => $uid, 'pagePictureUrl' => $pageProfilePicture, 'category' => $category,  'pageName' => $name, 'provider' => $provider];
        }

        return $AllPages;
    }

    public static function findAccountByUid($value, string $key = 'uid')
    {
        $account = Account::where($key, $value)->where('company_id', UserTrait::getCompanyId())->first();

        return $account;
    }

    public static function prepareParameters($objects)
    {
        $i = 0;
        $parameter = '';
        if (!$objects) {
            return '';
        }

        foreach ($objects as $key => $value) {
            if ($i != 0) {
                $parameter = $parameter.'&';
            }
            ++$i;
            $parameter = $parameter.$key.'='.$value;
        }

        return $parameter;
    }
}
