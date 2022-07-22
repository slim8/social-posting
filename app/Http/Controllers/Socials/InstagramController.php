<?php

namespace App\Http\Controllers\Socials;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Functions\UtilitiesController;
use App\Http\Controllers\TraitController;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use App\Models\AccountPost;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\FileController;
class InstagramController extends Controller
{
    protected $utilitiesController;
    protected $traitController;
    protected $fileController;

    public function __construct()
    {
        $this->utilitiesController = new UtilitiesController();
        $this->traitController = new TraitController();
        $this->fileController = new FileController();
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
        $response = Http::get(envValue('FACEBOOK_ENDPOINT') . $creationId . '?fields=status,status_code&access_token=' . $object['access_token']);

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
    public function postMediaUrl($igUser, $token, $url, array $mentions = [], int $orderMention = 0, string $type = 'image', int $videoSecondes = 0)
    {
        $responseObject = [];
        $client = new Client();

        $object = [];
        if ($type == 'video') {
            $object['media_type'] = 'VIDEO';
            $object['thumb_offset'] = $videoSecondes;
            $object['video_url'] = $url;
        } else {
            $object['image_url'] = $url;
        }

        $object['access_token'] = $token;
        $object['is_carousel_item'] = true;
        if ($mentions) {
            $object['user_tags'] = [];

            foreach ($mentions as $mention) {
                if ($mention['image'] == $orderMention) {
                    $object['user_tags'][] = ['username' => trim(str_replace('@' , '' , $mention['username'])), 'x' => $mention['x'], 'y' => $mention['y']];
                }
            }
        }

        try {
            $response = $client->request('POST', envValue('FACEBOOK_ENDPOINT') . $igUser . '/media', [
                'multipart' => $this->traitController->prepareMultiPartForm($object),
            ]);


            if ($response->getStatusCode() == 200) {
                Log::channel('instagram')->info('[postMediaUrl] User Id : '.$this->traitController->getCurrentId() . ' Instagram User : '.$igUser.' upload a new Media Id  ==> '.json_decode($response->getBody(), true)['id']);
                if($type == 'image'){
                    $responseObject['status'] = true;
                    $responseObject['id'] = json_decode($response->getBody(), true)['id'];
                    return  $responseObject;
                }
                return json_decode($response->getBody(), true)['id'];
            } else {
                Log::channel('exception')->notice('[postMediaUrl] User Id : '.$this->traitController->getCurrentId() . ' Instagram User : '.$igUser.' Message ==> an error occured');
                if($type == 'image'){
                    $responseObject['status'] = false;
                    $responseObject['message'] = 'an error occured';
                    return  $responseObject;
                }
                return 'an error occured';
            }
         } catch (\Exception $e) {
            Log::channel('instagram')->error('[postMediaUrl] User Id : '.$this->traitController->getCurrentId() . ' Instagram User : '.$igUser.' Message ==> '.$e->getMessage());
            Log::channel('exception')->error($e->getMessage());
            if($type == 'image'){
                $responseObject['status'] = false;
                $responseObject['message'] = $e->getMessage();
                return  $responseObject;
            }
            return $e->getMessage();
         }
    }

    /**
     * Generate publication Public URL.
     */
    public function genPublicUrl($mediaId, $object)
    {
        $parameter = $this->traitController->prepareParameters(['access_token' => $object['access_token'], 'fields' => 'shortcode']);
        $response = Http::get(envValue('FACEBOOK_ENDPOINT') . $mediaId . '?' . $parameter);
        if ($response->json('shortcode')) {
            return envValue('INSTAGRAM_ROOT_LINK') . $response->json('shortcode');
        } else {
            return false;
        }
    }

    /**
     * Generate Container of instagram carrousel.
     */
    public function publishContainer($object, $igUser)
    {
        $parameter = $this->traitController->prepareParameters($object);

        try{
            $response = Http::post(envValue('FACEBOOK_ENDPOINT') . $igUser . '/media_publish?' . $parameter);
            if ($response->json('id')) {
                Log::channel('instagram')->info('[publishContainer] User Id '.$this->traitController->getCurrentId().' has Publish Container : '.$object['creation_id'].' success');
                $responseObject['id'] = $response->json('id');
                $responseObject['status'] = true;
                $responseObject['url'] = $this->genPublicUrl($response->json('id'), $object);
            } else {
                Log::channel('instagram')->notice('[publishContainer] User Id '.$this->traitController->getCurrentId().' has Publish Container : '.$object['creation_id'].' success');
                $responseObject['status'] = false;
                $responseObject['url'] = '';
                $responseObject['message'] = $response->json('error') ? $response->json('error')['error_user_msg'] : 'to be defined';
            }
            return $responseObject;
        }
        catch(\Exception $e){
            Log::channel('instagram')->error('[publishContainer] User Id '.$this->traitController->getCurrentId().' cannot Publish Container : '.$object['creation_id'].' Message => '.$e->getMessage());
            Log::channel('exception')->error($e->getMessage());
            $responseObject['status'] = false;
            $responseObject['url'] = '';
            $responseObject['message'] = $e->getMessage();
            return $responseObject;
        }
    }

    /**
     * Post Single Media to Instagram.
     */
    public function postSingleMedia($igUser, $object, $imagesUrls, $videos, $mentions)
    {
        $responseObject = [];
        $client = new Client();
        $object[$videos ? 'video_url' : 'image_url'] = $videos ? $videos[0] : $imagesUrls[0];

        if ($videos) {
            $object['media_type'] = 'VIDEO';
        }

        if ($mentions) {
            $object['user_tags'] = [];

            foreach ($mentions as $mention) {
                if ($mention['image'] == 0) {
                    $object['user_tags'][] = ['username' => $mention['username'], 'x' => $mention['x'], 'y' => $mention['y']];
                }
            }
        }

        try {
            $response = $client->request('POST', envValue('FACEBOOK_ENDPOINT') . $igUser . '/media', [
                'multipart' => $this->traitController->prepareMultiPartForm($object),
            ]);
            if ($response->getStatusCode() == 200) {
                Log::channel('instagram')->info('[postSingleMedia] User Id : '.$this->traitController->getCurrentId(). 'has posted a new instagram Media to Ig User :'.$igUser);
                $responseObject['status'] = true;
                $responseObject['id'] = json_decode($response->getBody(), true)['id'];
                return $responseObject;
            } else {
                Log::channel('instagram')->notice('[postSingleMedia] User Id : '.$this->traitController->getCurrentId(). 'cannot posted a new instagram Media to Ig User :'.$igUser);
                $responseObject['status'] = false;
                $responseObject['message'] = 'an error occured';
                return $responseObject;
            }

        } catch (\Exception $e) {
            Log::channel('instagram')->error('[postSingleMedia] User Id : '.$this->traitController->getCurrentId(). 'cannot posted a new instagram Media to Ig User :'.$igUser . ' Message ==> '.$e->getMessage());
            Log::channel('exception')->error($e->getMessage());
            $responseObject['status'] = false;
            $responseObject['message'] = $e->getMessage();
            return $responseObject;
        }


    }

    /**
     * Generate Container of instagram carrousel.
     */
    public function postContainer($object, $igUser)
    {
        $parameter = $this->traitController->prepareParameters($object);
        try{
            $response = Http::post(envValue('FACEBOOK_ENDPOINT') . $igUser . '/media?' . $parameter);
            Log::channel('instagram')->info('[postContainer] User Id :'.$this->traitController->getCurrentId().' has post container '.''.' to Ig User : '.$igUser);
            return $response->json('id');
        }
        catch (\Exception $e){
            Log::channel('instagram')->error('[postContainer] User Id :'.$this->traitController->getCurrentId().' cannot post container '.''.' to Ig User : '.$igUser . '  Message ==> '.$e->getMessage());
            Log::channel('exception')->error($e->getMessage());
            return $e->getMessage();
        }
    }

    /**
     * Post to Instagram Method.
     */
    public function postToInstagramMethod($object, $igUser, $imagesUrls, $tags, $videos, string $location = null, array $mentions = [])
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
                $tagsString = $tagsString . '%23' . $this->traitController->formatTags($tag) . ' ';
            }
        }

        $object['caption'] = (isset($object['caption']) ? $object['caption'] : '') . $tagsString;

        if ($counts == 1) {
            if (!$location) {
                $object['location_id'] = $location;
            }

            $singlePostResponse = $this->postSingleMedia($igUser, $object, $imagesUrls, $videos, $mentions);

            if (!$singlePostResponse['status']) {
                return $singlePostResponse;
            }
            $object['creation_id'] = $singlePostResponse['id'];
            unset($object['location_id']);
            $checkContainer = $this->checkIfCreationIsReady($object, $object['creation_id'], $videos ? 1 : 0);

            if (!$checkContainer['status']) {
                return $checkContainer;
            }
            return $this->publishContainer($object, $igUser);
        } else {
            if ($imagesUrls) {
                $incImages = 0;
                foreach ($imagesUrls as $image) {
                    $mediaResponse = $this->postMediaUrl($igUser, $object['access_token'], $image, $mentions, $incImages);
                    if(!$mediaResponse['status']){
                        return $mediaResponse;
                    }
                    $images[] =$mediaResponse['id'];

                    ++$incImages;
                }
            }

            if ($videos) {
                $videosConatiners = [];
                $incImages = 0;
                foreach ($videos as $video) {
                    $videoObj = json_decode($video, true);
                    $video = $videoObj['url'];
                    $videoSecondes = $videoObj['seconde'];
                    $videoContainerId = $this->postMediaUrl($igUser, $object['access_token'], $video, $mentions, $incImages, 'video', $videoSecondes);
                    $videosConatiners[] = $videoContainerId;
                    $images[] = $videoContainerId;
                    ++$incImages;
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
        $AllPages = $this->traitController->getSavedAccountFromDB('instagram');

        if ($returnJson) {
            if ($AllPages) {
                return $this->traitController->processResponse(true, ['pages' => $AllPages]);
            } else {
                return $this->traitController->processResponse(false, ['message' => 'No Instagram Found']);
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
        $relatedAccountId = $this->traitController->findAccountByUid($instagramAccount['relatedAccountId']) ? $this->traitController->findAccountByUid($instagramAccount['relatedAccountId'])->id : null;
        $pageinstagramAccountLink = $instagramAccount['accountPictureUrl'] ?
        $this->fileController->storeFromLinkToDisk($this->traitController->getCurrentId().$id.uniqid(),$instagramAccount['accountPictureUrl']): 'https://blog.soat.fr/wp-content/uploads/2016/01/Unknown.png';
        $name = $instagramAccount['pageName'];
        $token = $relatedAccountId ? 'NA' : $instagramAccount['accessToken'];

        $relatedUid = $instagramAccount['relatedAccountId'];

        $page = Account::where('uid', $id)->where('companyId', $this->traitController->getCompanyId())->first();

        if (!$page) {
            $account = Account::create([
                'name' => $name,
                'provider' => 'instagram',
                'status' => true,
                'expiryDate' => date('Y-m-d'),
                'scoope' => '',
                'authorities' => '',
                'link' => '',
                'companyId' => $this->traitController->getCompanyId(),
                'uid' => $id,
                'profilePicture' => $pageinstagramAccountLink,
                'category' => 'NA',
                'providerType' => 'page',
                'accessToken' => $token,
                'relatedAccountId' => $relatedAccountId,
                'providerTokenId' => $this->traitController->getUniqueProviderTokenByProvider($userUid),
                'relatedUid' => $relatedUid,
            ]);
            Log::channel('instagram')->info('User :'.$this->traitController->getCurrentId().' add Account With UID : '.$id. 'to his company '.$this->traitController->getCompanyId().' On local ID ==> '.$account->id);
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

        $url = envValue('FACEBOOK_ENDPOINT') . $businessId . '?fields=name,username,profile_picture_url,biography&access_token=' . $accessToken;
        $response = Http::get($url);

        return $response->json();
    }

    /**
     * Get Business Id Account from connected Facebook Page ID , If not exist return FALSE.
     */
    public function getBusinessAccountId($pageId, $accessToken)
    {
        $response = Http::get(envValue('FACEBOOK_ENDPOINT') . $pageId . '?fields=instagram_business_account&access_token=' . $accessToken);

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

            return $this->traitController->processResponse(true, ['pages' => $businessAccounts]);
        } else {
            return $this->traitController->processResponse(false, ['pages' => $businessAccounts]);
        }
    }

    /**
     * Get Instagram Access Token.
     */
    public function getAccessToken($id)
    {
        $account = Account::where('id', $id)->first();
        $IgAccount = $this->traitController->findAccountByUid($account->relatedAccountId, 'id') ? $this->traitController->findAccountByUid($account->relatedAccountId, 'id') : null;

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

        try{
            $request = Http::get(envValue('FACEBOOK_ENDPOINT') . $acountPost->postIdProvider . '/insights?access_token=' . $accessToken . '&metric=engagement,impressions,saved');
            $response = $request->json('data');
            Log::channel('instagram')->info('[getStatisticsByPost] User : '.$this->traitController->getCurrentId().' fetch statistics from account '.$accountPostId);
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
        }catch(\Exception $e){
            Log::channel('instagram')->error('[getStatisticsByPost] User : '.$this->traitController->getCurrentId().' fetch statistics from account '.$accountPostId.' Message  ==> '.$e->getMessage());
            Log::channel('exception')->error($e->getMessage());
            $obj['engagement'] = 'NA';
            $obj['impressions'] = 'NA';
            $obj['saves'] = 'NA';
            return $obj;
        }

    }
}
