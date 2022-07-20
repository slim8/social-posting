<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\AccountPost;
use App\Models\Mentions;
use App\Models\Post;
use App\Models\PostHashtag;
use App\Models\PostMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AccountController extends Controller
{
    protected $traitController;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->traitController = new TraitController();
    }

    /**
     * Disconnect Or Connect Account
     * $action => 0 -> disconnect and 1 -> connect
     * $accountId => Account Id to be changed.
     */
    public function disconnectAccount(Request $request, int $action = null, int $accountId = null)
    {
        if ($action !== 0 && $action !== 1) {
            Log::channel('notice')->notice('[disconnectAccount] User : '.$this->traitController->getCurrentId().' Try To Disconnect/Connect Account without Specify Action');

            return $this->traitController->processResponse(false, ['message' => 'Please specify action 0 for disconnect and 1 for Connect']);
        }

        if (!$accountId) {
            Log::channel('notice')->notice('[disconnectAccount] User : '.$this->traitController->getCurrentId().' Try To Disconnect/Connect Account without Account ID');

            return $this->traitController->processResponse(false, ['message' => 'Please choose a valid account ID']);
        }

        $userId = $this->traitController->getCurrentId();

        $account = Account::where('id', $accountId)->whereHas('providerToken', function ($query) use ($userId) {
            $query->where('provider_tokens.created_by', $userId);
        })->first();

        if (!$account) {
            Log::channel('notice')->notice('[disconnectAccount] User : '.$this->traitController->getCurrentId().' Try To Disconnect/Connect Account Id : '.$accountId.' But could not find Account');

            return $this->traitController->processResponse(false, ['messsage' => 'Cannot find account']);
        }

        $account->update(['status' => $action]);

        if ($action) {
            Log::channel('info')->info('[disconnectAccount] User : '.$this->traitController->getCurrentId().' has Connect Account Id : '.$accountId);

            $object['message'] = 'Your account has been connected';
        } else {
            Log::channel('info')->info('[disconnectAccount] User : '.$this->traitController->getCurrentId().' Try To Disconnect Account Id : '.$accountId);
            $object['message'] = 'Your account has been disconnected';
        }

        return $this->traitController->processResponse(true, $object);
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
        Log::channel('info')->info('[deleteAccountAction] User : '.$this->traitController->getCurrentId().' Delete Account Id : '.$accountId.' With hsi Mentions , PostMedia And Posts');
        Account::where('id', $accountId)->delete();

        return true;
    }

    /**
     * delete account and his related informations.
     */
    public function deleteAccount(int $accountId = null)
    {
        $account = $this->traitController->findAccountByUid($accountId, 'id', 1);

        if (!$account) {
            Log::channel('notice')->notice('[deleteAccount] User : '.$this->traitController->getCurrentId().' Try To delete Account :'.$accountId." But he don't have rights to delete this account");

            return $this->traitController->processResponse(false, ['message' => "You don't have rights to delete this account"]);
        }

        $this->deleteAccountAction($accountId);

        return $this->traitController->processResponse(true);
    }
}
