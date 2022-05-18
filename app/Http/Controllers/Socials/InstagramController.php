<?php

namespace App\Http\Controllers\Socials;

use App\Http\Controllers\Controller;
use App\Http\Traits\UserTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class InstagramController extends Controller
{
    use UserTrait;

    /**
     * Get Instagram Business Account Information from Business Account ID , IF Not return false.
     */
    public function getInstagramInformationFromBID($businessId, $accessToken)
    {
        if (!$businessId || !$accessToken) {
            return false;
        }

        $url = 'https://graph.facebook.com/'.$businessId.'?fields=name,username,profile_picture_url,biography&access_token='.$accessToken;
        $response = Http::get($url);
        dd($response->json());
    }

    /**
     * Get Business Id Account from connected Facebook Page ID , If not exist return FALSE.
     */
    public function getBusinessAccountId($pageId, $accessToken)
    {
        $response = Http::get(env('FACEBOOK_ENDPOINT').$pageId.'?fields=instagram_business_account&access_token='.$accessToken);

        if ($response->json('instagram_business_account')) {
            return $response->json('instagram_business_account')['id'];
        } else {
            return false;
        }
    }

    public function getAccountsList(Request $request)
    {
        $facebookController = new FacebookController();

        $companyId = UserTrait::getCompanyId();

        $facebookPages = $facebookController->getPagesByCompanyId($companyId);

        // dd($facebookPages);

        // 79

        $pageId = '';
        $accessToken = '';

        // $response = Http::get(env('FACEBOOK_ENDPOINT').$pageId.'?fields=instagram_business_account&access_token='.$accessToken);

        // {"id":"105256542125745"}

        // $pageId = '';
        // $accessToken = '';

        $BusinessId = $this->getBusinessAccountId($pageId, $accessToken);

        if ($BusinessId) {
            dd($this->getInstagramInformationFromBID($BusinessId, $accessToken));
        }
        dd($BusinessId);
    }
}
