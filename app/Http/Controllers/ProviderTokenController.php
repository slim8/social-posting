<?php

namespace App\Http\Controllers;

use App\Http\Controllers\functions\UtilitiesController;
use App\Http\Controllers\Socials\FacebookController;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\Services\FacebookService;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use App\Models\ProviderToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProviderTokenController extends Controller
{
    use UserTrait;
    use FacebookService;
    use RequestsTrait;

    protected $facebookController;
    protected $accountController;
    protected $utilitiesController;

    public function __construct()
    {
        $this->facebookController = new FacebookController();
        $this->utilitiesController = new UtilitiesController();
        $this->accountController = new AccountController();
    }

    /**
     * Disconnect Provider token and his Accounts.
     */
    public function disconnectToken(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }

        $providerToken = UserTrait::getProviderTByProviderUID($request->id);

        if (!$providerToken) {
            return RequestsTrait::processResponse(false, ['message' => 'No Account Found']);
        }

        $id = $providerToken->id;

        $providerToken->longLifeToken = Account::$STATUS_DISCONNECTED;
        $providerToken = $providerToken->update();
        Account::where('providerTokenId', $id)->update(['accessToken' => Account::$STATUS_DISCONNECTED, 'status' => 0]);

        return RequestsTrait::processResponse(true, ['message' => 'Your account has been disconnected']);
    }

    /**
     * Return All Connected Provider Accounts.
     */
    public function getConnectedAccounts(Request $request)
    {
        $response = [];
        $userId = UserTrait::getCurrentId();
        $accounts = ProviderToken::where('createdBy', $userId)->get();
        foreach ($accounts as $account) {
            $now = strtotime(date('Y-m-d'));

            $expiry = strtotime('-5 days', strtotime($account->expiryDate));
            array_push($response, ['mustBeRefreshed' => (!UserTrait::getUserObject()->autoRefresh && $expiry < $now), 'provider' => $account->provider, 'providerId' => $account->accountUserId, 'profileName' => $account->profileName, 'userName' => $account->userName, 'tokenExpireOn' => $this->utilitiesController->differenceBetweenDates($account->expiryDate), 'isConnected' => ($account->longLifeToken === Account::$STATUS_DISCONNECTED) ? false : true]);
        }

        if ($response) {
            return RequestsTrait::processResponse(true, ['accounts' => $response]);
        } else {
            return RequestsTrait::processResponse(false, ['message' => 'No account autorized']);
        }
    }

    /**
     * Refresh Token By Account Id.
     */
    public function refreshTokenForAccount($providerAcount, $now)
    {
        $expiry = strtotime('-3 days', strtotime($providerAcount->expiryDate));

        if ($expiry == $now) {
            $tokenKey = $this->facebookController->generateLongLifeToken($providerAcount->longLifeToken, $providerAcount->accountUserId, $providerAcount->createdBy)->token;
            $facebookResponse = $this->facebookController->getAccountPagesAccount($providerAcount->accountUserId, $tokenKey, 1, 1);
            FacebookService::ReconnectOrRefrech($facebookResponse['SelectedPages'], $providerAcount->id, 1);
        }
    }

    /**
     * Refresh Token. GET without parameters for refresh token all Active Users
     * OR
     * POST /accounts/refreshToken/{FacebookUserId} to refresh token only connected User.
     */
    public function refreshToken(Request $request, int $accountId = null)
    {
        $providerAcounts = ProviderToken::where('longLifeToken', 'not like', '%'.Account::$STATUS_DISCONNECTED.'%')->where('provider', 'facebook');

        if ($accountId) {
            $providerAcounts = $providerAcounts->where('createdBy', UserTrait::getCurrentId())->where('accountUserId', $accountId);
        }
        $providerAcounts = $providerAcounts->get();

        if ($providerAcounts) {
            $now = strtotime(date('Y-m-d'));
            foreach ($providerAcounts as $providerAcount) {
                $this->refreshTokenForAccount($providerAcount, $now); // Function To Refresh Token
            }
        }

        return RequestsTrait::processResponse(true);
    }

    public function deleteToken(int $tokenId)
    {
        $providerAcount = ProviderToken::where('createdBy', UserTrait::getCurrentId())->where('id', $tokenId)->first();

        if (!$providerAcount) {
            return RequestsTrait::processResponse(false, ['message' => "You don't have access right to delete this Account Provider"]);
        }

        $accounts = Account::where('providerTokenId', $tokenId)->get();

        if ($accounts) {
            foreach ($accounts as $account) {
                $this->accountController->deleteAccountAction($account->id);
            }
        }

        ProviderToken::where('id', $tokenId)->delete();

        return RequestsTrait::processResponse(true);
    }
}
