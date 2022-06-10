<?php

namespace App\Http\Traits\Services;

use App\Http\Traits\UserTrait;
use App\Models\Account;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

trait FacebookService
{
    use UserTrait;

    public static function ReconnectOrRefrech($selectedPages , $providerTokenId , int $refrech = 0)
    {
        if ($selectedPages) {
            foreach ($selectedPages as $page) {
                $provider = $page['provider'];
                if ($provider == 'facebook') {
                    $accountModel =  Account::where('providerTokenId', $providerTokenId)->where('uid', $page['pageId']);

                    if(!$refrech){
                        $accountModel->where('accessToken',Account::$STATUS_DISCONNECTED);
                    }

                    $accountModel->update(['status' => 1, 'accessToken' => $page['pageToken'], 'expiryDate' => date('Y-m-d', strtotime('+60 days'))]);
                } else {
                    $instagramAccount = Account::where('providerTokenId', $providerTokenId)->where('uid', $page['pageId'])->first();
                    if ($instagramAccount) {
                        Account::where('providerTokenId', $providerTokenId)->where('uid', $page['pageId'])->update(['status' => 1, 'accessToken' => $instagramAccount->related_account_id == null ? $page['accessToken'] : 'NA', 'expiryDate' => date('Y-m-d', strtotime('+60 days'))]);
                    }
                }
            }
        }
    }

     /**
     * Get facebook page picture from Facebook ID.
     */
    public static function getPagePicture($pageId)
    {
        $response = Http::get(env('FACEBOOK_ENDPOINT').$pageId.'/picture?redirect=0');

        return $response->json('data')['url'];
    }

}
