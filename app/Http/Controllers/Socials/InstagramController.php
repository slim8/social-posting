<?php

namespace App\Http\Controllers\Socials;

use App\Http\Controllers\Controller;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class InstagramController extends Controller
{
    use UserTrait;
    use RequestsTrait;

    /**
     * Post Media Instagram.
     */
    public function postPictureUrl($igUser, $token, $url)
    {
        $response = Http::post(env('FACEBOOK_ENDPOINT').$igUser.'/media?access_token='.$token.'&image_url='.$url.'&is_carousel_item=true');

        if ($response->json('id')) {
            return $response->json('id');
        } else {
            $response->json('error')['message'];
        }
    }

    public function postPictureSource($igUser, $token, $url)
    {
        $client = new Client();

        $res = $client->request('POST', env('FACEBOOK_ENDPOINT').$igUser.'/media', [
            'multipart' => [
                [
                    'name' => 'image_url',
                    'contents' => fopen($url, 'rb'),
                ],
                [
                    'name' => 'access_token',
                    'contents' => $token,
                ],
                [
                    'name' => 'is_carousel_item',
                    'contents' => true,
                ],
            ],
        ]);

        $response = json_decode($res->getBody());

        return $response->id;
    }

    // public function postPictureSource($igUser, $token, $url)
    // {
    //     $response = Http::post(env('FACEBOOK_ENDPOINT').$igUser.'/media?access_token='.$token.'&image_url='.$url.'&is_carousel_item=true');

    //     if ($response->json('id')) {
    //         return $response->json('id');
    //     } else {
    //         $response->json('error')['message'];
    //     }
    // }

    /**
     * Generate Container of instagram carrousel.
     */
    public function publishCarrousel($object, $igUser)
    {
        $parameter = RequestsTrait::prepareParameters($object);
        $response = Http::post(env('FACEBOOK_ENDPOINT').$igUser.'/media_publish?'.$parameter);

        return $response->json('id');
    }

    /**
     * Generate Container of instagram carrousel.
     */
    public function postContainer($object, $igUser)
    {
        $parameter = RequestsTrait::prepareParameters($object);
        $response = Http::post(env('FACEBOOK_ENDPOINT').$igUser.'/media?'.$parameter);

        return $response->json('id');
    }

    /**
     * Post to Instagram Method.
     */
    public function postToInstagramMethod($object, $igUser, $imagesUrls, $imagesSources)
    {
        $images = [];

        if ($imagesSources) {
            foreach ($imagesSources as $image) {
                $images[] = $this->postPictureSource($igUser, $object['access_token'], $image);
            }
            $object['children'] = implode(',', $images);
        }

        if ($imagesUrls) {
            foreach ($imagesUrls as $image) {
                $images[] = $this->postPictureUrl($igUser, $object['access_token'], $image);
            }
            $object['children'] = implode(',', $images);

            // $object['children'] = json_encode($images);
        }

        if ($imagesUrls) {
            foreach ($imagesUrls as $image) {
                $images[] = $this->postPicture($igUser, $object['access_token'], $image);
            }
            $object['children'] = implode(',', $images);

            // $object['children'] = json_encode($images);
        }

        $object['media_type'] = 'CAROUSEL';

        $object['creation_id'] = $this->postContainer($object, $igUser);
        unset($object['caption']);
        unset($object['children']);

        return $this->publishCarrousel($object, $igUser);
    }

    /**
     * Return All Instagram pages for current user for ROUTES.
     */
    public function getAllPagesByCompanyId()
    {
        return $this->getSavedPagefromDataBaseByCompanyId(1);
    }

    public function getSavedPagefromDataBaseByCompanyId(int $returnJson = 0)
    {
        $AllPages = RequestsTrait::getSavedAccountFromDB('instagram');

        if ($returnJson) {
            if ($AllPages) {
                return response()->json(['success' => true,
            'pages' => $AllPages, ], 201);
            } else {
                return response()->json(['success' => false,
            'message' => 'No Instagram Found', ], 201);
            }
        } else {
            return $AllPages;
        }
    }

    /**
     * Save Instagram Accounts.
     */
    public function savePagesList(Request $request)
    {
        $jsonPageList = $request->json('pages');

        $actualCompanyId = UserTrait::getCompanyId();
        if ($jsonPageList) {
            foreach ($jsonPageList as $instagramAccount) {
                $id = $instagramAccount['id'];
                $relatedAccountId = RequestsTrait::findAccountByUid($instagramAccount['relatedAccountId']) ? RequestsTrait::findAccountByUid($instagramAccount['relatedAccountId'])->id : null;
                $pageinstagramAccountLink = $instagramAccount['accountPictureUrl'] ? $instagramAccount['accountPictureUrl'] : 'https://blog.soat.fr/wp-content/uploads/2016/01/Unknown.png';
                $name = $instagramAccount['pageName'];
                $token = $relatedAccountId ? 'NA' : $instagramAccount['accessToken'];

                $relatedUid = $instagramAccount['relatedAccountId'];

                $page = Account::where('uid', $id)->first();

                if (!$page) {
                    Account::create([
                        'name' => $name,
                        'provider' => 'instagram',
                        'status' => true,
                        'expiryDate' => date('Y-m-d'),
                        'scoope' => '',
                        'authorities' => '',
                        'link' => '',
                        'company_id' => $actualCompanyId,
                        'uid' => $id,
                        'profilePicture' => $pageinstagramAccountLink,
                        'category' => 'NA',
                        'providerType' => 'page',
                        'accessToken' => $token,
                        'related_account_id' => $relatedAccountId,
                        'provider_token_id' => UserTrait::getCurrentProviderId(),
                        'related_Uid' => $relatedUid,
                    ]);
                }
            }

            $Pages = $this->getSavedPagefromDataBaseByCompanyId();

            return response()->json(['success' => true,
        'pages' => $Pages, ], 201);
        } else {
            return response()->json(['success' => false,
        'message' => 'No page autorized', ], 201);
        }
    }

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

        return $response->json();
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

        $facebookPages = $facebookController->getPagesAccountInterne();

        $businessAccounts = [];

        if ($facebookPages) {
            foreach ($facebookPages as $facebookPage) {
                $pageId = $facebookPage['pageId'];
                $accessToken = $facebookPage['pageToken'];
                $businessAccountId = $this->getBusinessAccountId($pageId, $accessToken);
                if ($businessAccountId !== false) {
                    $instagramAccount = $this->getInstagramInformationFromBID($businessAccountId, $accessToken);

                    $businessAccounts[] = ['accessToken' => $accessToken, 'id' => $businessAccountId, 'relatedAccountId' => $pageId, 'accountPictureUrl' => isset($instagramAccount['profile_picture_url']) ? $instagramAccount['profile_picture_url'] : false,  'pageName' => $instagramAccount['name']];
                }
            }

            return response()->json(['success' => true,
            'pages' => $businessAccounts, ], 201);
        } else {
            return response()->json(['success' => false,
            'pages' => $businessAccounts, ], 201);
        }
    }
}
