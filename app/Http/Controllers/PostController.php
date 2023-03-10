<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Functions\UtilitiesController;
use App\Http\Controllers\Socials\FacebookController;
use App\Http\Controllers\Socials\InstagramController;
use App\Models\Account;
use App\Models\AccountPost;
use App\Models\Hashtag;
use App\Models\Mentions;
use App\Models\Post;
use App\Models\PostHashtag;
use App\Models\PostMedia;
use App\Models\User;
use App\Models\UsersAccounts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    protected $facebookController;
    protected $instagramController;
    protected $utilitiesController;
    protected $traitController;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->traitController = new TraitController();
        $this->facebookController = new FacebookController();
        $this->instagramController = new InstagramController();
        $this->utilitiesController = new UtilitiesController();
    }

    /**
     * Get Posts By Account Id.
     */
    public function getPostsByAccountId(Request $request, $id)
    {
        $account = $this->traitController->findAccountByUid($id, 'id', 1);

        if ($account) {
            Log::channel('info')->info('User : '.$this->traitController->getCurrentId().' has requests all posts of account : '.$id);
            $posts = [];
            $accountPosts = AccountPost::whereHas('account', function ($query) use ($id) {
                $query->where('accounts.id', $id);
            })->with('accounts')->orderby('id', 'DESC')->get();

            foreach ($accountPosts as $accountPost) {
                $accountPost->provider = $accountPost->accounts[0]->provider;
                unset($accountPost->accounts);
                $accountPost->postMedia = PostMedia::where('postId', $accountPost->id)->get();
                $accountPost->post = Post::where('id', $accountPost->postId)->first();
                $accountPost->hashtags = $this->getHashTagByPostOrAccountId($accountPost->id);
                $posts[] = $accountPost;

                // get stats about post
                if ($accountPost->provider == 'facebook') {
                    $accountPost->stats = $this->facebookController->getStatisticsByPost($accountPost->id);
                } elseif ($accountPost->provider == 'instagram') {
                    $accountPost->stats = $this->instagramController->getStatisticsByPost($accountPost->id);
                }
            }

            if (count($accountPosts) > 0) {
                $response['status'] = true;
                $response['posts'] = $posts;
            } else {
                $response['status'] = false;
                $response['errorMessage'] = 'This Account has not any POSTS';
            }
        } else {
            Log::channel('info')->notice('User : '.$this->traitController->getCurrentId().' has requests all posts of account : '.$id.' but no account found ');
            $response['status'] = false;
            $response['errorMessage'] = 'No Account found with id '.$id;
        }

        if ($response['status']) {
            return $this->traitController->processResponse(true, ['posts' => $response['posts']]);
        } else {
            return $this->traitController->processResponse(false, ['message' => $response['errorMessage']]);
        }
    }

    /**
     * Return tags by Account Post ID.
     */
    public function getHashTagByPostOrAccountId($id)
    {
        $tags = [];
        $postTags = PostHashtag::where('accountPostId', $id)->get();
        foreach ($postTags as $postTag) {
            $tags[] = Hashtag::where('id', $postTag->hashtagId)->first('name');
        }

        return $tags;
    }

    /**
     * Get All posts By Criteria.
     */
    public function getPosts(Request $request, int $postId = null)
    {
        $companyId = $this->traitController->getCompanyId();
        // filterBy is used to filter Posts using AcountsPosts
        $filterByAccounts = $request->filterBy === 'AccountsPosts' ? true : false;

        $getStat = ($request->getStat == true && $filterByAccounts) ? true : false;
        // If FilterBy Accounts then Get POsts using AccountPost else Get Posts Normally
        $postRequest = $filterByAccounts ? AccountPost::whereHas('account', function ($query) use ($companyId) {
            $query->where('accounts.companyId', $companyId)->where('accounts.status', 1);
        })->with('accounts') :
            Post::whereHas('accounts', function ($query) use ($companyId) {
                $query->where('accounts.companyId', $companyId)->where('accounts.status', 1);
            });

        // $postId Used to return Single Post Id

        if ($postId) {
            $postRequest = $postRequest->where('id', $postId);
        }
        // To filter by status PUBLISH or DRAFT
        if ($request->status) {
            $postRequest = $filterByAccounts ? $postRequest->whereHas('post', function ($query) use ($request) {
                $query->where('posts.status', $request->status);
            }) : $postRequest->where('status', $request->status);
        }

        // to Limit the request ny number of records
        if ($request->limit) {
            $postRequest = $postRequest->limit($request->limit);
        }

        $postRequest = $postRequest->orderBy('id', 'DESC')->get();

        $posts = $postId ? null : [];
        foreach ($postRequest as $postContent) {
            $postContent->postMedia = PostMedia::where('postId', $filterByAccounts ? $postContent->postId : $postContent->id)->with('mentions')->get();

            if ($filterByAccounts) {
                $postContent->provider = $postContent->accounts[0]->provider;
                unset($postContent->accounts);
                $postContent->hashtags = $this->getHashTagByPostOrAccountId($postContent->id);
                $account = Account::where('id', $postContent->accountId)->first();
                $post = Post::where('id', $postContent->postId)->first();
                $user = User::where('id', $post->createdBy)->first();
                // $user->firstName . ' ' . $user->lastName
                $postContent['createdBy'] = $user->firstName . ' ' . $user->lastName;
                $postContent['accountName'] = $account->name;
                $postContent['profilePicture'] = $account->profilePicture;
                $postContent['isScheduled'] = Post::where('id', $postContent->postId)->first()->isScheduled;
            } else {
                $subPosts = [];
                $subPostsAccounts = AccountPost::where('postId', $filterByAccounts ? $postContent->postId : $postContent->id)->get();
                // Append Tags and provider to Sub accounts

                foreach ($subPostsAccounts as $subPost) {
                    $subPost->provider = $this->traitController->findAccountByUid($subPost->accountId, 'id', 1)->provider;

                    $subPost->hashtags = $this->getHashTagByPostOrAccountId($subPost->id);
                    $subPosts[] = $subPost;
                }
                $postContent->subPosts = $subPosts;
            }

            if ($getStat) {
                if ($postContent->provider == 'facebook') {
                    $postContent->stats = $this->facebookController->getStatisticsByPost($postContent->id);
                } elseif ($postContent->provider == 'instagram') {
                    $postContent->stats = $this->instagramController->getStatisticsByPost($postContent->id);
                }
            }

            if ($postId) {
                $posts = $postContent;
            } else {
                $posts[] = $postContent;
            }
        }

        if ($posts) {
            return $this->traitController->processResponse(true, [$postId ? 'post' : 'posts' => $posts]); // if single post return posts else return all Posts
        } else {
            return $this->traitController->processResponse(false, ['message' => 'No posts found Or some account are disconnected']);
        }
    }

    /**
     * Delete Drafts By Ids.
     */
    public function deleteDraft(Request $request)
    {
        $errorLog = [];
        if (!$request->postsIds) {
            return $this->traitController->processResponse(false, ['No Draft Sent']);
        }

        if (gettype($request->postsIds) !== 'array') {
            return $this->traitController->processResponse(false, ['Draft post musrt be array']);
        }

        $isCompanyAdmin = $this->traitController->getUserObject()->hasRole('companyadmin') ? true : false;
        $userCompanyId = $this->traitController->getUserObject()->companyId;
        foreach (array_unique($request->postsIds) as $postId) {
            $currentPost = Post::where('id', $postId)->first();

            if(!$currentPost){
                $errMesage = 'Post '.$postId.' Not Found';
                $errorLog = $errMesage;
                Log::channel('notice')->notice('User : '.$this->traitController->getCurrentId().' Try To delete Draft : '.$errMesage);
                continue;
            }

            $isDraft = $currentPost->status === 'DRAFT';
            $createdBy = $currentPost->createdBy;
            $postCompany = User::where('id', $createdBy)->first()->companyId;

            if ($currentPost->deletedAt) {
                $errMesage = 'Post '.$postId.' Not Found';
                $errorLog = $errMesage;
                Log::channel('notice')->notice('User : '.$this->traitController->getCurrentId().' Try To delete Draft : '.$errMesage);
            }

            if (!$isDraft) {
                $errMesage = 'Post '.$postId.' Could not be deleted because is not DRAFT';
                $errorLog[] =$errMesage;
                Log::channel('notice')->notice('User : '.$this->traitController->getCurrentId().' Try To delete Draft : '.$errMesage);
            }
            if ($isCompanyAdmin && $postCompany !== $userCompanyId) {
                $errMesage = "You don't have right to delete Post ".$postId;
                $errorLog[] =$errMesage;
                Log::channel('notice')->notice('User : '.$this->traitController->getCurrentId().' Try To delete Draft : '.$errMesage);
            }
            if (!$isCompanyAdmin && $createdBy !== $this->traitController->getCurrentId()) {
                $errMesage = "You don't have right to delete Post ".$postId;
                $errorLog[] =$errMesage;
                Log::channel('notice')->notice('User : '.$this->traitController->getCurrentId().' Try To delete Draft : '.$errMesage);
            }
        }

        if ($errorLog) {

            return $this->traitController->processResponse(false, ['errors' => $errorLog]);
        }

        foreach ($request->postsIds as $postId) {
            $this->deletePostById($postId);
        }

        return $this->traitController->processResponse(true);
    }

    /**
     * Delete Post By Id.
     */
    public function deletePostById($postId)
    {
        Mentions::where('postId', $postId)->delete();
        PostMedia::where('postId', $postId)->delete();
        $accountPosts = AccountPost::where('postId', $postId)->get();

        if ($accountPosts) {
            foreach ($accountPosts as $accountPost) {
                $accountPostId = $accountPost->id;
                PostHashtag::where('accountPostId', $accountPostId)->delete();
                AccountPost::where('postId', $postId)->delete();
            }
        }
        Log::channel('info')->info('User : '.$this->traitController->getCurrentId().' delete Draft Post Id: '.$postId);
        Post::where('id', $postId)->delete();
        return true;
    }

    /**
     * Publish Draft Post By Id.
     */
    public function publishPostById($postId)
    {
        $errorLog = [];
        $globalResponse = [];
        $publishedPosts = 0;
        $errorPosts = 0;
        // Start Generate PostMedia , Mentions and Video
        $postIds = [];
        $images = [];
        $videos = [];
        $mentions = [];
        $postObject = Post::where('id', $postId)->first();
        $postImage = PostMedia::where('type', 'image')->where('postId', $postId)->get();
        $postVideo = PostMedia::where('type', 'video')->where('postId', $postId)->get();
        $accountPost = AccountPost::where('postId', $postId)->first();

        if ($postVideo) {
            foreach ($postVideo as $video) {
                $videoObject = [];
                $videoObject['url'] = $video->url;
                $videoObject['seconde'] = $accountPost->thumbnailSeconde;
                $videoObject['thumbnail'] = $accountPost->thumbnailLink;
                $videos[] = $videoObject;
            }
        }

        if ($postImage) {
            $incImage = 0;
            foreach ($postImage as $image) {
                $mediaMentions = Mentions::where('postId', $postId)->where('postMediaId', $image->id)->get();
                if ($mediaMentions) {
                    foreach ($mediaMentions as $mediaMention) {
                        $mentions[] = ['image' => $incImage, 'username' => $mediaMention->username, 'x' => $mediaMention->posX, 'y' => $mediaMention->posY];
                    }
                }
                $images[] = $image->url;
                ++$incImage;
            }
        }
        // End Generate PostMedia , Mentions and Video

        // Get Account Posts
        $accountsPost = AccountPost::where('postId', $postId)->get();

        foreach ($accountsPost as $accountPost) {
            $postIds[] = $accountPost->accountId;
        }

        // Post validator will be updated
        $validator = $this->utilitiesController->postValidator($postIds, $images, $videos);

        if (!$validator->status) {
            return $this->traitController->processResponse(false, ['message' => $validator->message]);
        }

        // Generate Posts Account To be Posted to Social Meida

        foreach ($accountsPost as $accountPost) {
            $hashtags = [];
            $obj = [];
            $currentAccountId = $accountPost->accountId;
            $currentAccountObject = Account::where('id', $currentAccountId)->first();
            $currentaccountPostId = $accountPost->id;
            $accounPermission = $this->traitController->getUserObject()->hasRole('companyadmin') || UsersAccounts::hasAccountPermission($this->traitController->getCurrentId(), $currentAccountId) ? true : false;

            if ($accounPermission) {
                $localisation = null;
                $accountProvider = $currentAccountObject->provider;
                $postResponse = [];

                // Start Generate Hashtags
                $postsHashTags = PostHashtag::where('accountPostId', $currentaccountPostId)->get();
                if ($postsHashTags) {
                    foreach ($postsHashTags as $postTags) {
                        $hashtagObject = Hashtag::where('id', $postTags->hashtagId)->first();
                        $hashtags[] = $hashtagObject->name;
                    }
                }
                // End Generate Hashtags

                $message = $postObject->message;
                if ($accountProvider == 'facebook') {
                    $obj['message'] = $message;
                    if ($accountPost->message) {
                        $obj['message'] = $accountPost->message;
                    }
                    $obj['access_token'] = $currentAccountObject->accessToken;

                    $postResponse = $this->facebookController->postToFacebookMethod($obj, $currentAccountObject->uid, $images, $hashtags, $videos, $accountPost->videoTitle);
                } elseif ($accountProvider == 'instagram') {
                    $obj['caption'] = $message;
                    if ($accountPost->message) {
                        $obj['caption'] = $accountPost->message;
                    }
                    $BusinessIG = $currentAccountObject->uid;
                    $obj['access_token'] = $this->instagramController->getAccessToken($currentAccountObject->id);
                    $postResponse = $this->instagramController->postToInstagramMethod($obj, $BusinessIG, $images, $hashtags, $videos, $localisation, $mentions);
                }

                if (gettype($postResponse) == 'array' && $postResponse['status']) {
                    ++$publishedPosts;
                    $accountPost->update(['url' => $postResponse['url'], 'postIdProvider' => $postResponse['id']]);
                } else {
                    ++$errorPosts;
                    $accountPost->update(['url' => 'ERROR', 'postIdProvider' => 'ERROR']);
                    $errorLog[] = $postResponse['message'];
                }
            }
        }

        if ($publishedPosts > 0 && $errorPosts == 0) {
            $postObject->update(['status' => 'PUBLISH']);
        } elseif ($publishedPosts > 0 && $errorPosts > 0) {
            $postObject->update(['status' => 'PUBLISH']);
            $globalResponse['reportMessage'] = 'Only '.$errorPosts.' posts has not been posted ('.$publishedPosts.' Posts has been published)';
        } elseif ($publishedPosts == 0 && $errorPosts > 0) {
            $globalResponse['reportMessage'] = 'All Posts has not been posted';
        } else {
            $globalResponse['reportMessage'] = 'All Posts has  been posted';
        }
        $globalResponse['publishedPosts'] = $publishedPosts;
        $globalResponse['errorPosts'] = $errorPosts;

        if ($errorLog) {
            $globalResponse['errorLog'] = $errorLog;
        }

        return $globalResponse;
    }

    /**
     * Check and PublishDrafts.
     */
    public function publishDraft(int $postId = 0)
    {
        $publishStatus = [];
        $errorLog = [];
        if (!$postId) {
            return $this->traitController->processResponse(false, ['No Draft Sent']);
        }

        $isCompanyAdmin = $this->traitController->getUserObject()->hasRole('companyadmin') ? true : false;
        $userCompanyId = $this->traitController->getUserObject()->companyId;

        $currentPost = Post::where('id', $postId)->first();

        $isDraft = $currentPost->status === 'DRAFT';
        $createdBy = $currentPost->createdBy;
        $postCompany = User::where('id', $createdBy)->first()->companyId;

        if ($currentPost->deletedAt) {
            $errorLog = 'Post '.$postId.' Not Found';
        }
        if (!$isDraft) {
            $errorLog[] = 'Post '.$postId.' Could not be published because is not DRAFT';
        }
        if ($isCompanyAdmin && $postCompany !== $userCompanyId) {
            $errorLog[] = "You don't have right to published Post ".$postId;
        }
        if (!$isCompanyAdmin && $createdBy !== $this->traitController->getCurrentId()) {
            $errorLog[] = "You don't have right to published Post ".$postId;
        }

        if ($errorLog) {
            return $this->traitController->processResponse(false, ['errors' => $errorLog]);
        }

        $publishStatus = $this->publishPostById($postId);

        return $this->traitController->processResponse(isset($publishStatus['errorLog']) ? false : true, $publishStatus);
    }
}
