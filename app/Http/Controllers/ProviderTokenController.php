<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Functions\UtilitiesController;
use App\Http\Controllers\Socials\FacebookController;
use App\Http\Traits\Services\FacebookService;
use App\Models\Account;
use App\Models\ProviderToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ProviderTokenController extends Controller
{
    protected $facebookController;
    protected $accountController;
    protected $utilitiesController;
    protected $traitController;
    protected $facebookService;

    public function __construct()
    {
        $this->facebookController = new FacebookController();
        $this->utilitiesController = new UtilitiesController();
        $this->accountController = new AccountController();
        $this->traitController = new TraitController();
        $this->facebookService = new FacebookService();
    }

    /**
     * Disconnect Provider Token Action.
     */
    public function disconnectTokenAction($providerId)
    {
        $providerToken = $this->traitController->getProviderTByProviderUID($providerId);

        if (!$providerToken) {
            Log::channel('facebook')->emergency('User : '.$this->traitController->getCurrentId().' Try to Disconnect Token '.$providerToken.' But is not related to company');

            return $this->traitController->processResponse(false, ['message' => 'No Account Found']);
        }

        $id = $providerToken->id;

        $providerToken->longLifeToken = Account::$STATUS_DISCONNECTED;
        $providerToken = $providerToken->update();
        Account::where('providerTokenId', $id)->update(['accessToken' => Account::$STATUS_DISCONNECTED, 'status' => 0]);
        Log::channel('facebook')->info('User : '.$this->traitController->getCurrentId().' Disconnect Token '.$providerToken);

        return true;
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
            Log::channel('exception')->notice('User : '.$this->traitController->getCurrentId().' Try to disconnect tokens without Id [Invalid Request]');

            return response(['errors' => $validator->errors()->all()], 422);
        }

        $this->disconnectTokenAction($request->id);

        return $this->traitController->processResponse(true, ['message' => 'Your account has been disconnected']);
    }

    /**
     * Return All Connected Provider Accounts.
     */
    public function getConnectedAccounts()
    {
        $response = [];
        $userId = $this->traitController->getCurrentId();
        $accounts = ProviderToken::where('createdBy', $userId)->get();
        foreach ($accounts as $account) {
            $now = strtotime(date('Y-m-d'));
            $expiry = strtotime('-5 days', strtotime($account->expiryDate));
            $pictureUrl = $account->profilePicture == 'picture file' ? false : $account->profilePicture;
            array_push($response, ['id' => $account->id,'mustBeRefreshed' => (!$this->traitController->getUserObject()->autoRefresh && $expiry < $now), 'provider' => $account->provider, 'providerId' => $account->accountUserId, 'profileName' => $account->profileName, 'userName' => $account->userName, 'tokenExpireOn' => $this->utilitiesController->differenceBetweenDates($account->expiryDate), 'isConnected' => ($account->longLifeToken === Account::$STATUS_DISCONNECTED) ? false : true , 'createdAt' => $account->createdAt , 'pictureUrl' => $pictureUrl]);
        }
        Log::channel('info')->info('User : '.$userId.' Fetch his Provider token accounts');
        if ($response) {
            return $this->traitController->processResponse(true, ['accounts' => $response]);
        } else {
            return $this->traitController->processResponse(false, ['message' => 'No account autorized']);
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
            $this->facebookService->ReconnectOrRefrech($facebookResponse['SelectedPages'], $providerAcount->id, 1);
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
            $providerAcounts = $providerAcounts->where('createdBy', $this->traitController->getCurrentId())->where('accountUserId', $accountId);
            Log::channel('info')->info('[refreshToken] User '.$this->traitController->getCurrentId().' Try to refresh token of account '.$accountId);
        }
        $providerAcounts = $providerAcounts->get();

        if ($providerAcounts) {
            Log::channel('info')->info('[refreshToken] User '.($this->traitController->getUserObject() ? $this->traitController->getCurrentId() : 'guest').' Try to refresh token for his provider token');
            $now = strtotime(date('Y-m-d'));
            foreach ($providerAcounts as $providerAcount) {
                $this->refreshTokenForAccount($providerAcount, $now); // Function To Refresh Token
            }
        }

        return $this->traitController->processResponse(true);
    }

    /**
     * Delete Token Provider.
     */
    public function deleteToken(int $tokenId)
    {
        $providerAcount = ProviderToken::where('createdBy', $this->traitController->getCurrentId())->where('id', $tokenId)->first();

        if (!$providerAcount) {
            Log::channel('facebook')->emergency('User : '.$this->traitController->getCurrentId().' Try to Delete Token Provider Id : '.$tokenId.' But is not related to company');

            return $this->traitController->processResponse(false, ['message' => "You don't have access right to delete this Account Provider"]);
        }

        $accounts = Account::where('providerTokenId', $tokenId)->orderBy('related_account_id' , 'DESC')->get();
        if ($accounts) {
            foreach ($accounts as $account) {
                $this->accountController->deleteAccountAction($account->id);
            }
        }

        ProviderToken::where('id', $tokenId)->delete();
        Log::channel('facebook')->info('User : '.$this->traitController->getCurrentId().' has deleted Token Provider Id : '.$tokenId);

        return $this->traitController->processResponse(true);
    }

    /**
     * Check Provider Token Availablety Only for facebook With API.
     */
    public function checkSingleProviderToken($accessToken, $uid, $providerTokenId)
    {
        $facebookUri = envValue('FACEBOOK_ENDPOINT').$uid.'/accounts?access_token='.$accessToken;

        $response = Http::get($facebookUri);
        $jsonResponse = $response->json();
        if (isset($jsonResponse['error'])) {
            $providerToken = ProviderToken::where('id', $providerTokenId)->first();
            $providerToken->longLifeToken = Account::$STATUS_DISCONNECTED;
            $providerToken = $providerToken->update();
            Account::where('providerTokenId', $providerTokenId)->update(['accessToken' => Account::$STATUS_DISCONNECTED, 'status' => 0]);
            if (isset($jsonResponse['error']['error_subcode'])) {
                Log::channel('exception')->error($jsonResponse['error']['message']);
                Log::channel('facebook')->error('User '.$this->traitController->getCurrentId().' - Uid : '.$uid.' Provider Token Id : '.$providerTokenId.'try to Login , Message ==> '.$jsonResponse['error']['message']);
            }
        }
    }

    /**
     * Check if Token is Available By Token Id.
     */
    public function checkTokenAvailablity($providerTokenId)
    {
        $providerUid = ProviderToken::where('id', $providerTokenId)->first();
        $newAccount = Account::where('provider_token_id', $providerTokenId)->where('status', 1)->where('accessToken', 'not like', Account::$STATUS_DISCONNECTED)->where('accessToken', 'not like', 'NA')->where('companyId', $this->traitController->getCompanyId())->first();
        $this->checkSingleProviderToken($newAccount->accessToken, $providerUid->accountUserId, $providerTokenId);
    }

    /**
     * Get all Provider Tokens and check if token is availabel.
     */
    public function checkAccountToken()
    {
        $accounts = Account::select(['provider_token_id'])->groupBy('provider_token_id')->where('status', 1)->where('accessToken', 'not like', Account::$STATUS_DISCONNECTED)->where('companyId', $this->traitController->getCompanyId())->whereBetween('provider', ['facebook', 'instagram'])->get();
        foreach ($accounts as $account) {
            $this->checkTokenAvailablity($account->providerTokenId);
        }
    }
}
