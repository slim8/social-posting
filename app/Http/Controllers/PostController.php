<?php

namespace App\Http\Controllers;

use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use App\Models\Post;
use App\Models\ProviderToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    use UserTrait;
    use RequestsTrait;


     /**
     * Get Posts By Account Id.
     */
    public function getPostsByAccountId(Request $request, $id)
    {
        $account = RequestsTrait::findAccountByUid($id, 'id' , 1);

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

        if($response['status']){
            return RequestsTrait::processResponse(true, ["posts" => $response['posts']]);

        } else {
            return RequestsTrait::processResponse(false, ["message" => $response['posts']]);

        }
    }


    /**
     * Get All posts By Criteria.
     */
    public function getPosts(Request $request, int $postId = null)
    {
        $companyId = UserTrait::getCompanyId();
        $postRequest = Post::whereHas('accounts', function ($query) use ($companyId) {
            $query->where('accounts.company_id', $companyId);
        })->with('PostMedia')->with('accounts:id')->with('tags:name');

        // $postId Used to return Single Post Id
        if ($postId) {
            $postRequest = $postRequest->where('id', $postId);
        }

        if ($request->status) {
            $postRequest = $postRequest->where('status', $request->status);
        }

        $postRequest = $postId ? $postRequest->first() : $postRequest->get();

        if ($postRequest) {
            return RequestsTrait::processResponse(true, [$postId ? 'post' : 'posts' => $postRequest]); // if single post return posts else return all Posts
        } else {
            return RequestsTrait::processResponse(false, ['message' => 'No posts found']);
        }
    }

}
