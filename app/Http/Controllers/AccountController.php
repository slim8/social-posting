<?php

namespace App\Http\Controllers;

use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use App\Models\AccountPost;
use App\Models\Mentions;
use App\Models\Post;
use App\Models\PostHashtag;
use App\Models\PostMedia;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    use UserTrait;
    use RequestsTrait;

    /**
     * Disconnect Or Connect Account
     * $action => 0 -> disconnect and 1 -> connect
     * $accountId => Account Id to be changed.
     */
    public function disconnectAccount(Request $request, int $action = null, int $accountId = null)
    {
        if ($action !== 0 && $action !== 1) {
            return RequestsTrait::processResponse(false, ['message' => 'Please specify action 0 for disconnect and 1 for Connect']);
        }

        if (!$accountId) {
            return RequestsTrait::processResponse(false, ['message' => 'Please choose a valid account ID']);
        }

        $userId = UserTrait::getCurrentId();

        $account = Account::where('id', $accountId)->whereHas('providerToken', function ($query) use ($userId) {
            $query->where('provider_tokens.created_by', $userId);
        })->first();

        if (!$account) {
            return RequestsTrait::processResponse(false, ['messsage' => 'Cannot find account']);
        }

        $account->update(['status' => $action]);

        if ($action) {
            $object['message'] = 'Your account has been connected';
        } else {
            $object['message'] = 'Your account has been disconnected';
        }

        return RequestsTrait::processResponse(true, $object);
    }

    /**
     * Action for Delete Account.
     */
    public function deleteAccountAction(int $accountId = null)
    {
        $accountsPosts = AccountPost::where('accountId', $accountId)->get();

        foreach ($accountsPosts as $accountPost) {
            $accountPostId = $accountPost->id;
            $postId = $accountPost->postId;
            array_push($postsIds, $postId);
            PostHashtag::where('accountPostId', $accountPostId)->delete();

            $count = AccountPost::where('postId', $postId)->count();

            if ($count == 1) {
                Mentions::where('postId', $postId)->delete();
                PostMedia::where('postId', $postId)->delete();
                Post::where('id', $postId)->delete();
            }

            AccountPost::where('id', $accountPostId)->delete();
        }

        Account::where('id', $accountId)->delete();

        return true;
    }

    /**
     * delete account and his related informations.
     */
    public function deleteAccount(int $accountId = null)
    {
        $account = RequestsTrait::findAccountByUid($accountId, 'id', 1);

        if (!$account) {
            return RequestsTrait::processResponse(false, ['message' => "You don't have rights to delete this account"]);
        }

        $this->deleteAccountAction($accountId);

        return RequestsTrait::processResponse(true);
    }
}
