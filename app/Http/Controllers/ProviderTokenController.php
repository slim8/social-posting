<?php

namespace App\Http\Controllers;

use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\Account;
use App\Models\ProviderToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProviderTokenController extends Controller
{
    use UserTrait;
    use RequestsTrait;

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

        $providerToken->longLifeToken = 'DISCONNECTED';
        $providerToken = $providerToken->update();
        Account::where('provider_token_id', $id)->update(['accessToken' => 'DISCONNECTED' , 'status' => 0]);

        return RequestsTrait::processResponse(true, ['message' => 'Your account has been disconnected']);
    }


    /**
     * Return All Connected Provider Accounts
     */
    public function getConnectedAccounts(Request $request)
    {
        $response = [];
        $userId = UserTrait::getCurrentAdminId();
        $accounts = ProviderToken::where('created_by', $userId)->get();
        foreach ($accounts as $account) {
            $now = strtotime(date('Y-m-d'));

            $expiry = strtotime('-5 days', strtotime($account->expiryDate));
            array_push($response, ['mustBeRefreshed' => (!UserTrait::getUserObject()->autoRefresh && $expiry < $now), 'provider' => $account->provider, 'providerId' => $account->accountUserId, 'profileName' => $account->profile_name, 'userName' => $account->user_name, 'tokenExpireOn' => $this->utilitiesController->differenceBetweenDates($account->expiryDate), 'isConnected' => ($account->longLifeToken === 'DISCONNECTED') ? false : true]);
        }

        if ($response) {
            return RequestsTrait::processResponse(true, ['accounts' => $response]);
        } else {
            return RequestsTrait::processResponse(false, ['message' => 'No account autorized']);
        }
    }
}
