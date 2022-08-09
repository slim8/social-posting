<?php

namespace App\Http\Controllers\Socials;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Functions\UtilitiesController;
use App\Http\Controllers\TraitController;
use App\Http\Traits\Services\FacebookService;
use App\Models\Account;
use App\Models\AccountPost;
use App\Models\Hashtag;
use App\Models\Mentions;
use App\Models\Post;
use App\Models\PostHashtag;
use App\Models\PostMedia;
use App\Models\ProviderToken;
use App\Models\UsersAccounts;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class GeneralSocialController extends Controller
{
    protected $utilitiesController;
    protected $facebookController;
    protected $instagramController;
    protected $traitController;
    protected $facebookService;

    public function __construct()
    {
        $this->utilitiesController = new UtilitiesController();
        $this->facebookController = new FacebookController();
        $this->instagramController = new InstagramController();
        $this->traitController = new TraitController();
        $this->facebookService = new FacebookService();
    }

    public function sendToPost(Request $request)
    {
        $errorLog = [];
        $inc = 0;
        $validator = Validator::make($request->all(), [
            'posts' => 'required',
            'status' => 'string|max:255',
        ]);
        if ($validator->fails()) {
            if(!$request->posts){
                $errorLog['accounts'][] = "The Account field is required.";
            }
            if(!$request->status){
                $errorLog['status'][] = "The Status field is required.";
            }
            Log::channel('notice')->notice('[sendToPost] User : '.$this->traitController->getCurrentId().' Try To create a new post with Invalid Request');
            //return response(['errors' => $validator->errors()->all()], 422);
            return $this->traitController->processResponse(false , ["errors" => $errorLog]);
        }

        $images = $request->images;
        $videos = $request->videos;
        $statusPost = $request->status;
        $requestPostId = $request->originalId && $request->originalId !== null && $request->originalId !== 'null' ? $request->originalId : null;

        // Check if post status is DRAFT
        if ($requestPostId) {
            if (Post::where('id', $requestPostId)->where('status', POST::$STATUS_PUBLISH)->first()) {
                Log::channel('notice')->notice('[sendToPost] User : '.$this->traitController->getCurrentId().' Try To edit a Published post Id '.$requestPostId);
                $error["errors"][] = 'This Post Is Published and cannot be Updated Or Published';
                return $this->traitController->processResponse(false, ['errors' => $error]);
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

        // Add Images And video Cleaner
        $images = $this->utilitiesController->cleanMediaArray($images, 'image');
        $videos = $this->utilitiesController->cleanMediaArray($videos, 'image');

        // Generate Array with AccountIds to test
        $postIds = [];
        foreach ($request->posts as $postJson) {
            $post = json_decode($postJson, true);
            $postIds[] = $post['accountId'];
        }

        // Post validator will be updated
        $validator = $this->utilitiesController->postValidator($postIds, $images, $videos);

        if (!$validator->status) {
            Log::channel('exception')->notice('[sendToPost] User Id : '.$this->traitController->getCurrentId().' ==> '.$validator->messageString);
            return $this->traitController->processResponse(false, ['errors' => $validator->message]);
        }

        if ($requestPostId) {
            // Delete All Saved Account Posts
            AccountPost::where('postId', $requestPostId)->delete();
        }
        foreach ($request->posts as $postJson) {
            $post = json_decode($postJson, true);

            $videoThunb = [];

            $mentions = [];
            if ($request->mentions) {
                $mentions = $request->mentions;
                $mentions = json_decode($mentions, true);
            }

            $account = $this->traitController->findAccountByUid($post['accountId'], 'id', 1);  // $singleAccountId
            // $accounPermission To check if User Has permission to post to Account
            $accounPermission = $this->traitController->getUserObject()->hasRole('companyadmin') || UsersAccounts::hasAccountPermission($this->traitController->getCurrentId(), $post['accountId']) ? true : false;

            if ($account && $accounPermission) {
                if ($requestPostId) {
                    // Delete All Saved hashtags
                    PostHashtag::where('accountPostId', $account->id)->delete();
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
                        'createdBy' => $this->traitController->getCurrentId(),
                        'isScheduled' => 0,
                    ];
                    if (!$requestPostId) {
                        $postId = Post::create($postObject);
                    } else {
                        $postId = Post::where('id', $requestPostId)->update($postObject);
                        $postId = Post::where('id', $requestPostId)->first();
                        // Delete All Saved Post Media
                        Mentions::where('postId', $postId->id)->delete();
                        PostMedia::where('postId', $postId->id)->delete();
                    }

                    if ($images) {
                        $imgInc = 0;
                        foreach ($images as $image) {
                            $postMedia = PostMedia::create([
                                'url' => $image,
                                'postId' => $postId->id,
                                'type' => 'image',
                            ]);

                            // Save Mentions to database
                            if ($mentions) {
                                foreach ($mentions as $mention) {
                                    if ($mention['image'] == $imgInc) {
                                        Mentions::create([
                                            'postMediaId' => $postMedia->id,
                                            'username' => $mention['username'],
                                            'postId' => $postId->id,
                                            'posX' => $mention['x'],
                                            'posY' => $mention['y'],
                                            'provider' => 'instagram',
                                            'companyId' => $this->traitController->getCompanyId(),
                                        ]);
                                    }
                                }
                            }

                            ++$imgInc;
                        }
                    }

                    if ($videos) {
                        // $videoCounter = 0;
                        foreach ($videos as $video) {
                            $video = json_decode($video, true);

                            // if ($videoCounter == 0) {
                                $videoThunb = $video;

                                // var_dump($videoThunb);
                                // die;
                            // }
                            // ++$videoCounter;

                            PostMedia::create([
                                'url' => $video['url'],
                                'postId' => $postId->id,
                                'type' => 'video',
                                'thumbnailSeconde' => isset($videoThunb["seconde"]) ? $videoThunb["seconde"] : null,
                                'thumbnailLink' => isset($videoThunb["thumbnail"]) ? $videoThunb["thumbnail"] : null,
                                'thumbnailRessource' => 'file',
                            ]);
                        }
                    }
                }
                ++$inc;
                $localisation = null;

                $message = $post['message'];
                if ($accountProvider == 'facebook') {
                    if ($message) {
                        $obj['message'] = $message;
                    }
                    $obj['access_token'] = $account->accessToken;
                    Log::channel('facebook')->info('[sendToPost] User Id : '.$this->traitController->getCurrentId().' Try to post To facebook Uid :'.$account->uid.' with account Id '.$account->id.' Post Id : '.$postId);
                    $postResponse = ($statusPost == POST::$STATUS_PUBLISH) ? $this->facebookController->postToFacebookMethod($obj, $account->uid, $images, $post['hashtags'], $videos, $post['videoTitle']) : POST::$STATUS_DRAFT;
                } elseif ($accountProvider == 'instagram') {
                    if ($message) {
                        $obj['caption'] = $message;
                    }
                    $BusinessIG = $account->uid;
                    $obj['access_token'] = $this->instagramController->getAccessToken($account->id);
                    Log::channel('instagram')->info('[sendToPost] User Id : '.$this->traitController->getCurrentId().' Try to post To Instagaram Uid :'.$BusinessIG.' with account Id '.$account->id.' Post Id : '.$postId);
                    $postResponse = ($statusPost == POST::$STATUS_PUBLISH) ? $InstagramController->postToInstagramMethod($obj, $BusinessIG, $images, $post['hashtags'], $videos, $localisation, $mentions) : POST::$STATUS_DRAFT;
                }

                if ((gettype($postResponse) == 'array' && $postResponse['status']) || $statusPost == POST::$STATUS_DRAFT) {
                    $postProviderId = (gettype($postResponse) == 'array' && $postResponse['id']) ? $postResponse['id'] : $postResponse;

                    $accountPost = AccountPost::create([
                        'url' => POST::$STATUS_DRAFT == $statusPost ? 'DRAFT' : $postResponse['url'],
                        'message' => $message,
                        'postId' => $postId->id,
                        'videoTitle' => $post['videoTitle'] ? $post['videoTitle'] : '',
                        // 'thumbnailSeconde' => isset($videoThunb['seconde']) ? $videoThunb['seconde'] : null,
                        // 'thumbnailLink' => isset($videoThunb['thumbnail']) ? $videoThunb['thumbnail'] : null,
                        // 'thumbnailRessource' => isset($videoThunb['seconde']) ? ($videoThunb['seconde'] > 0 ? 'seconde' : 'file') : null,
                        'accountId' => $post['accountId'],
                        'postIdProvider' => $postProviderId,
                        'localisationText' => null,
                        'localisationRessource' => null,
                    ]);

                    if ($post['hashtags']) {
                        foreach ($post['hashtags'] as $hashtag) {
                            $hashtag = $this->traitController->formatTags($hashtag);
                            $hashtagId = Hashtag::where('name', $hashtag)->first();

                            if (!$hashtagId) {
                                $hashtagId = Hashtag::create([
                                    'name' => $hashtag,
                                    'companyId' => $this->traitController->getCompanyId(),
                                ]);
                            }

                            PostHashtag::create([
                                'hashtagId' => $hashtagId->id,
                                'accountPostId' => $accountPost->id,
                            ]);
                        }
                    }
                } else {
                    Log::channel('facebook')->error('[sendToPost] User : '.$this->traitController->getCurrentId().' ==> Message : '.$postResponse['message']);
                    $errorLog["others"][]  = $postResponse['message'];
                }
            } else {
                $messageError = 'Cannot find a connected account Or permissions denied for ID  '.$post['accountId'];
                $errorLog["accounts"][] = $messageError;
                Log::channel('notice')->notice('[sendToPost] User : '.$this->traitController->getCurrentId().' ==> Message : '.$messageError);
            }
        }

        if ($errorLog) {
            return $this->traitController->processResponse(false, ['errors' => $errorLog]);
        }
        Log::channel('info')->info('[sendToPost] User : '.$this->traitController->getCurrentId().' create or edit post : '.$postId->id.' successfuly');

        return $this->traitController->processResponse(true);
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
        $AllPages = $this->traitController->getAllAccountsFromDB();

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
     * Get All facebook accounst.
     */
    public function getAccountPagesAccount($facebookUserId, $tokenKey)
    {
        $facebookUri = envValue('FACEBOOK_ENDPOINT').$facebookUserId.'/accounts?access_token='.$tokenKey;

        $response = Http::get($facebookUri);

        $jsonPageList = $response->json('data');

        $AllPages = [];

        if ($jsonPageList) {
            foreach ($jsonPageList as $facebookPage) {
                $id = $facebookPage['id'];
                $pageFacebookPageLink = $this->facebookService->getPagePicture($id);
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

    public function getAllAccountsByCompanyId(int $accountId = null)
    {
        return $this->getSavedAccountsFromDataBaseByCompanyId(1, $accountId = $accountId);
    }

    /**
     * Return saved accounts from data base.
     */
    public function getSavedAccountsFromDataBaseByCompanyId(int $returnJson = 0, int $accountId = null)
    {
        $AllPages = $this->traitController->getAllAccountsFromDB($accountId);
        Log::channel('info')->info('User :'.$this->traitController->getCurrentId().' has request all accounts from database');
        if ($returnJson) {
            if ($AllPages) {
                return $this->traitController->processResponse(true, [$accountId ? 'page' : 'pages' => $AllPages]);
            } else {
                return $this->traitController->processResponse(false, ['message' => 'No Accounts Found']);
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

        $facebookUserObject = $this->facebookController->getFacebookPersonalInformations($request->accessToken);
        $providerToken = ProviderToken::where('longLifeToken', Account::$STATUS_DISCONNECTED)->where('createdBy', $this->traitController->getCurrentId())->where('accountUserId', $facebookUserId)->first();
        $tokenKey = $this->facebookController->generateLongLifeToken($request->accessToken, $facebookUserId)->token;
        $facebookResponse = $this->facebookController->getAccountPagesAccount($facebookUserId, $tokenKey, 1);

        /* Start Reconnect Block */
        if ($providerToken) {
            $this->facebookService->ReconnectOrRefrech($facebookResponse['SelectedPages'], $providerToken->id);
            Log::channel('facebook')->info('User : '.$this->traitController->getCurrentId().' Try to reconnect Facebook user : '.$facebookUserId);

            return $this->traitController->processResponse(true, ['message' => 'Your account and his sub pages has been Re-connected']);
        } else {
            Log::channel('facebook')->info('User : '.$this->traitController->getCurrentId().' Try to add Facebook user : '.$facebookUserId);
        }

        /* End  Reconnect Block */
        if ($facebookResponse['AllPages']) {
            Log::channel('facebook')->info('User : '.$this->traitController->getCurrentId().' fetch his pages from Facebook user : '.$facebookUserId);

            return $this->traitController->processResponse(true, ['pages' => $facebookResponse['AllPages'] , 'accountName' => $facebookUserObject["name"]]);
        } else {
            return $this->traitController->processResponse(true, ['message' => 'No unauthorized accounts found']);
        }
    }

    /**
     * Autorize Facebook Pages and Isntagram Accounts ( Save to Database).
     */
    public function saveMetaPagesAndGroups(Request $request)
    {
        $jsonPageList = $request->json('pages');
        $userUid = $request->json('user');

        if (!$this->traitController->getUniqueProviderTokenByProvider($userUid)) {
            Log::channel('facebook')->notice('User : '.$this->traitController->getCurrentId().'after try to save new facebok pages :  No User Id Found in this Account');

            return $this->traitController->processResponse(false, ['message' => 'No User Id Found in this Account']);
        }

        // Check and return false if userUid not autorized for this action ;
        $AllPages = [];

        $actualCompanyId = $this->traitController->getCompanyId();

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

            return $this->traitController->processResponse(true, ['pages' => $Pages]);
        } else {
            return $this->traitController->processResponse(false, ['message' => 'No page autorized']);
        }
    }

    /**
     * Search Users Mentions by Key.
     */
    public function searchUsers(Request $request)
    {
        $searchQuery = $request->q;
        if (!$searchQuery) {
            return $this->traitController->processResponse(false);
        }

        $mentions = Mentions::where('companyId', $this->traitController->getCompanyId())->where('username', 'like', '%'.$searchQuery.'%')->distinct('username')->get('username');

        if (!$mentions) {
            return $this->traitController->processResponse(false);
        }

        return $this->traitController->processResponse(true, ['mentions' => $mentions]);
    }

    /**
     * Search Tags by Key.
     */
    public function searchTags(Request $request)
    {
        $searchQuery = $request->q;
        if (!$searchQuery) {
            return $this->traitController->processResponse(false);
        }
        $hashtags = Hashtag::where('companyId', $this->traitController->getCompanyId())->where('name', 'like', '%'.str_replace(' ', '_', $searchQuery).'%')->distinct('name')->get('name');

        return $this->traitController->processResponse(count($hashtags) > 0 ? true : false, ['hashtags' => $hashtags]);
    }
}
