<?php

namespace App\Http\Controllers\Socials;

use App\Http\Controllers\Controller;
use App\Http\Controllers\functions\UtilitiesController;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class InstagramController extends Controller
{
    use UserTrait;
    use RequestsTrait;

    protected $utilitiesController;

    public function __construct()
    {
        $this->utilitiesController = new UtilitiesController();
    }

    /**
     * Check if The Container is ready to publish.
     */
    public function checkIfCreationIsReady($object, $creationId, $isVideo)
    {
        $responseObject = [];
        if (!$isVideo) {
            $responseObject['status'] = true;

            return $responseObject;
        }
        sleep(15);
        $response = Http::get(env('FACEBOOK_ENDPOINT').$creationId.'?fields=status,status_code&access_token='.$object['access_token']);

        if ($response->json('status_code') == 'ERROR') {
            $responseObject['status'] = false;
            $responseObject['message'] = $response->json('status');

            return $responseObject;
        }

        if ($response->json('status_code') == 'IN_PROGRESS') {
            return $this->checkIfCreationIsReady($object, $creationId, 1);
        }

        if ($response->json('status_code') == 'FINISHED') {
            $responseObject['status'] = true;

            return $responseObject;
        }
    }

    public function checkMultiplesVideosContainers($object, $videosConatiners)
    {
        $responseObject = [];
        sleep(2);
        foreach ($videosConatiners as $videoId) {
            $check = $this->checkIfCreationIsReady($object, $videoId, 1);

            if (!$check['status']) {
                return $check;
            }
        }

        $responseObject['status'] = true;

        return $responseObject;
    }

    /**
     * Post Media Instagram From URL.
     */
    public function postMediaUrl($igUser, $token, $url, string $type = 'image')
    {
        $mediaParameters = $type == 'video' ? '&media_type=VIDEO&video_url=' : '&image_url=';
        $response = Http::post(env('FACEBOOK_ENDPOINT').$igUser.'/media?access_token='.$token.$mediaParameters.$url.'&is_carousel_item=true');

        if ($response->json('id')) {
            return $response->json('id');
        } else {
            return $response->json('error')['message'];
        }
    }

    /**
     * Generate Container of instagram carrousel.
     */
    public function publishContainer($object, $igUser)
    {
        $parameter = RequestsTrait::prepareParameters($object);

        // sleep(30);

        $response = Http::post(env('FACEBOOK_ENDPOINT').$igUser.'/media_publish?'.$parameter);
        // dd($response->json());
        if ($response->json('id')) {
            $responseObject['id'] = $response->json('id');
            $responseObject['status'] = true;
        } else {
            $responseObject['status'] = false;
            $responseObject['message'] = $response->json('error') ? $response->json('error')['error_user_msg'] : 'to be defined';
        }

        return $responseObject;
    }

    /**
     * Post Single Media to Instagram.
     */
    public function postSingleMedia($igUser, $object, $imagesUrls, $videos)
    {
        $object[$videos ? 'video_url' : 'image_url'] = $videos ? $videos[0] : $imagesUrls[0];

        if ($videos) {
            $object['media_type'] = 'VIDEO';
        }
        $parameter = RequestsTrait::prepareParameters($object);
        $response = Http::post(env('FACEBOOK_ENDPOINT').$igUser.'/media?'.$parameter);

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
    public function postToInstagramMethod($object, $igUser, $imagesUrls, $tags, $videos)
    {
        $images = [];
        $imagesCount = $imagesUrls ? count($imagesUrls) : 0;
        $videosCount = $videos ? count($videos) : 0;
        $counts = $videosCount + $imagesCount;

        if (!$counts) {
            return false;
        }

        $tagsString = ' ';

        if ($tags) {
            foreach ($tags as $tag) {
                $tagsString = $tagsString.'%23'.RequestsTrait::formatTags($tag).' ';
            }
        }

        $object['caption'] = $object['caption'].$tagsString;

        if ($counts == 1) {
            $object['creation_id'] = $this->postSingleMedia($igUser, $object, $imagesUrls, $videos);
            $checkContainer = $this->checkIfCreationIsReady($object, $object['creation_id'], $videos ? 1 : 0);

            if (!$checkContainer['status']) {
                return $checkContainer;
            }

            return $this->publishContainer($object, $igUser);
        } else {
            if ($imagesUrls) {
                foreach ($imagesUrls as $image) {
                    $images[] = $this->postMediaUrl($igUser, $object['access_token'], $image);
                }
            }

            if ($videos) {
                $videosConatiners = [];
                foreach ($videos as $video) {
                    $videoContainerId = $this->postMediaUrl($igUser, $object['access_token'], $video, 'video');
                    $videosConatiners[] = $videoContainerId;
                    $images[] = $videoContainerId;
                }
            }

            if (isset($videosConatiners) && $videosConatiners) {
                $check = $this->checkMultiplesVideosContainers($object, $videosConatiners);

                if (!$check['status']) {
                    return $check;
                }
            }
            $object['children'] = implode(',', $images);
            $object['media_type'] = 'CAROUSEL';
            $object['creation_id'] = $this->postContainer($object, $igUser);
            unset($object['caption']);
            unset($object['children']);
            if (isset($videosConatiners) && $videosConatiners) {
                $checkContainer = $this->checkIfCreationIsReady($object, $object['creation_id'], 1);

                if (!$checkContainer['status']) {
                    return $checkContainer;
                }
            }

            return $this->publishContainer($object, $igUser);
        }
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
    public function saveInstagramAccount($instagramAccount)
    {
        $id = $instagramAccount['pageId'];
        $relatedAccountId = RequestsTrait::findAccountByUid($instagramAccount['relatedAccountId']) ? RequestsTrait::findAccountByUid($instagramAccount['relatedAccountId'])->id : null;
        $pageinstagramAccountLink = $instagramAccount['accountPictureUrl'] ? $instagramAccount['accountPictureUrl'] : 'https://blog.soat.fr/wp-content/uploads/2016/01/Unknown.png';
        $name = $instagramAccount['pageName'];
        $token = $relatedAccountId ? 'NA' : $instagramAccount['accessToken'];

        $relatedUid = $instagramAccount['relatedAccountId'];

        $page = Account::where('uid', $id)->where('company_id', UserTrait::getCompanyId())->first();

        if (!$page) {
            Account::create([
                        'name' => $name,
                        'provider' => 'instagram',
                        'status' => true,
                        'expiryDate' => date('Y-m-d'),
                        'scoope' => '',
                        'authorities' => '',
                        'link' => '',
                        'company_id' => UserTrait::getCompanyId(),
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

    /**
     * Get Instagram Business Account Information from Business Account ID , IF Not return false.
     */
    public function getInstagramInformationFromBID($businessId, $accessToken)
    {
        if (!$businessId || !$accessToken) {
            return false;
        }

        $url = env('FACEBOOK_ENDPOINT').$businessId.'?fields=name,username,profile_picture_url,biography&access_token='.$accessToken;
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
