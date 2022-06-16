<?php

namespace App\Http\Traits;

use App\Models\Account;
use App\Models\UsersAccounts;
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

    public static function getAllAccountsFromDB(int $accountId = null)
    {
        $AllPages = [];
        $accountObject = Account::where('companyId', UserTrait::getCompanyId());

        if ($accountId) {
            $accountObject = $accountObject->where('id', $accountId);
        }
        if (!UserTrait::getUserObject()->hasRole('companyadmin')) {
            $accountObject = $accountObject->where('status', 1);
            $userId = UserTrait::getCurrentAdminId();
        }

        foreach ($accountObject->orderBy('id')->lazy() as $account) {
            $id = $account->id;
            $uid = $account->uid;
            $provider = $account->provider;
            $pageProfilePicture = $account->profilePicture;
            $category = $account->category;
            $name = $account->name;
            $pageContent = ['id' => $id, 'pageId' => $uid, 'pagePictureUrl' => $pageProfilePicture, 'category' => $category,  'pageName' => $name, 'provider' => $provider, 'isConnected' => $account->status ? true : false];

            if (UserTrait::getUserObject()->hasRole('companyadmin')) {
                $pageContent['users'] = UserTrait::getUsersLinkedToAccounts($id);
            }

            // Check and return only Accounts related to user (If User Connected is not Company admin)
            if (UserTrait::getUserObject()->hasRole('companyadmin')) {
                $AllPages[] = $pageContent;
            } elseif (UsersAccounts::hasAccountPermission($userId, $id)) {
                $AllPages[] = $pageContent;
            }
        }

        return $AllPages;
    }

    public static function findAccountByUid($value, string $key = 'uid', int $onlyConnected = 0)
    {
        $account = Account::where($key, $value)->where('companyId', UserTrait::getCompanyId());

        // Check if the Account is Connected

        if ($onlyConnected) {
            $account = $account->where('status', 1);
        }

        $account = $account->first();

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

    public static function formatTags($tag)
    {
        return str_replace(' ', '_', $tag);
    }

    /**
     * Function to Process Json Response.
     */
    public static function processResponse($sucess, array $object = [])
    {
        $object['success'] = $sucess;

        return response()->json($object, $sucess ? 201 : 401);
    }
}
