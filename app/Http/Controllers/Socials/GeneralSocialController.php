<?php

namespace App\Http\Controllers\Socials;

use App\Http\Controllers\Controller;
use App\Http\Controllers\functions\UtilitiesController;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use App\Models\AccountPost;
use App\Models\Post;
use App\Models\PostMedia;
use App\Models\PostTag;
use App\Models\Tag;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class GeneralSocialController extends Controller
{
    use UserTrait;
    use RequestsTrait;

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
        ]);
        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }
        $images = $request->images;
        $videos = $request->videos;

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
            return response()->json(['success' => false,
            'message' => $validator->message, ], 201);
        }

        foreach ($request->accountIds as $singleAccountId) {
            $account = RequestsTrait::findAccountByUid($singleAccountId, 'id');

            if ($account) {
                $InstagramController = new InstagramController();
                $accountProvider = $account->provider;
                $postResponse = [];
                if ($inc == 0) {
                    $postId = Post::create([
                        'url' => 'url',
                        'message' => $request->message,
                        'video_title' => $request->videoTitle ? $request->videoTitle : '',
                        'status' => true,
                        'publishedAt' => Carbon::now(),
                        'isScheduled' => 0,
                    ]);

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

                    $postResponse = $this->facebookController->postToFacebookMethod($obj, $account->uid, $images, $request->tags, $videos, $request->videoTitle);
                } elseif ($accountProvider == 'instagram') {
                    if ($request->message) {
                        $obj['caption'] = $request->message;
                    }
                    $BusinessIG = $account->uid;

                    $IgAccount = RequestsTrait::findAccountByUid($account->related_account_id, 'id') ? RequestsTrait::findAccountByUid($account->related_account_id, 'id') : null;
                    $obj['access_token'] = $IgAccount ? $IgAccount->accessToken : $account->accessToken;

                    $postResponse = $InstagramController->postToInstagramMethod($obj, $BusinessIG, $images, $request->tags, $videos);
                }

                if ($postResponse['status']) {
                    AccountPost::create([
                        'url' => '',
                        'post_id' => $postId->id,
                        'account_id' => $singleAccountId,
                        'post_id_provider' => $postResponse['id'],
                    ]);
                } else {
                    $errorLog[] = $postResponse['message'];
                }
            } else {
                $errorLog[] = 'Cannot find a cannected account for ID '.$singleAccountId;
            }
        }

        if ($errorLog) {
            return response()->json(['success' => false,
            'message' => $errorLog, ], 201);
        }

        return response()->json(['success' => true], 201);
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
                return response()->json(['success' => true,
            'pages' => $AllPages, ], 201);
            } else {
                return response()->json(['success' => false,
            'message' => 'No Accounts Found', ], 201);
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
        $tokenKey = $this->facebookController->generateLongLifeToken($request->accessToken, $facebookUserId)->token;

        $AllPages = $this->facebookController->getAccountPagesAccount($facebookUserId, $tokenKey, 1);

        if ($AllPages) {
            return response()->json(['success' => true,
        'pages' => $AllPages, ], 201);
        } else {
            return response()->json(['success' => false,
        'pages' => $AllPages, ], 201);
        }
    }

    /**
     * Autorize Facebook Pages and Isntagram Accounts ( Save to Database).
     */
    public function saveMetaPagesAndGroups(Request $request)
    {
        $jsonPageList = $request->json('pages');

        $AllPages = [];

        $actualCompanyId = UserTrait::getCompanyId();

        if ($jsonPageList) {
            foreach ($jsonPageList as $providerAccount) {
                $provider = $providerAccount['provider'];
                if ($provider == 'facebook') {
                    $this->facebookController->savePage($providerAccount);
                } else {
                    $this->instagramController->saveInstagramAccount($providerAccount);
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
}
