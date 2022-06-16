<?php

namespace App\Http\Controllers\Socials;

use App\Http\Controllers\Controller;
use App\Http\Controllers\functions\UtilitiesController;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\Services\FacebookService;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use App\Models\AccountPost;
use App\Models\Hashtag;
use App\Models\Post;
use App\Models\PostHashtag;
use App\Models\PostMedia;
use App\Models\PostTag;
use App\Models\ProviderToken;
use App\Models\Tag;
use App\Models\UsersAccounts;
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
            'posts' => 'required',
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

        // Post validator will be updated
        // $validator = $this->utilitiesController->postValidator($request->accountIds, $images, $videos);

        // if (!$validator->status) {
        //     return RequestsTrait::processResponse(false, ['message' => $validator->message]);
        // }
        foreach ($request->posts as $postJson) {
            $post = json_decode($postJson, true);
            $account = RequestsTrait::findAccountByUid($post['accountId'], 'id', 1);  // $singleAccountId
            // $accounPermission To check if User Has permission to post to Account
            $accounPermission = UserTrait::getUserObject()->hasRole('companyadmin') || UsersAccounts::hasAccountPermission(UserTrait::getCurrentAdminId(), $post['accountId']) ? true : false;


            if ($account && $accounPermission) {
                if($requestPostId){
                    // Delete All Saved Account Posts and hashtags
                    PostHashtag::where('accountPostId', $account->id)->delete();
                    AccountPost::where('postId', $requestPostId)->delete();
                }

                $InstagramController = new InstagramController();
                $accountProvider = $account->provider;
                $postResponse = [];


                if ($inc == 0) {
                    $postObject = [
                        'url' => 'url',
                        'message' => $request->message,
                        'status' => $request->status,
                        'publishedAt' => Carbon::now(),
                        'createdBy' => UserTrait::getCurrentAdminId(),
                        'isScheduled' => 0,
                    ];
                    if (!$requestPostId) {
                        $postId = Post::create($postObject);
                    } else {
                        $postId = Post::where('id', $requestPostId)->update($postObject);
                        $postId = Post::where('id', $requestPostId)->first();

                        // Delete All Saved Post Media
                        PostMedia::where('postId', $postId->id)->delete();
                    }

                    if ($images) {
                        foreach ($images as $image) {
                            PostMedia::create([
                                'url' => $image,
                                'postId' => $postId->id,
                                'type' => 'image',
                            ]);
                        }
                    }

                    if ($videos) {
                        foreach ($videos as $video) {
                            PostMedia::create([
                                'url' => $video,
                                'postId' => $postId->id,
                                'type' => 'video',
                            ]);
                        }
                    }
                }
                ++$inc;

                $message = $post['message'];
                if ($accountProvider == 'facebook') {
                    if ($message) {
                        $obj['message'] = $message;
                    }
                    $obj['access_token'] = $account->accessToken;

                    $postResponse = ($statusPost == POST::$STATUS_PUBLISH) ? $this->facebookController->postToFacebookMethod($obj, $account->uid, $images, $post['hashtags'], $videos, $post['videoTitle']) : POST::$STATUS_DRAFT;
                } elseif ($accountProvider == 'instagram') {
                    if ($message) {
                        $obj['caption'] = $message;
                    }
                    $BusinessIG = $account->uid;
                    $IgAccount = RequestsTrait::findAccountByUid($account->relatedAccountId, 'id') ? RequestsTrait::findAccountByUid($account->relatedAccountId, 'id') : null;
                    $obj['access_token'] = $IgAccount ? $IgAccount->accessToken : $account->accessToken;

                    $postResponse = ($statusPost == POST::$STATUS_PUBLISH) ? $InstagramController->postToInstagramMethod($obj, $BusinessIG, $images, $post['hashtags'], $videos) : POST::$STATUS_DRAFT;
                }

                if ((gettype($postResponse) == 'array' && $postResponse['status']) || $statusPost == POST::$STATUS_DRAFT) {
                    $accountPost = AccountPost::create([
                        'url' => '',
                        'message' => $message,
                        'postId' => $postId->id,
                        'videoTitle' => $post['videoTitle'] ? $post['videoTitle'] : '',
                        'source' => 'To BE DEFINED', // To DO
                        'thumbnailRessource' => 'To BE DEFINED', // TO DO
                        'accountId' => $post['accountId'],
                        'postIdProvider' => (gettype($postResponse) == 'array' && $postResponse['id']) ? $postResponse['id'] : $postResponse,
                    ]);

                    if ($post['hashtags']) {
                        foreach ($post['hashtags'] as $hashtag) {
                            $hashtagId = Hashtag::where('name' , $hashtag)->first();

                            if (!$hashtagId){
                                $hashtagId = Tag::create([
                                'name' => RequestsTrait::formatTags($hashtag),
                            ]);
                            }

                            PostTag::create([
                                'postId' => 1,
                                'hashtagId' => $hashtagId->id,
                                'accountPostId' =>  $accountPost->id,
                            ]);
                        }
                    }
                } else {
                    $errorLog[] = $postResponse['message'];
                }
            } else {
                $errorLog[] = 'Cannot find a connected account Or permissions denied for ID  '.$post['accountId'];
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

    public function getAllAccountsByCompanyId(int $accountId = null)
    {
        return $this->getSavedAccountsFromDataBaseByCompanyId(1 , $accountId = $accountId);
    }

    /**
     * Return saved accounts from data base.
     */
    public function getSavedAccountsFromDataBaseByCompanyId(int $returnJson = 0 , int $accountId = null)
    {
        $AllPages = RequestsTrait::getAllAccountsFromDB($accountId);

        if ($returnJson) {
            if ($AllPages) {
                return RequestsTrait::processResponse(true, [$accountId ? 'page' : 'pages' => $AllPages]);
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

        $providerToken = ProviderToken::where('longLifeToken', Account::$STATUS_DISCONNECTED)->where('createdBy', UserTrait::getCurrentAdminId())->where('accountUserId', $facebookUserId)->first();
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
            return RequestsTrait::processResponse(true, ['message' => 'No unauthorized accounts found']);
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

            return RequestsTrait::processResponse(true, ['pages' => $Pages]);
        } else {
            return RequestsTrait::processResponse(false, ['message' => 'No page autorized']);
        }
    }

    public function deleteAccount(Request $request)
    {
        // code...
    }
}
