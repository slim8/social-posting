<?php

namespace App\Http\Controllers\Socials;

use App\Http\Controllers\Controller;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\Services\FacebookService;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use App\Models\AccountPost;
use App\Models\ProviderToken;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;

class FacebookController extends Controller
{
    use UserTrait;
    use RequestsTrait;
    use FacebookService;

    protected $instagramController;
    protected $imageManager;

    public function __construct()
    {
        $this->instagramController = new InstagramController();
        $this->imageManager = new ImageManager();
    }

    public function getFacebookPersonalInformations($accessToken)
    {
        $responseObject = [];
        $response = Http::post(envValue('FACEBOOK_ENDPOINT').'/me?fields=id,name&access_token='.$accessToken);
        $responseObject['name'] = $response->json('name');

        return $responseObject;
    }

    /**
     * Update or Add a new Provider Token.
     */
    public function updateOrReturnProviderIdUser($adminId, $longLifeToken, $accountUserId)
    {
        $account = UserTrait::getUniqueProviderTokenByProvider($accountUserId, 'facebook', $adminId);

        $personalInformation = $this->getFacebookPersonalInformations($longLifeToken);

        if ($account) {
            ProviderToken::whereId($account)->update(['longLifeToken' => $longLifeToken]);

            return $account;
        } else {
            $personalInformation = $this->getFacebookPersonalInformations($longLifeToken);
            $provider = ProviderToken::create(
                [
                    'expiryDate' => date('Y-m-d', strtotime('+60 days')),
                    'longLifeToken' => $longLifeToken,
                    'createdBy' => $adminId,
                    'accountUserId' => $accountUserId,
                    'provider' => 'facebook',
                    'profilePicture' => 'picture file',
                    'profileName' => $personalInformation['name'] ? $personalInformation['name'] : '',
                    'userName' => '',
                ]);

            return $provider->id;
        }
    }

    /**
     * Generate Long Life Token.
     */
    public function generateLongLifeToken($tokenKey, string $facebookUserId = '', int $userId = null)
    {
        $userObj = $userId ? $userId : UserTrait::getCurrentId();
        $facebookAppKey = envValue('FACEBOOK_APP_ID');
        $facebookSecretKey = envValue('FACEBOOK_SECRET_KEY');
        $response = Http::get(envValue('FACEBOOK_ENDPOINT').'oauth/access_token?grant_type=fb_exchange_token&client_id='.$facebookAppKey.'&fb_exchange_token='.$tokenKey.'&client_secret='.$facebookSecretKey);
        $providerId = $this->updateOrReturnProviderIdUser($userObj, $response->json('access_token'), $facebookUserId);
        $providerObject = new \stdClass();
        $providerObject->id = $providerId;
        $providerObject->token = $response->json('access_token');

        return $providerObject;
    }

    /**
     * Request Long Life Facebook Token.
     */
    public function getLongLifeToken(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'accessToken' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }

        $tokenKey = $request->accessToken;
        $longLife = $this->generateLongLifeToken($tokenKey)->token;

        return response()->json(['success' => true,
        'long_life_access_token' => $longLife, ], 201);
    }

    /**
     * Return UID account from ID.
     */
    public function getProviderTokenByid($id)
    {
        return RequestsTrait::findAccountByUid($id, 'id')->accessToken;
    }

    /**
     * Return UID account from ID.
     */
    public function getUidAccountById($id)
    {
        return RequestsTrait::findAccountByUid($id, 'id')->uid;
    }

    /**
     * Post Single Video Post from URL.
     */
    public function postVideoPublicationFormUrl($pageId, $object)
    {
        $client = new Client();

        $multiPart = [];

        foreach ($object as $key => $value) {
            array_push($multiPart, ['name' => $key, 'contents' => $key == 'thumb' ? fopen($value, 'rb') : $value]);
        }
        $response = $client->request('POST', envValue('FACEBOOK_ENDPOINT').$pageId.'/videos', [
            'multipart' => $multiPart,
        ]);

        if ($object['thumb']) {
            unlink($object['thumb']);
        }
        if ($response->getStatusCode() == 200) {
            $responseObject['status'] = true;
            $responseObject['id'] = json_decode($response->getBody(), true)['id'];
            $responseObject['url'] = envValue('FACEBOOK_ROOT_LINK').$responseObject['id'];
        } else {
            $responseObject['status'] = false;
            $responseObject['message'] = 'to be defined';
        }

        return $responseObject;
    }

    public function postMediaFromUrl($pageId, $token, $url)
    {
        $response = Http::post(envValue('FACEBOOK_ENDPOINT').$pageId.'/photos?access_token='.$token.'&url='.$url.'&published=false');

        return $response->json('id');
    }

    /**
     * post to facebook from Route.
     */
    public function postToFacebookMethod($object, $pageId, $imagesUrls, $tags, $videos, $videoTitle)
    {
        $images = [];

        $tagsString = ' ';
        if ($tags) {
            foreach ($tags as $tag) {
                $tagsString = $tagsString.'#'.RequestsTrait::formatTags($tag).' ';
            }
        }
        $object['message'] = $object['message'].$tagsString;

        if ($videos) {
            $videos = json_decode($videos[0], true);
            $object['file_url'] = $videos['url'];
            $object['publihshed'] = true;

            if ($videos['thumbnail']) {
                $fileUrl =$videos['thumbnail'];
                $fileUrl = explode('/', $fileUrl)[count(explode('/', $fileUrl)) - 1];
                $temporarFile = Storage::disk('custom-ftp')->get('images/'.$fileUrl);
                $temporarFile = Storage::disk('temporar-video')->put($fileUrl, $temporarFile);
                $temporarFile = Storage::disk('temporar-video')->path($fileUrl);
                $object['thumb'] = $temporarFile;
            }

            $object['description'] = $object['message'];
            if ($videoTitle) {
                $object['title'] = $videoTitle;
            }

            return $this->postVideoPublicationFormUrl($pageId, $object);
        }

        if ($imagesUrls) {
            if ($imagesUrls) {
                foreach ($imagesUrls as $image) {
                    $images[] = ['media_fbid' => $this->postMediaFromUrl($pageId, $object['access_token'], $image)];
                }
            }

            $object['attached_media'] = json_encode($images);
        }

        $client = new Client();
        $response = $client->request('POST', envValue('FACEBOOK_ENDPOINT').$pageId.'/feed', [
            'form_params' => $object,
        ]);

        if ($response->getStatusCode() == 200) {
            $responseObject['status'] = true;
            $responseObject['id'] = json_decode($response->getBody(), true)['id'];
            $responseObject['url'] = envValue('FACEBOOK_ROOT_LINK').$responseObject['id'];
        } else {
            $responseObject['status'] = false;
            $responseObject['message'] = 'to be defined';
        }

        return $responseObject;
    }

    /**
     * Return All facebook pages for current user for ROUTES.
     */
    public function getAllPagesByCompanyId()
    {
        $actualCompanyId = UserTrait::getCompanyId();

        return $this->getSavedPagefromDataBaseByCompanyId($actualCompanyId, 1);
    }

    public function getSavedPagefromDataBaseByCompanyId($companyId, int $returnJson = 0)
    {
        $AllPages = RequestsTrait::getSavedAccountFromDB();

        if ($returnJson) {
            if ($AllPages) {
                return RequestsTrait::processResponse(true, ['pages' => $AllPages]);
            } else {
                return RequestsTrait::processResponse(false, ['message' => 'No Facebook Page Found']);
            }
        } else {
            return $AllPages;
        }
    }

    /**
     * Save Facebook List of pages after autorization.
     */
    public function savePage($facebookPage, $userUid)
    {
        $actualCompanyId = UserTrait::getCompanyId();

        $id = $facebookPage['pageId'];
        $pageFacebookPageLink = $facebookPage['pagePictureUrl'];
        $pageToken = $facebookPage['pageToken'];
        $category = $facebookPage['category'];
        $name = $facebookPage['pageName'];

        $page = Account::where('uid', $id)->where('companyId', $actualCompanyId)->first();

        if (!$page) {
            Account::create([
                        'name' => $name,
                        'provider' => 'facebook',
                        'status' => true,
                        'expiryDate' => date('Y-m-d'),
                        'scoope' => '',
                        'authorities' => '',
                        'link' => '',
                        'companyId' => $actualCompanyId,
                        'uid' => $id,
                        'profilePicture' => $pageFacebookPageLink,
                        'category' => $category,
                        'providerType' => 'page',
                        'accessToken' => $pageToken,
                        'providerTokenId' => UserTrait::getUniqueProviderTokenByProvider($userUid),
                    ]);
        }
    }

    public function getAccountPagesAccount($facebookUserId, $tokenKey, int $getInstagramAccount = 0, int $checkWithCompany = null)
    {
        $facebookUri = envValue('FACEBOOK_ENDPOINT').$facebookUserId.'/accounts?access_token='.$tokenKey;

        $response = Http::get($facebookUri);

        $jsonPageList = $response->json('data');

        $AllPages = []; // Used to return Only Non Exist Pages
        $SelectedPages = []; // Used to return all Selected Pages

        if ($jsonPageList) {
            foreach ($jsonPageList as $facebookPage) {
                $id = $facebookPage['id'];
                $pageFacebookPageLink = FacebookService::getPagePicture($id);
                $pageToken = $facebookPage['access_token'];
                $category = $facebookPage['category'];
                $name = $facebookPage['name'];

                $checkIfExist = Account::where('uid', $id);

                if (!$checkWithCompany) {
                    $checkIfExist = $checkIfExist->where('company_id', UserTrait::getCompanyId());
                }

                $checkIfExist = $checkIfExist->first();

                $pageArraySelected = ['pageId' => $id, 'type' => 'page', 'provider' => 'facebook', 'pagePictureUrl' => $pageFacebookPageLink, 'pageToken' => $pageToken, 'category' => $category,  'pageName' => $name];
                $SelectedPages[] = $pageArraySelected;
                if (!$checkIfExist) {
                    $AllPages[] = $pageArraySelected;
                }

                if ($getInstagramAccount) {
                    $businessAccountId = $this->instagramController->getBusinessAccountId($id, $pageToken);
                    if ($businessAccountId !== false) {
                        $instagramAccount = $this->instagramController->getInstagramInformationFromBID($businessAccountId, $pageToken);

                        $checkIfExist = Account::where('uid', $businessAccountId);

                        if (!$checkWithCompany) {
                            $checkIfExist = $checkIfExist->where('company_id', UserTrait::getCompanyId());
                        }

                        $checkIfExist = $checkIfExist->first();
                        $instagramSelected = ['type' => 'page', 'provider' => 'instagram', 'accessToken' => $pageToken, 'pageId' => $businessAccountId, 'relatedAccountId' => $id, 'accountPictureUrl' => isset($instagramAccount['profile_picture_url']) ? $instagramAccount['profile_picture_url'] : false,  'pageName' => $instagramAccount['name']];
                        if (!$checkIfExist) {
                            $AllPages[] = $instagramSelected;
                        }
                        $SelectedPages[] = $instagramSelected;
                    }
                }
            }
        }

        return ['AllPages' => $AllPages, 'SelectedPages' => $SelectedPages];
    }

    public function getPagesAccountInterne()
    {
        $providerObject = UserTrait::getCurrentProviderObject();

        return $this->getAccountPagesAccount($providerObject->accountUserId, $providerObject->longLifeToken);
    }

    /**
     * Get Facebook pages list from Facebook endpoint for current connected User (Facebook Login).
     */
    public function getPagesList(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'accessToken' => 'required|string',
            'id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }
        $facebookUserId = $request->id;
        $tokenKey = $this->generateLongLifeToken($request->accessToken, $facebookUserId)->token;

        $AllPages = $this->getAccountPagesAccount($facebookUserId, $tokenKey);

        if ($AllPages) {
            return RequestsTrait::processResponse(true, ['pages' => $AllPages]);
        } else {
            return RequestsTrait::processResponse(false);
        }
    }

    /**
     * Get Facebook Access Token.
     */

    /**
     * Get Instagram Access Token.
     */
    public function getAccessToken($id)
    {
        return Account::where('id', $id)->first()->accessToken;
    }

    /**
     * Get Share Count On Object.
     */
    public function shareCount($postIdProvider, $accessToken)
    {
        $request = Http::get(envValue('FACEBOOK_ENDPOINT').$postIdProvider.'?access_token='.$accessToken.'&fields=shares');
        $response = $request->json('shares');

        if (!$response) {
            return 0;
        }

        return $response['count'];
    }

    /**
     * Get Comment Count On Object.
     */
    public function commentCount($postIdProvider, $accessToken)
    {
        $request = Http::get(envValue('FACEBOOK_ENDPOINT').$postIdProvider.'/comments?access_token='.$accessToken.'&summary=1');
        $response = $request->json('summary');

        return $response['total_count'];
    }

    /**
     * Get Statistics of Facebook Publication.
     */
    public function getStatisticsByPost($accountPostId)
    {
        $obj = [];
        $likes = 0;
        $acountPost = AccountPost::where('id', $accountPostId)->first();
        $accessToken = $this->getAccessToken($acountPost->accountId);
        $postIdProvider = $acountPost->postIdProvider;
        $request = Http::get(envValue('FACEBOOK_ENDPOINT').$acountPost->postIdProvider.'/insights?access_token='.$accessToken.'&metric=post_reactions_by_type_total');
        $response = $request->json('data');
        // Start Fetching Statistics
        foreach ($response as $statsData) {
            // Start Fetching Likes
            if ($statsData['name'] == 'post_reactions_by_type_total') {
                foreach ($statsData['values'][0]['value'] as $key => $value) {
                    $value = (int) $value;
                    $likes = $likes + $value;
                }
            }
            // End Fetching Likes
        }

        // End fetching Statistics
        $obj['likes'] = $likes;
        // Get Comment Count
        $obj['comments'] = $this->commentCount($postIdProvider, $accessToken);
        // Get Share Count
        $obj['shares'] = $this->shareCount($postIdProvider, $accessToken);

        return $obj;
    }
}
