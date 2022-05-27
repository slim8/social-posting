<?php

namespace App\Http\Controllers\Socials;

use App\Http\Controllers\Controller;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use App\Models\ProviderToken;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class FacebookController extends Controller
{
    use UserTrait;
    use RequestsTrait;

    protected $instagramController;

    public function __construct()
    {
        $this->instagramController = new InstagramController();
    }

    /**
     * Update or Add a new Provider Token.
     */
    public function updateOrReturnProviderIdUser($adminId, $longLifeToken, $accountUserId)
    {
        $account = UserTrait::getCurrentProviderId();

        if ($account) {
            ProviderToken::whereId($account)->update(['longLifeToken' => $longLifeToken]);

            return $account;
        } else {
            $provider = ProviderToken::create(
                [
                    'expiryDate' => date('Y-m-d', strtotime('+60 days')),
                    'longLifeToken' => $longLifeToken,
                    'created_by' => $adminId,
                    'accountUserId' => $accountUserId,
                ]);

            return $provider->id;
        }
    }

    /**
     * Generate Long Life Token.
     */
    public function generateLongLifeToken($tokenKey, string $facebookUserId = '')
    {
        $facebookAppKey = env('FACEBOOK_APP_ID');
        $facebookSecretKey = env('FACEBOOK_SECRET_KEY');
        $response = Http::get(env('FACEBOOK_ENDPOINT').'oauth/access_token?grant_type=fb_exchange_token&client_id='.$facebookAppKey.'&fb_exchange_token='.$tokenKey.'&client_secret='.$facebookSecretKey);
        $providerId = $this->updateOrReturnProviderIdUser(UserTrait::getCurrentAdminId(), $response->json('access_token'), $facebookUserId);
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

    public function postVideoPublicationFormUrl($pageId, $object)
    {
        $client = new Client();

        // $facebookLinkEndpoint = $type == 'image' ? '/photos?access_token='.$token.'&url='.$url : '/videos?access_token='.$token.'&file_url='.$url;
        // $response = Http::post(env('FACEBOOK_ENDPOINT').$pageId.$facebookLinkEndpoint.'&published=true');

        // return $response->json('id');

        $response = $client->request('POST', env('FACEBOOK_ENDPOINT').$pageId.'/videos', [
            'form_params' => $object,
        ]);

        if ($response->getStatusCode() == 200) {
            $responseObject['status'] = true;
            $responseObject['id'] = json_decode($response->getBody(), true)['id'];
        } else {
            $responseObject['status'] = false;
            $responseObject['message'] = 'to be defined';
        }

        return $responseObject;
    }

    public function postMediaFromUrl($pageId, $token, $url)
    {
        $response = Http::post(env('FACEBOOK_ENDPOINT').$pageId.'/photos?access_token='.$token.'&url='.$url.'&published=false');

        return $response->json('id');
    }

    /**
     * post to facebook from Route.
     */
    public function postToFacebookMethod($object, $pageId, $imagesUrls, $tags, $videos , $videoTitle)
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
            $object['file_url'] = $videos[0];
            $object['publihshed'] = true;
            $object['description'] =  $object['message'];
            if ($videoTitle){
                $object['title'] =  $videoTitle;
            }

            return $this->postVideoPublicationFormUrl($pageId , $object);
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
        $response = $client->request('POST', env('FACEBOOK_ENDPOINT').$pageId.'/feed', [
            'form_params' => $object,
        ]);

        if ($response->getStatusCode() == 200) {
            $responseObject['status'] = true;
            $responseObject['id'] = json_decode($response->getBody(), true)['id'];
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
                return response()->json(['success' => true,
            'pages' => $AllPages, ], 201);
            } else {
                return response()->json(['success' => false,
            'message' => 'No Facebook Page Found', ], 201);
            }
        } else {
            return $AllPages;
        }
    }

    /**
     * Get facebook page picture from Facebook ID.
     */
    public function getPagePicture($pageId)
    {
        $response = Http::get(env('FACEBOOK_ENDPOINT').$pageId.'/picture?redirect=0');

        return $response->json('data')['url'];
    }

    /**
     * Save Facebook List of pages after autorization.
     */
    public function savePage($facebookPage)
    {
        $actualCompanyId = UserTrait::getCompanyId();

        $id = $facebookPage['pageId'];
        $pageFacebookPageLink = $facebookPage['pagePictureUrl'];
        $pageToken = $facebookPage['pageToken'];
        $category = $facebookPage['category'];
        $name = $facebookPage['pageName'];

        $page = Account::where('uid', $id)->where('company_id', $actualCompanyId)->first();

        if (!$page) {
            Account::create([
                        'name' => $name,
                        'provider' => 'facebook',
                        'status' => true,
                        'expiryDate' => date('Y-m-d'),
                        'scoope' => '',
                        'authorities' => '',
                        'link' => '',
                        'company_id' => $actualCompanyId,
                        'uid' => $id,
                        'profilePicture' => $pageFacebookPageLink,
                        'category' => $category,
                        'providerType' => 'page',
                        'accessToken' => $pageToken,
                        'provider_token_id' => UserTrait::getCurrentProviderId(),
                    ]);
        }
    }

    public function getAccountPagesAccount($facebookUserId, $tokenKey, int $getInstagramAccount = 0)
    {
        $facebookUri = env('FACEBOOK_ENDPOINT').$facebookUserId.'/accounts?access_token='.$tokenKey;

        $response = Http::get($facebookUri);

        $jsonPageList = $response->json('data');

        $AllPages = [];

        if ($jsonPageList) {
            foreach ($jsonPageList as $facebookPage) {
                $id = $facebookPage['id'];
                $pageFacebookPageLink = $this->getPagePicture($id);
                $pageToken = $facebookPage['access_token'];
                $category = $facebookPage['category'];
                $name = $facebookPage['name'];

                $checkIfExist = Account::where('uid', $id)->where('company_id', UserTrait::getCompanyId())->first();

                if (!$checkIfExist) {
                    $AllPages[] = ['pageId' => $id, 'type' => 'page', 'provider' => 'facebook', 'pagePictureUrl' => $pageFacebookPageLink, 'pageToken' => $pageToken, 'category' => $category,  'pageName' => $name];
                }

                if ($getInstagramAccount) {
                    $businessAccountId = $this->instagramController->getBusinessAccountId($id, $pageToken);
                    if ($businessAccountId !== false) {
                        $instagramAccount = $this->instagramController->getInstagramInformationFromBID($businessAccountId, $pageToken);

                        $checkIfExist = Account::where('uid', $businessAccountId)->where('company_id', UserTrait::getCompanyId())->first();
                        if (!$checkIfExist) {
                            $AllPages[] = ['type' => 'page', 'provider' => 'instagram', 'accessToken' => $pageToken, 'pageId' => $businessAccountId, 'relatedAccountId' => $id, 'accountPictureUrl' => isset($instagramAccount['profile_picture_url']) ? $instagramAccount['profile_picture_url'] : false,  'pageName' => $instagramAccount['name']];
                        }
                    }
                }
            }
        }

        return $AllPages;
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
            return response()->json(['success' => true,
        'pages' => $AllPages, ], 201);
        } else {
            return response()->json(['success' => false,
        'pages' => $AllPages, ], 201);
        }
    }
}
