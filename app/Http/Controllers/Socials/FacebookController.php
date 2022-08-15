<?php

namespace App\Http\Controllers\Socials;

use App\Http\Controllers\Controller;
use App\Http\Controllers\FileController;
use App\Http\Controllers\TraitController;
use App\Http\Traits\Services\FacebookService;
use App\Models\Account;
use App\Models\AccountPost;
use App\Models\ProviderToken;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;

class FacebookController extends Controller
{
    protected $instagramController;
    protected $imageManager;
    protected $facebookService;
    protected $traitController;
    protected $fileController;

    public function __construct()
    {
        $this->facebookService = new FacebookService();
        $this->traitController = new TraitController();
        $this->fileController = new FileController();
        $this->instagramController = new InstagramController();
        $this->imageManager = new ImageManager();
    }

    public function getFacebookPersonalInformations($accessToken)
    {
        $responseObject = [];
        // Add Ahsh Secret key for Production
        $appProf = $this->facebookService->getAppSecretProf($accessToken);
        $response = Http::post(envValue('FACEBOOK_ENDPOINT').'/me?fields=id,name,picture&access_token='.$accessToken.$appProf);
        $responseObject['name'] = $response->json('name');
        $responseObject['picture'] = isset($response->json('picture')['data']) ? $response->json('picture')['data']['url'] : 'https://blog.soat.fr/wp-content/uploads/2016/01/Unknown.png';

        return $responseObject;
    }

    /**
     * Update or Add a new Provider Token.
     */
    public function updateOrReturnProviderIdUser($adminId, $longLifeToken, $accountUserId)
    {
        $account = $this->traitController->getUniqueProviderTokenByProvider($accountUserId, 'facebook', $adminId);

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
                    'profilePicture' => $this->fileController->storeFromLinkToDisk($this->traitController->getCurrentId().$accountUserId.uniqid(),$personalInformation['picture']),
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
        $appProf = $this->facebookService->getAppSecretProf($tokenKey);
        $userObj = $userId ? $userId : $this->traitController->getCurrentId();
        $facebookAppKey = envValue('FACEBOOK_APP_ID');
        $facebookSecretKey = envValue('FACEBOOK_SECRET_KEY');

        $response = Http::get(envValue('FACEBOOK_ENDPOINT').'oauth/access_token?grant_type=fb_exchange_token&client_id='.$facebookAppKey.'&fb_exchange_token='.$tokenKey.'&client_secret='.$facebookSecretKey.$appProf);
        //dd(envValue('FACEBOOK_ENDPOINT').'oauth/access_token?grant_type=fb_exchange_token&client_id='.$facebookAppKey.'&fb_exchange_token='.$tokenKey.'&client_secret='.$facebookSecretKey.$appProf);
        $providerId = $this->updateOrReturnProviderIdUser($userObj, $response->json('access_token'), $facebookUserId);
        $providerObject = new \stdClass();
        $providerObject->id = $providerId;
        $providerObject->token = $response->json('access_token');
        Log::channel('facebook')->info('[generateLongLifeToken] User : '.$this->traitController->getCurrentId().' has generate long life token for facebook account id : '.$facebookUserId);

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

        return $this->traitController->processResponse(true, ['long_life_access_token' => $longLife]);
    }

    /**
     * Return UID account from ID.
     */
    public function getProviderTokenByid($id)
    {
        return $this->traitController->findAccountByUid($id, 'id')->accessToken;
    }

    /**
     * Return UID account from ID.
     */
    public function getUidAccountById($id)
    {
        return $this->traitController->findAccountByUid($id, 'id')->uid;
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
        Log::channel('facebook')->info('[postVideoPublicationFormUrl] User id : '.$this->traitController->getCurrentId().' try to Post Video Publication to facebook page Id : '.$pageId);

        try {
            $response = $client->request('POST', envValue('FACEBOOK_ENDPOINT').$pageId.'/videos', [
                'multipart' => $multiPart,
            ]);

            if ($object['thumb'] && envValue('UPLOAD_PROVIDER') !== 'hoster' && envValue('APP_ENV') == 'local') {
                unlink($object['thumb']);
            }
            if ($response->getStatusCode() == 200) {
                Log::channel('facebook')->info('[postVideoPublicationFormUrl] User id : '.$this->traitController->getCurrentId().' has success  Post Video Publication to facebook page Id : '.$pageId);
                $responseObject['status'] = true;
                $responseObject['id'] = json_decode($response->getBody(), true)['id'];
                $responseObject['url'] = envValue('FACEBOOK_ROOT_LINK').$responseObject['id'];
            } else {
                Log::channel('facebook')->notice('[postVideoPublicationFormUrl] User id : '.$this->traitController->getCurrentId().' cannot  Post Video Publication to facebook page Id : '.$pageId);
                $responseObject['status'] = false;
                $responseObject['message'] = 'to be defined';
            }

            return $responseObject;
        } catch (\Exception $e) {
            Log::channel('facebook')->error('[postVideoPublicationFormUrl] User id : '.$this->traitController->getCurrentId().' try to Post Video Publication to facebook page Id : '.$pageId.' Message ==> '.$e->getMessage());
            Log::channel('exception')->error($e->getMessage());
            $responseObject['status'] = false;
            $responseObject['message'] = $e->getMessage();

            return $responseObject;
        }
    }

    public function postMediaFromUrl($pageId, $token, $url)
    {
        try {
            $response = Http::post(envValue('FACEBOOK_ENDPOINT').$pageId.'/photos?access_token='.$token.'&url='.$url.'&published=false');
            Log::channel('facebook')->info('[postMediaFromUrl] User id : '.$this->traitController->getCurrentId().' has Post media Publication from Url '.$url.'to facebook page Id : '.$pageId);

            return $response->json('id');
        } catch (\Exception $e) {
            Log::channel('facebook')->error('[postMediaFromUrl] User id : '.$this->traitController->getCurrentId().' try to Post Video Publication from Url '.$url.'to facebook page Id : '.$pageId.' Message ==> '.$e->getMessage());
            Log::channel('exception')->error($e->getMessage());

            return $e->getMessage();
        }
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
                $tagsString = $tagsString.'#'.$this->traitController->formatTags($tag).' ';
            }
        }

        $object['message'] = (isset($object['message']) ? $object['message'] : '').$tagsString;

        if ($videos) {
            $videos = gettype($videos[0]) == 'array' ? $videos[0] : json_decode($videos[0], true);
            $object['file_url'] = $videos['url'];
            $object['publihshed'] = true;

            if ($videos['thumbnail'] && envValue('UPLOAD_PROVIDER') !== 'hoster' && envValue('APP_ENV') == 'local') {
                $fileUrl = $videos['thumbnail'];
                $fileUrl = explode('/', $fileUrl)[count(explode('/', $fileUrl)) - 1];
                $temporarFile = Storage::disk('custom-ftp')->get('images/'.$fileUrl);
                $temporarFile = Storage::disk('temporar-video')->put($fileUrl, $temporarFile);
                $temporarFile = Storage::disk('temporar-video')->path($fileUrl);
                $object['thumb'] = $temporarFile;
            } else {
                $object['thumb'] = $videos['thumbnail'];
            }

            $object['description'] = $object['message'];
            if ($videoTitle) {
                $object['title'] = $videoTitle;
            }
            Log::channel('facebook')->info('[postToFacebookMethod] User id : '.$this->traitController->getCurrentId().' try to Post Video Publication from Url '.$videos['url'].'to facebook page Id : '.$pageId);

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

        try {
            $client = new Client();
            $response = $client->request('POST', envValue('FACEBOOK_ENDPOINT').$pageId.'/feed', [
                'form_params' => $object,
            ]);
            if ($response->getStatusCode() == 200) {
                Log::channel('facebook')->info('User Id: '.$this->traitController->getCurrentId().' Has Post a publication to Facebook Account '.$pageId);
                $responseObject['status'] = true;
                $responseObject['id'] = json_decode($response->getBody(), true)['id'];
                $responseObject['url'] = envValue('FACEBOOK_ROOT_LINK').$responseObject['id'];
            } else {
                Log::channel('facebook')->notice('User Id: '.$this->traitController->getCurrentId().' cannot Post a publication to Facebook Account '.$pageId);
                $responseObject['status'] = false;
                $responseObject['message'] = 'to be defined';
            }

            return $responseObject;
        } catch (\Exception $e) {
            Log::channel('facebook')->error('User Id: '.$this->traitController->getCurrentId().' Has Post a publication to Facebook Account '.$pageId.' Message ==>'.$e->getMessage());
            Log::channel('exception')->error($e->getMessage());
            $responseObject['status'] = false;
            $responseObject['message'] = $e->getMessage();

            return $responseObject;
        }
    }

    /**
     * Return All facebook pages for current user for ROUTES.
     */
    public function getAllPagesByCompanyId()
    {
        $actualCompanyId = $this->traitController->getCompanyId();

        return $this->getSavedPagefromDataBaseByCompanyId($actualCompanyId, 1);
    }

    public function getSavedPagefromDataBaseByCompanyId($companyId, int $returnJson = 0)
    {
        $AllPages = $this->traitController->getSavedAccountFromDB();

        if ($returnJson) {
            if ($AllPages) {
                return $this->traitController->processResponse(true, ['pages' => $AllPages]);
            } else {
                return $this->traitController->processResponse(false, ['message' => 'No Facebook Page Found']);
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
        $actualCompanyId = $this->traitController->getCompanyId();

        $id = $facebookPage['pageId'];
        $pageFacebookPageLink = $this->fileController->storeFromLinkToDisk($this->traitController->getCurrentId().$id.uniqid(),$facebookPage['pagePictureUrl']);
        $pageToken = $facebookPage['pageToken'];
        $category = $facebookPage['category'];
        $name = $facebookPage['pageName'];

        $page = Account::where('uid', $id)->where('companyId', $actualCompanyId)->first();

        if (!$page) {
            $account = Account::create([
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
                        'providerTokenId' => $this->traitController->getUniqueProviderTokenByProvider($userUid),
                    ]);
            Log::channel('facebook')->info('User :'.$this->traitController->getCurrentId().' add Page With UID : '.$id.'to his company '.$actualCompanyId.' On local ID ==> '.$account->id);
        }
    }

    public function getAccountPagesAccount($facebookUserId, $tokenKey, int $getInstagramAccount = 0, int $checkWithCompany = null)
    {
        //$tokenKey = 'EAAHVOmc7RxYBAEHzpY0gfp5uJqroHenoiBhUYFDhC2m7uEpX01JgeUphuozWExFP78EoT3AZABZCWlybrb5c7bo62eZByDSeYSdkmVTH0EYJ5ZBlHb3w0qZCgrpZAZBTNVc16xZBPKRRt0EGvZBjEO4EUaKCjluZBpOjEGk5usZCHgMjvELnhcqeRCpP0VgwjCoUwVdhCmg84dIPAhgXF6p5lJGUJ5M2t6RkyoZD';
        $appProf = $this->facebookService->getAppSecretProf($tokenKey);
        $facebookUri = envValue('FACEBOOK_ENDPOINT').(envValue('FACEBOOK_APP_ENV') == 'Production' ? $facebookUserId : $facebookUserId).'/accounts?access_token='.$tokenKey.$appProf;
        dd($facebookUri);
        $response = Http::get($facebookUri);

        $jsonPageList = $response->json('data');

        $AllPages = []; // Used to return Only Non Exist Pages
        $SelectedPages = []; // Used to return all Selected Pages

        if ($jsonPageList) {
            foreach ($jsonPageList as $facebookPage) {
                $id = $facebookPage['id'];
                $pageFacebookPageLink = $this->facebookService->getPagePicture($id);
                $pageToken = $facebookPage['access_token'];
                $category = $facebookPage['category'];
                $name = $facebookPage['name'];

                $checkIfExist = Account::where('uid', $id);

                if (!$checkWithCompany) {
                    $checkIfExist = $checkIfExist->where('company_id', $this->traitController->getCompanyId());
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
                            $checkIfExist = $checkIfExist->where('company_id', $this->traitController->getCompanyId());
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
        $providerObject = $this->traitController->getCurrentProviderObject();

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
            return $this->traitController->processResponse(true, ['pages' => $AllPages]);
        } else {
            return $this->traitController->processResponse(false);
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
        try {
            $request = Http::get(envValue('FACEBOOK_ENDPOINT').$postIdProvider.'/comments?access_token='.$accessToken.'&summary=1');
            $response = $request->json('summary');
            Log::channel('info')->info('User '.$this->traitController->getCurrentId().' get comments counts from '.$postIdProvider);

            return $response['total_count'];
        } catch (\Exception $e) {
            Log::channel('facebook')->error('User '.$this->traitController->getCurrentId().' get comments counts from '.$postIdProvider.' Message ==> '.$e->getMessage());
            Log::channel('exception')->error($e->getMessage());

            return 'NA';
        }
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

        if ($response) {
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
        }

        // End fetching Statistics
        $obj['likes'] = $likes;
        // Get Comment Count
        $obj['comments'] = $this->commentCount($postIdProvider, $accessToken);
        // Get Share Count
        $obj['shares'] = $this->shareCount($postIdProvider, $accessToken);

        return $obj;
    }

    /**
     * Check If Post Exist
    */

    public function checkIfPostIdExist($accountPostId)
    {
        $obj = [];
        $likes = 0;
        $acountPost = AccountPost::where('id', $accountPostId)->first();
        $accessToken = $this->getAccessToken($acountPost->accountId);
        $postIdProvider = $acountPost->postIdProvider;
        $request = Http::get(envValue('FACEBOOK_ENDPOINT').$acountPost->postIdProvider.'/insights?access_token='.$accessToken.'&metric=post_reactions_by_type_total');

        $errors = $request->json('error');
        if(isset($errors)){
            return false;
        }

        return true;
    }
}
