<?php

namespace App\Http\Traits;

use App\Http\Traits\UserTrait;
use App\Models\Account;
use Illuminate\Support\Facades\Http;

trait FacebookTrait
{
    use UserTrait;

    public static function ReconnectOrRefrech($selectedPages, $providerTokenId, int $refrech = 0)
    {
        if ($selectedPages) {
            foreach ($selectedPages as $page) {
                $provider = $page['provider'];
                if ($provider == 'facebook') {
                    $accountModel = Account::where('providerTokenId', $providerTokenId)->where('uid', $page['pageId']);

                    if (!$refrech) {
                        $accountModel->where('accessToken', Account::$STATUS_DISCONNECTED);
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
        $response = Http::get(envValue('FACEBOOK_ENDPOINT').$pageId.'/picture?redirect=0');

        return $response->json('data')['url'];
    }

    /**
     * Get Facebook Page Info.
     */
    public static function getFacebookPageInfo($pageId, $accessToken)
    {
        $pageInfo = new \stdClass();
        $response = Http::get(envValue('FACEBOOK_ENDPOINT').$pageId.'?access_token='.$accessToken.'&fields=followers_count,link,username');
        $responseData = $response->json();

        $pageInfo->followers = isset($responseData['followers_count']) ? $responseData['followers_count'] : 0;
        $pageInfo->link = isset($responseData['link']) ? $responseData['link'] : null;
        $pageInfo->username = isset($responseData['username']) ? $responseData['username'] : null;

        return $pageInfo;
    }

    /**
     * Get Instagram Page Info.
     */
    public static function getinstagramPageInfo($pageId, $accessToken)
    {
        $pageInfo = new \stdClass();
        $response = Http::get(envValue('FACEBOOK_ENDPOINT').$pageId.'?access_token='.$accessToken.'&fields=followers_count,username');
        $responseData = $response->json();

        $pageInfo->followers = isset($responseData['followers_count']) ? $responseData['followers_count'] : 0;
        $pageInfo->link = null;
        $pageInfo->username = isset($responseData['username']) ? $responseData['username'] : null;

        return $pageInfo;
    }

    /**
     * Generate App Secret Prof
     */
    public static function getAppSecretProf($tokenKey)
    {
        return (envValue('FACEBOOK_APP_ENV') == 'Production') ? '&appsecret_proof='.hash_hmac('sha256', $tokenKey, envValue('FACEBOOK_SECRET_KEY')) : '';
    }

    public static function isProd()
    {
        return envValue('FACEBOOK_APP_ENV') == 'Production';
    }
}
