<?php

namespace App\Http\Controllers\Socials;

use App\Http\Controllers\Controller;
use App\Http\Controllers\functions\UtilitiesController;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use App\Models\AccountPost;
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
        $response = Http::get(envValue('FACEBOOK_ENDPOINT').$creationId.'?fields=status,status_code&access_token='.$object['access_token']);

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
    public function postMediaUrl($igUser, $token, $url, string $type = 'image', int $videoSecondes = 0)
    {
        $mediaParameters = $type == 'video' ? '&media_type=VIDEO&thumb_offset='.$videoSecondes.'&video_url=' : '&image_url=';
        $response = Http::post(envValue('FACEBOOK_ENDPOINT').$igUser.'/media?access_token='.$token.$mediaParameters.$url.'&is_carousel_item=true');

        if ($response->json('id')) {
            return $response->json('id');
        } else {
            return $response->json('error')['message'];
        }
    }

    /**
     * Generate publication Public URL.
     */
    public function genPublicUrl($mediaId, $object)
    {
        $parameter = RequestsTrait::prepareParameters(['access_token' => $object['access_token'], 'fields' => 'shortcode']);
        $response = Http::get(envValue('FACEBOOK_ENDPOINT').$mediaId.'?'.$parameter);
        if ($response->json('shortcode')) {
            return envValue('INSTAGRAM_ROOT_LINK').$response->json('shortcode');
        } else {
            return false;
        }
    }

    /**
     * Generate Container of instagram carrousel.
     */
    public function publishContainer($object, $igUser)
    {
        $parameter = RequestsTrait::prepareParameters($object);

        $response = Http::post(envValue('FACEBOOK_ENDPOINT').$igUser.'/media_publish?'.$parameter);
        if ($response->json('id')) {
            $responseObject['id'] = $response->json('id');
            $responseObject['status'] = true;
            $responseObject['url'] = $this->genPublicUrl($response->json('id'), $object);
        } else {
            $responseObject['status'] = false;
            $responseObject['url'] = '';
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
        $response = Http::post(envValue('FACEBOOK_ENDPOINT').$igUser.'/media?'.$parameter);

        return $response->json('id');
    }

    /**
     * Generate Container of instagram carrousel.
     */
    public function postContainer($object, $igUser)
    {
        $parameter = RequestsTrait::prepareParameters($object);
        $response = Http::post(envValue('FACEBOOK_ENDPOINT').$igUser.'/media?'.$parameter);

        return $response->json('id');
    }

    /**
     * Post to Instagram Method.
     */
    public function postToInstagramMethod($object, $igUser, $imagesUrls, $tags, $videos, string $location = null)
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
            if (!$location) {
                $object['location_id'] = $location;
            }



            $object['location_id'] = '7640348500';

            $object['creation_id'] = $this->postSingleMedia($igUser, $object, $imagesUrls, $videos);
            unset($object['location_id']);
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
                    $videoObj = json_decode($video, true);
                    $video = $videoObj['url'];
                    $videoSecondes = $videoObj['seconde'];
                    $videoContainerId = $this->postMediaUrl($igUser, $object['access_token'], $video, 'video', $videoSecondes);
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
            if (!$location) {
                $object['location_id'] = $location;
            }
            $object['creation_id'] = $this->postContainer($object, $igUser);
            unset($object['caption']);
            unset($object['location_id']);
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
                return RequestsTrait::processResponse(true, ['pages' => $AllPages]);
            } else {
                return RequestsTrait::processResponse(false, ['message' => 'No Instagram Found']);
            }
        } else {
            return $AllPages;
        }
    }

    /**
     * Save Instagram Accounts.
     */
    public function saveInstagramAccount($instagramAccount, $userUid)
    {
        $id = $instagramAccount['pageId'];
        $relatedAccountId = RequestsTrait::findAccountByUid($instagramAccount['relatedAccountId']) ? RequestsTrait::findAccountByUid($instagramAccount['relatedAccountId'])->id : null;
        $pageinstagramAccountLink = $instagramAccount['accountPictureUrl'] ? $instagramAccount['accountPictureUrl'] : 'https://blog.soat.fr/wp-content/uploads/2016/01/Unknown.png';
        $name = $instagramAccount['pageName'];
        $token = $relatedAccountId ? 'NA' : $instagramAccount['accessToken'];

        $relatedUid = $instagramAccount['relatedAccountId'];

        $page = Account::where('uid', $id)->where('companyId', UserTrait::getCompanyId())->first();

        if (!$page) {
            Account::create([
                        'name' => $name,
                        'provider' => 'instagram',
                        'status' => true,
                        'expiryDate' => date('Y-m-d'),
                        'scoope' => '',
                        'authorities' => '',
                        'link' => '',
                        'companyId' => UserTrait::getCompanyId(),
                        'uid' => $id,
                        'profilePicture' => $pageinstagramAccountLink,
                        'category' => 'NA',
                        'providerType' => 'page',
                        'accessToken' => $token,
                        'relatedAccountId' => $relatedAccountId,
                        'providerTokenId' => UserTrait::getUniqueProviderTokenByProvider($userUid),
                        'relatedUid' => $relatedUid,
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

        $url = envValue('FACEBOOK_ENDPOINT').$businessId.'?fields=name,username,profile_picture_url,biography&access_token='.$accessToken;
        $response = Http::get($url);

        return $response->json();
    }

    /**
     * Get Business Id Account from connected Facebook Page ID , If not exist return FALSE.
     */
    public function getBusinessAccountId($pageId, $accessToken)
    {
        $response = Http::get(envValue('FACEBOOK_ENDPOINT').$pageId.'?fields=instagram_business_account&access_token='.$accessToken);

        if ($response->json('instagram_business_account')) {
            return $response->json('instagram_business_account')['id'];
        } else {
            return false;
        }
    }

    /**
     * Get Instgram account List.
     */
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

            return RequestsTrait::processResponse(true, ['pages' => $businessAccounts]);
        } else {
            return RequestsTrait::processResponse(false, ['pages' => $businessAccounts]);
        }
    }

    /**
     * Get Instagram Access Token.
     */
    public function getAccessToken($id)
    {
        $account = Account::where('id', $id)->first();
        $IgAccount = RequestsTrait::findAccountByUid($account->relatedAccountId, 'id') ? RequestsTrait::findAccountByUid($account->relatedAccountId, 'id') : null;

        return $IgAccount ? $IgAccount->accessToken : $account->accessToken;
    }

    /**
     * Get Statistics of Instgram Publication.
     */
    public function getStatisticsByPost($accountPostId)
    {
        $obj = [];
        $acountPost = AccountPost::where('id', $accountPostId)->first();
        $accessToken = $this->getAccessToken($acountPost->accountId);
        $postIdProvider = $acountPost->postIdProvider;
        $request = Http::get(envValue('FACEBOOK_ENDPOINT').$acountPost->postIdProvider.'/insights?access_token='.$accessToken.'&metric=engagement,impressions,saved');
        $response = $request->json('data');

        // Start Fetching Statistics
        foreach ($response as $statsData) {
            // Start Fetching Engagments ==> Likes + Comments
            if ($statsData['name'] == 'engagement') {
                $obj['engagement'] = $statsData['values'][0]['value'];
            }

            // Start Fetching Impressions
            if ($statsData['name'] == 'impressions') {
                $obj['impressions'] = $statsData['values'][0]['value'];
            }

            // Start Fetching Saved
            if ($statsData['name'] == 'saved') {
                $obj['saves'] = $statsData['values'][0]['value'];
            }
            // End Fetching Likes
        }

        return $obj;
    }
}
