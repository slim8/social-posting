<?php

namespace App\Http\Controllers\Socials;

use App\Http\Controllers\Controller;
use App\Http\Controllers\functions\UtilitiesController;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\Services\FacebookService;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use App\Models\AccountPost;
use App\Models\Post;
use App\Models\PostMedia;
use App\Models\PostTag;
use App\Models\ProviderToken;
use App\Models\Tag;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class GeneralSocialController extends Controller
{
    use UserTrait;
    use RequestsTrait;
    use FacebookService;

    protected $utilitiesController;
    protected $facebookController;
    protected $instagramController;

    public function __construct()
    {
        $this->utilitiesController = new UtilitiesController();
        $this->facebookController = new FacebookController();
        $this->instagramController = new InstagramController();
    }

    public function sendToPost(Request $request)
    {
        $errorLog = [];
        $inc = 0;
        $validator = Validator::make($request->all(), [
            'accountIds' => 'required',
            'message' => 'string|max:255',
            'status' => 'string|max:255',
        ]);
        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }
        $images = $request->images;
        $videos = $request->videos;
        $statusPost = $request->status;
        $requestPostId = $request->originalId && $request->originalId !== null && $request->originalId !== 'null' ? $request->originalId : null;

        // Check if post status is DRAFT
        if ($requestPostId) {
            if (Post::where('id', $requestPostId)->where('status', POST::$STATUS_PUBLISH)->first()) {
                return RequestsTrait::processResponse(false, ['message' => 'This Post Is Published and cannot be Updated Or Published']);
            }
        }
        if ($request->file('sources')) {
            foreach ($request->file('sources') as $file) {
                $uploadedFile = $this->utilitiesController->uploadFile($file);

                if ($uploadedFile->url) {
                    if ($uploadedFile->type == 'image') {
                        $images[] = $uploadedFile->url;
                    } elseif ($uploadedFile->type == 'video') {
                        $videos[] = $uploadedFile->url;
                    }
                }
            }
        }

        $validator = $this->utilitiesController->postValidator($request->accountIds, $images, $videos);

        if (!$validator->status) {
            return RequestsTrait::processResponse(false, ['message' => $validator->message]);
        }

        foreach ($request->accountIds as $singleAccountId) {
            $account = RequestsTrait::findAccountByUid($singleAccountId, 'id', 1);

            if ($account) {
                $InstagramController = new InstagramController();
                $accountProvider = $account->provider;
                $postResponse = [];
                if ($inc == 0) {
                    $postObject = [
                        'url' => 'url',
                        'message' => $request->message,
                        'video_title' => $request->videoTitle ? $request->videoTitle : '',
                        'status' => $request->status,
                        'publishedAt' => Carbon::now(),
                        'created_by' => UserTrait::getCurrentAdminId(),
                        'isScheduled' => 0,
                    ];
                    if (!$requestPostId) {
                        $postId = Post::create($postObject);
                    } else {
                        $postId = Post::where('id', $requestPostId)->update($postObject);
                        $postId = Post::where('id', $requestPostId)->first();

                        // Delete All Saved Account Posts , Post tags and Post Media
                        PostTag::where('post_id' , $postId->id)->delete();
                        PostMedia::where('post_id' , $postId->id)->delete();
                        AccountPost::where('post_id' , $postId->id)->delete();
                    }
                    if ($request->tags) {
                        foreach ($request->tags as $tag) {
                            $tagId = Tag::create([
                                'name' => RequestsTrait::formatTags($tag),
                            ]);

                            PostTag::create([
                                'post_id' => $postId->id,
                                'tag_id' => $tagId->id,
                            ]);
                        }
                    }

                    if ($images) {
                        foreach ($images as $image) {
                            PostMedia::create([
                                'url' => $image,
                                'post_id' => $postId->id,
                                'type' => 'image',
                            ]);
                        }
                    }

                    if ($videos) {
                        foreach ($videos as $video) {
                            PostMedia::create([
                                'url' => $video,
                                'post_id' => $postId->id,
                                'type' => 'video',
                            ]);
                        }
                    }
                }
                ++$inc;

                if ($accountProvider == 'facebook') {
                    if ($request->message) {
                        $obj['message'] = $request->message;
                    }
                    $obj['access_token'] = $account->accessToken;

                    $postResponse = ($statusPost == POST::$STATUS_PUBLISH) ? $this->facebookController->postToFacebookMethod($obj, $account->uid, $images, $request->tags, $videos, $request->videoTitle) : POST::$STATUS_DRAFT;
                } elseif ($accountProvider == 'instagram') {
                    if ($request->message) {
                        $obj['caption'] = $request->message;
                    }
                    $BusinessIG = $account->uid;

                    $IgAccount = RequestsTrait::findAccountByUid($account->related_account_id, 'id') ? RequestsTrait::findAccountByUid($account->related_account_id, 'id') : null;
                    $obj['access_token'] = $IgAccount ? $IgAccount->accessToken : $account->accessToken;

                    $postResponse = ($statusPost == POST::$STATUS_PUBLISH) ? $InstagramController->postToInstagramMethod($obj, $BusinessIG, $images, $request->tags, $videos) : POST::$STATUS_DRAFT;
                }

                if ((gettype($postResponse) == 'array' && $postResponse['status']) || $statusPost == POST::$STATUS_DRAFT) {
                    AccountPost::create([
                        'url' => '',
                        'post_id' => $postId->id,
                        'account_id' => $singleAccountId,
                        'post_id_provider' => (gettype($postResponse) == 'array' && $postResponse['id']) ? $postResponse['id'] : $postResponse,
                    ]);
                } else {
                    $errorLog[] = $postResponse['message'];
                }
            } else {
                $errorLog[] = 'Cannot find a connected account for ID '.$singleAccountId;
            }
        }

        if ($errorLog) {
            return RequestsTrait::processResponse(false, ['message' => $errorLog]);
        }

        return RequestsTrait::processResponse(true);
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
        $AllPages = RequestsTrait::getAllAccountsFromDB();

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
     * Get All facebook accounst.
     */
    public function getAccountPagesAccount($facebookUserId, $tokenKey)
    {
        $facebookUri = env('FACEBOOK_ENDPOINT').$facebookUserId.'/accounts?access_token='.$tokenKey;

        $response = Http::get($facebookUri);

        $jsonPageList = $response->json('data');

        $AllPages = [];

        if ($jsonPageList) {
            foreach ($jsonPageList as $facebookPage) {
                $id = $facebookPage['id'];
                $pageFacebookPageLink = FacebookService::getPagePicture($id);
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
            return RequestsTrait::processResponse(true, ['pages' => $AllPages]);
        } else {
            return RequestsTrait::processResponse(false);
        }
    }

    public function getAllAccountsByCompanyId()
    {
        return $this->getSavedAccountsFromDataBaseByCompanyId(1);
    }

    /**
     * Return saved accounts from data base.
     */
    public function getSavedAccountsFromDataBaseByCompanyId(int $returnJson = 0)
    {
        $AllPages = RequestsTrait::getAllAccountsFromDB();

        if ($returnJson) {
            if ($AllPages) {
                return RequestsTrait::processResponse(true, ['pages' => $AllPages]);
            } else {
                return RequestsTrait::processResponse(false, ['message' => 'No Accounts Found']);
            }
        } else {
            return $AllPages;
        }
    }

    /**
     * Return All Pages And Instagram Accounts After Login To facebook.
     */
    public function getMetaPagesAndGroups(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'accessToken' => 'required|string',
            'id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }
        $facebookUserId = $request->id;

        $providerToken = ProviderToken::where('longLifeToken', Account::$STATUS_DISCONNECTED)->where('created_by', UserTrait::getCurrentAdminId())->where('accountUserId', $facebookUserId)->first();
        $tokenKey = $this->facebookController->generateLongLifeToken($request->accessToken, $facebookUserId)->token;
        $facebookResponse = $this->facebookController->getAccountPagesAccount($facebookUserId, $tokenKey, 1);

        /* Start Reconnect Block */
        if ($providerToken) {
            FacebookService::ReconnectOrRefrech($facebookResponse['SelectedPages'], $providerToken->id);

            return RequestsTrait::processResponse(true, ['message' => 'Your account and his sub pages has been Re-connected']);
        }

        /* End  Reconnect Block */
        if ($facebookResponse['AllPages']) {
            return RequestsTrait::processResponse(true, ['pages' => $facebookResponse['AllPages']]);
        } else {
            return RequestsTrait::processResponse(false);
        }
    }

    /**
     * Autorize Facebook Pages and Isntagram Accounts ( Save to Database).
     */
    public function saveMetaPagesAndGroups(Request $request)
    {
        $jsonPageList = $request->json('pages');
        $userUid = $request->json('user');

        if (!UserTrait::getUniqueProviderTokenByProvider($userUid)) {
            return RequestsTrait::processResponse(false, ['message' => 'No User Id Found in this Account']);
        }

        // Check and return false if userUid not autorized for this action ;
        $AllPages = [];

        $actualCompanyId = UserTrait::getCompanyId();

        if ($jsonPageList) {
            foreach ($jsonPageList as $providerAccount) {
                $provider = $providerAccount['provider'];
                if ($provider == 'facebook') {
                    $this->facebookController->savePage($providerAccount, $userUid);
                } else {
                    $this->instagramController->saveInstagramAccount($providerAccount, $userUid);
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
     * Get Posts By Account Id.
     */
    public function getPostsByAccountId(Request $request, $id)
    {
        $account = RequestsTrait::findAccountByUid($id, 'id');

        if ($account) {
            $res = Post::whereHas('accounts', function ($query) use ($id) {
                $query->where('accounts.id', $id);
            })->with('PostMedia')->get();
            if (count($res) > 0) {
                $response['status'] = true;
                $response['posts'] = $res;
            } else {
                $response['status'] = false;
                $response['errorMessage'] = 'This Account has not any POSTS';
            }
        } else {
            $response['status'] = false;
            $response['errorMessage'] = 'No Account found with id '.$id;
        }

        return response()->json($response, 201);
    }

    public function getConnectedAccounts(Request $request)
    {
        $response = [];
        $userId = UserTrait::getCurrentAdminId();
        $accounts = ProviderToken::where('created_by', $userId)->get();
        foreach ($accounts as $account) {
            $now = strtotime(date('Y-m-d'));

            $expiry = strtotime('-5 days', strtotime($account->expiryDate));
            array_push($response, ['mustBeRefreshed' => (!UserTrait::getUserObject()->autoRefresh && $expiry < $now), 'provider' => $account->provider, 'providerId' => $account->accountUserId, 'profileName' => $account->profile_name, 'userName' => $account->user_name, 'tokenExpireOn' => $this->utilitiesController->differenceBetweenDates($account->expiryDate), 'isConnected' => ($account->longLifeToken === 'DISCONNECTED') ? false : true]);
        }

        if ($response) {
            return RequestsTrait::processResponse(true, ['accounts' => $response]);
        } else {
            return RequestsTrait::processResponse(false, ['message' => 'No account autorized']);
        }
    }

    /**
     * Get All posts By Criteria.
     */
    public function getPosts(Request $request)
    {
        $companyId = UserTrait::getCompanyId();
        dd(Post::whereHas('accounts', function ($query) use ($companyId) {
            $query->where('accounts.company_id', $companyId);
        })->with('PostMedia')->get());
        $companyId = UserTrait::getCompanyId();
        $response = Post::whereHas('accounts', function ($query) use ($companyId) {
            $query->where('accounts.company_id', $companyId);
        })->with('PostMedia');

        if ($request->status) {
            $response = $response->where('status', $request->status);
        }
        $response = $response->get();

        if ($response) {
            return RequestsTrait::processResponse(true, ['posts' => $response]);
        } else {
            return RequestsTrait::processResponse(false, ['message' => 'No posts found']);
        }
    }

    public function deleteAccount(Request $request)
    {
        // code...
    }
}
