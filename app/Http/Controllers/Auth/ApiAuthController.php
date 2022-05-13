<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
// use App\Models\User as ModelsUser;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
class ApiAuthController extends Controller
{

    public function logout (Request $request) {
        $token = $request->user()->token();
        $token->revoke();
        $response = ['message' => 'You have been successfully logged out!'];
        return response($response, 200);
    }


    public function register (Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);
        if ($validator->fails())
        {
            return response(['errors'=>$validator->errors()->all()], 422);
        }
        $request['password']=Hash::make($request['password']);
        $request['remember_token'] = Str::random(10);
        $user = User::create($request->toArray());
        $token = $user->createToken('Laravel Password Grant Client')->accessToken;
        // $response = ['token' => $token];
        return response()->json(DB::table('personal_access_tokens')->where('id', $token['id'])->first('token'), 200);

    }


    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:6',
        ]);
        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }
        $user = User::where('email', $request->email)->first();
        if ($user) {
            if (Hash::check($request->password, $user->password)) {
                $token = $user->createToken('Laravel Password Grant Client')->accessToken;

                $secret_key  = env('JWT_SECRET_KEY');
                $issuer_claim = env("JWT_ISSUER_CLAIMER");; // this can be the servername
                $audience_claim = env("JWT_AUDIANCE_KLAIMER");;
                $issuedat_claim = time(); // issued at
                $notbefore_claim = $issuedat_claim + 1; //not before in seconds
                $expiration_time_env = (int) env("JWT_EXPIRATION_TIME");
                $expire_claim = $issuedat_claim + $expiration_time_env; // expire time in seconds
                $token = array(
                    "iss" => $issuer_claim,
                    "aud" => $audience_claim,
                    "iat" => $issuedat_claim,
                    "nbf" => $notbefore_claim,
                    "exp" => $expire_claim,
                    "data" => array(
                        "id" => $user["id"],
                        "name" => $user["name"],
                        "email" => $user["email"]
                    )
                );


                $jwt = JWT::encode($token, $secret_key, env("JWT_HASH_ALGORITHME"));
               

                return response()->json(array(
                        "message" => "Successful login.",
                        "token" => $jwt,
                        "expireAt" => $expire_claim,
                        'success' => true
                    ), 200);
            } else {
                $response = ['message' => 'Password mismatch'];

                return response($response, 422);
            }
        } else {
            $response = ['message' => 'User does not exist'];

            return response($response, 422);
        }
    }
}
