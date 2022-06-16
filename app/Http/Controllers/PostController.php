<?php

namespace App\Http\Controllers;

use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use App\Models\AccountPost;
use App\Models\Post;
use App\Models\PostMedia;
use App\Models\PostTag;
use App\Models\Tag;
use Illuminate\Http\Request;

class PostController extends Controller
{
    use UserTrait;
    use RequestsTrait;

    /**
     * Get Posts By Account Id.
     */
    public function getPostsByAccountId(Request $request, $id)
    {
        $account = RequestsTrait::findAccountByUid($id, 'id', 1);

        if ($account) {
            $res = Post::whereHas('accounts', function ($query) use ($id) {
                $query->where('accounts.id', $id);
            })->with('PostMedia')->with('tags:name')->get();

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

        if ($response['status']) {
            return RequestsTrait::processResponse(true, ['posts' => $response['posts']]);
        } else {
            return RequestsTrait::processResponse(false, ['message' => $response['posts']]);
        }
    }

    /**
     * Return tags by Account Post ID
     */
    public function getHshTagByPostOrAccountId($id)
    {
        $tags = [];
        $postTags = PostTag::where('accountPostId', $id)->get();
        foreach ($postTags as $postTag) {
            $tags[] = Tag::where('id', $postTag->tagId)->first('name');
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

        // If FilterBy Accounts then Get POsts using AccountPost else Get Posts Normally
        $postRequest = $filterByAccounts ? AccountPost::whereHas('account', function ($query) use ($companyId) {
            $query->where('accounts.companyId', $companyId);
        })->with('accounts') :
                    Post::whereHas('accounts', function ($query) use ($companyId) {
                        $query->where('accounts.companyId', $companyId);
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
                $postContent->hashtags = $this->getHshTagByPostOrAccountId($postContent->id);
            } else {
                $subPosts = [];
                $subPosts = AccountPost::where('postId', $filterByAccounts ? $postContent->postId : $postContent->id)->get();
                // Append Tags and provider to Sub accounts

                foreach ($subPosts as $subPost) {
                    $subPost->provider = RequestsTrait::findAccountByUid($subPost->accountId, 'id', 1)->provider;
                    $subPost->hashtags = $this->getHshTagByPostOrAccountId($subPost->id);
                    $subPosts[] = $subPost;
                }
                $postContent->subPosts = $subPosts;
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
            return RequestsTrait::processResponse(false, ['message' => 'No posts found']);
        }
    }
}
