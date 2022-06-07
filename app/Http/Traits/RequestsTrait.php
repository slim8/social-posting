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
            $isConnected = ($account->accessToken == Account::$STATUS_DISCONNECTED) ? 0 : 1; // Check if Account has token (Is Connected)
            $AllPages[] = ['id' => $id, 'pageId' => $uid, 'pagePictureUrl' => $pageProfilePicture, 'category' => $category,  'pageName' => $name, 'provider' => $provider, 'isConnected' => $isConnected];
        }

        return $AllPages;
    }

    public static function findAccountByUid($value, string $key = 'uid' , int $onlyConnected = 0)
    {
        $account = Account::where($key, $value)->where('company_id', UserTrait::getCompanyId());

        // Check if the Account is Connected

        if($onlyConnected){
            $account = $account->where('status' , 1);
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
     * Function to Process Json Response
     */
    public static function processResponse($sucess, array $object = [])
    {

        $object['success'] = $sucess;

        return response()->json($object, $sucess ? 201 : 401);
    }
}
