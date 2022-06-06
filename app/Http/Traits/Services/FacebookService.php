<?php

namespace App\Http\Traits\Services;

use App\Http\Traits\UserTrait;
use App\Models\Account;
use Illuminate\Support\Facades\DB;

trait FacebookService
{
    use UserTrait;

    public static function ReconnectOrRefrech($selectedPages , $providerTokenId , int $refrech = 0)
    {
        if ($selectedPages) {
            foreach ($selectedPages as $page) {
                $provider = $page['provider'];
                if ($provider == 'facebook') {
                    $accountModel =  Account::where('provider_token_id', $providerTokenId)->where('uid', $page['pageId']);

                    if(!$refrech){
                        $accountModel->where('accessToken',"DISCONNECTED");
                    }

                    $accountModel->update(['status' => 1, 'accessToken' => $page['pageToken'], 'expiryDate' => date('Y-m-d', strtotime('+60 days'))]);
                } else {
                    $instagramAccount = Account::where('provider_token_id', $providerTokenId)->where('uid', $page['pageId'])->first();
                    if ($instagramAccount) {
                        Account::where('provider_token_id', $providerTokenId)->where('uid', $page['pageId'])->update(['status' => 1, 'accessToken' => $instagramAccount->related_account_id == null ? $page['accessToken'] : 'NA', 'expiryDate' => date('Y-m-d', strtotime('+60 days'))]);
                    }
                }
            }
        }
    }

}
