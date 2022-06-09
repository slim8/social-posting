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
    protected $utilitiesController;

    public function __construct()
    {
        $this->facebookController = new FacebookController();
        $this->utilitiesController = new UtilitiesController();
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
        $userId = UserTrait::getCurrentAdminId();
        $accounts = ProviderToken::where('created_by', $userId)->get();
        foreach ($accounts as $account) {
            $now = strtotime(date('Y-m-d'));

            $expiry = strtotime('-5 days', strtotime($account->expiryDate));
            array_push($response, ['mustBeRefreshed' => (!UserTrait::getUserObject()->autoRefresh && $expiry < $now), 'provider' => $account->provider, 'providerId' => $account->accountUserId, 'profileName' => $account->profile_name, 'userName' => $account->user_name, 'tokenExpireOn' => $this->utilitiesController->differenceBetweenDates($account->expiryDate), 'isConnected' => ($account->longLifeToken === Account::$STATUS_DISCONNECTED) ? false : true]);
        }

        if ($response) {
            return RequestsTrait::processResponse(true, ['accounts' => $response]);
        } else {
            return RequestsTrait::processResponse(false, ['message' => 'No account autorized']);
        }
    }

    public function refreshToken(Request $request)
    {
        $providerAcounts = ProviderToken::where('longLifeToken', 'not like', '%'.Account::$STATUS_DISCONNECTED.'%')->where('provider', 'facebook')->get();
        if ($providerAcounts) {
            $now = strtotime(date('Y-m-d'));
            foreach ($providerAcounts as $providerAcount) {
                $expiry = strtotime('-3 days', strtotime($providerAcount->expiryDate));

                if ($expiry == $now) {
                    $tokenKey = $this->facebookController->generateLongLifeToken($providerAcount->longLifeToken, $providerAcount->accountUserId, $providerAcount->created_by)->token;
                    $facebookResponse = $this->facebookController->getAccountPagesAccount($providerAcount->accountUserId, $tokenKey, 1, 1);
                    FacebookService::ReconnectOrRefrech($facebookResponse['SelectedPages'], $providerAcount->id, 1);
                }
            }
        }

        return RequestsTrait::processResponse(true);
    }
}
