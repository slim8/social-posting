<?php

namespace App\Http\Controllers\Socials;

use App\Http\Controllers\Controller;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class FacebookController extends Controller
{
    use UserTrait;

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
        $facebookAppKey = env('FACEBOOK_APP_ID');
        $facebookSecretKey = env('FACEBOOK_SECRET_KEY');
        $response = Http::get('https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id='.$facebookAppKey.'&fb_exchange_token='.$tokenKey.'&client_secret='.$facebookSecretKey);

        return response()->json(['success' => true,
        'long_life_access_token' => $response->json('access_token'), ], 201);
    }

    /**
     * Return UID account from ID.
     */
    public function getProviderTokenByid($id)
    {
        return $this->getAccountObjectById($id)->accessToken;
    }

    /**
     * Return Account Object By ID.
     */
    public function getAccountObjectById($id)
    {
        $account = Account::where('id', $id)->where('company_id', UserTrait::getCompanyId())->first();

        if (!$account) {
            return false;
        }

        return $account;
    }

    /**
     * Return UID account from ID.
     */
    public function getUidAccountById($id)
    {
        return $this->getAccountObjectById($id)->uid;
    }

    public function postPicture($pageId, $token, $url)
    {
        // code...
        $response = Http::post(env('FACEBOOK_ENDPOINT').$pageId.'/photos?access_token='.$token.'&url='.$url.'&published=false');

        // return $response->json('data')['url'];
        return $response->json('id');
    }

    /**
     * post to facebook from Route.
     */
    public function postToFacebook(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'accountIds' => 'required',
            'message' => 'string|max:255',
        ]);
        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }

        foreach ($request->accountIds as $singleAccountId) {
            $account = $this->getAccountObjectById($singleAccountId);
            $accessToken = $account->accessToken;
            $pageId = $account->uid;

            $obj['access_token'] = $accessToken;

            $images = [];
            if ($request->message) {
                $obj['message'] = $request->message;
            }

            if ($request->images) {
                foreach ($request->images as $image) {
                    $images[] = ['media_fbid' => $this->postPicture($pageId, $accessToken, $image)];
                }
                $obj['attached_media'] = json_encode($images);
            }

            $client = new Client();
            $res = $client->request('POST', env('FACEBOOK_ENDPOINT').$pageId.'/feed', [
            'form_params' => $obj,
        ]);
        }
    }

    /**
     * Return All facebook pages by Company ID.
     */
    public function getPagesByCompanyId($companyId)
    {
        $AllPages = [];

        foreach (DB::table('accounts')->where('company_id', $companyId)->where('provider', 'facebook')->where('providerType', 'page')->where('status', 1)->orderBy('id')->lazy() as $account) {
            $id = $account->id;
            $uid = $account->uid;
            $pageFacebookPageLink = $account->profilePicture;
            $category = $account->category;
            $name = $account->name;
            $AllPages[] = ['id' => $id, 'pageId' => $uid, 'pagePictureUrl' => $pageFacebookPageLink, 'category' => $category,  'pageName' => $name];
        }

        return $AllPages;
    }

    /**
     * Return All facebook pages for current user for ROUTES.
     */
    public function getAllPagesByCompanyId()
    {
        $actualCompanyId = Auth::user()->company_id;

        return $this->getSavedPagefromDataBaseByCompanyId($actualCompanyId, 1);
    }

    public function getSavedPagefromDataBaseByCompanyId($companyId, int $returnJson = 0)
    {
        $AllPages = $this->getPagesByCompanyId($companyId);

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
    public function savePagesList(Request $request)
    {
        $jsonPageList = $request->json('pages');

        $AllPages = [];

        $actualCompanyId = Auth::user()->company_id;

        // dd($actualCompanyId);

        if ($jsonPageList) {
            foreach ($jsonPageList as $facebookPage) {
                $id = $facebookPage['pageId'];
                $pageFacebookPageLink = $facebookPage['pagePictureUrl'];
                $pageToken = $facebookPage['pageToken'];
                $category = $facebookPage['category'];
                $name = $facebookPage['pageName'];

                $page = Account::where('uid', $id)->first();

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
                    ]);
                }
            }

            $Pages = $this->getSavedPagefromDataBaseByCompanyId($actualCompanyId);

            return response()->json(['success' => true,
        'pages' => $Pages, ], 201);
        } else {
            return response()->json(['success' => false,
        'message' => 'No page autorized', ], 201);
        }
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

        $tokenKey = $request->accessToken;
        $facebookUserId = $request->id;

        $AllPages = [];

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
                $AllPages[] = ['pageId' => $id, 'pagePictureUrl' => $pageFacebookPageLink, 'pageToken' => $pageToken, 'category' => $category,  'pageName' => $name];
            }

            return response()->json(['success' => true,
        'pages' => $AllPages, ], 201);
        } else {
            return response()->json(['success' => false,
        'pages' => $AllPages, ], 201);
        }
    }
}
