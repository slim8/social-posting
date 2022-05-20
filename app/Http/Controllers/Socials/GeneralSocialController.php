<?php

namespace App\Http\Controllers\Socials;

use App\Http\Controllers\Controller;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class GeneralSocialController extends Controller
{
    use UserTrait;
    use RequestsTrait;

    public function tryToPost(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'accountIds' => 'required',
            'message' => 'string|max:255',
        ]);
        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }
        $request->accountIds = ['4'];

        foreach ($request->accountIds as $singleAccountId) {
            $account = RequestsTrait::findAccountByUid($singleAccountId, 'id');
            $FacebookController = new FacebookController();
            $InstagramController = new InstagramController();
            $accountProvider = $account->provider;

            if ($accountProvider == 'facebook') {
                if ($request->message) {
                    $obj['message'] = $request->message;
                }
                $obj['access_token'] = $account->accessToken;
                $postResponse = $FacebookController->postToFacebookMethod($obj, $account->uid, $request->images, $request->sources);
            } elseif ($accountProvider == 'instagram') {
                if ($request->message) {
                    $obj['caption'] = $request->message;
                }
                $BusinessIG = $account->uid;

                $IgAccount = RequestsTrait::findAccountByUid($account->related_account_id, 'id');
                $obj['access_token'] = $IgAccount->accessToken;
                $postResponse = $InstagramController->postToInstagramMethod($obj, $BusinessIG, $request->images);
            }
        }
    }

    /**
     * post to facebook from Route.
     */
    // public function sentToPost(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'accountIds' => 'required',
    //         'message' => 'string|max:255',
    //     ]);
    //     if ($validator->fails()) {
    //         return response(['errors' => $validator->errors()->all()], 422);
    //     }

    //     dd($request);
    //     foreach ($request->accountIds as $singleAccountId) {
    //         $account = RequestsTrait::findAccountByUid($singleAccountId, 'id');
    //         $FacebookController = new FacebookController();
    //         $InstagramController = new InstagramController();
    //         $accountProvider = $account->provider;

    //         if ($accountProvider == 'facebook') {
    //             if ($request->message) {
    //                 $obj['message'] = $request->message;
    //             }
    //             $obj['access_token'] = $account->accessToken;

    //             $postResponse = $FacebookController->postToFacebookMethod($obj, $account->uid, $request->images);
    //         } elseif ($accountProvider == 'instagram') {
    //             if ($request->message) {
    //                 $obj['caption'] = $request->message;
    //             }
    //             $BusinessIG = $account->uid;

    //             $IgAccount = RequestsTrait::findAccountByUid($account->related_account_id, 'id');
    //             $obj['access_token'] = $IgAccount->accessToken;
    //             $postResponse = $InstagramController->postToInstagramMethod($obj, $BusinessIG, $request->images);
    //         }
    //     }
    // }

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
    public function savePagesList(Request $request)
    {
        $jsonPageList = $request->json('pages');

        $AllPages = [];

        $actualCompanyId = UserTrait::getCompanyId();

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
                        'provider_token_id' => UserTrait::getCurrentProviderId(),
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

    public function getAccountPagesAccount($facebookUserId, $tokenKey)
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
                $AllPages[] = ['pageId' => $id, 'pagePictureUrl' => $pageFacebookPageLink, 'pageToken' => $pageToken, 'category' => $category,  'pageName' => $name];
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
