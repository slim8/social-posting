<?php

namespace App\Http\Controllers;

use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\Account;
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
}
