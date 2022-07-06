<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Socials\FacebookController;
use App\Http\Controllers\Socials\InstagramController;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use App\Models\AccountPost;
use App\Models\Hashtag;
use App\Models\Post;
use App\Models\PostHashtag;
use App\Models\PostMedia;
use Illuminate\Http\Request;

class PostController extends Controller
{
    use UserTrait;
    use RequestsTrait;

    protected $facebookController;
    protected $instagramController;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->facebookController = new FacebookController();
        $this->instagramController = new InstagramController();
    }

    /**
     * Get Posts By Account Id.
     */
    public function getPostsByAccountId(Request $request, $id)
    {
        $account = RequestsTrait::findAccountByUid($id, 'id', 1);

        if ($account) {
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
            $response['status'] = false;
            $response['errorMessage'] = 'No Account found with id '.$id;
        }

        if ($response['status']) {
            return RequestsTrait::processResponse(true, ['posts' => $response['posts']]);
        } else {
            return RequestsTrait::processResponse(false, ['message' => $response['errorMessage']]);
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
        $companyId = UserTrait::getCompanyId();
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
            $postContent->postMedia = PostMedia::where('postId', $filterByAccounts ? $postContent->postId : $postContent->id)->get();

            if ($filterByAccounts) {
                $postContent->provider = $postContent->accounts[0]->provider;
                unset($postContent->accounts);
                $postContent->hashtags = $this->getHashTagByPostOrAccountId($postContent->id);
            } else {
                $subPosts = [];
                $subPostsAccounts = AccountPost::where('postId', $filterByAccounts ? $postContent->postId : $postContent->id)->get();
                // Append Tags and provider to Sub accounts

                foreach ($subPostsAccounts as $subPost) {
                    $subPost->provider = RequestsTrait::findAccountByUid($subPost->accountId, 'id', 1)->provider;

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
            return RequestsTrait::processResponse(true, [$postId ? 'post' : 'posts' => $posts]); // if single post return posts else return all Posts
        } else {
            return RequestsTrait::processResponse(false, ['message' => 'No posts found Or some account are disconnected']);
        }
    }
}
