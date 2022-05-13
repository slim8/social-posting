<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Firebase\JWT\JWT;
// use App\Models\User as ModelsUser;
use App\Models\Company;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ApiAuthController extends Controller
{
    public function logout(Request $request)
    {
        $token = $request->user()->token();
        $token->revoke();
        $response = ['message' => 'You have been successfully logged out!'];

        return response($response, 200);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'companyName' => 'required|string|max:255',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'adress' => 'string|max:255',
            'website' => 'string|max:255',
            'email' => 'required|string|email|max:255|unique:users|unique:companies',
            'phoneNumber' => 'required|string|max:255|unique:companies',
            'isSubscriber' => '',
        ], [
           'companyName.required' => 'This is a required message for company name',
        ]);
        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }
        $company = Company::create([
            'name' => $request->companyName,
            'email' => $request->email,
            'phoneNumber' => $request->phoneNumber,
            'adress' => $request->adress,
            'website' => $request->website,
        ]);
        $password = str::random(10);
        $user = User::create([
            'firstName' => $request->firstName,
            'lastName' => $request->lastName,
            'name' => $request->firstName,
            'email' => $request->email,
            'status' => 1,
            'isSubscriber' => $request->isSubscriber,
            'company_id' => $company->id,
            'password' => hash::make($password),
        ]);

        $user->attachRole('admin');

        return response()->json(['success' => true,
        'password' => $password,
        'message' => 'the company and the user has been registred succesfuly ... admin account send to you via '.$request->email, ], 201);
    }


    public function registerUser(Request $request)
    {
        $actualCompanyId = Auth::user()->company_id;

        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'password' => 'required|string|min:6',
            'isSubscriber' => '',
        ], [
           'companyName.required' => 'This is a required message for company name',
        ]);
        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }

        $user = User::create([
            'firstName' => $request->firstName,
            'lastName' => $request->lastName,
            'name' => $request->firstName." ".$request->lastName,
            'email' => $request->email,
            'status' => 1,
            'isSubscriber' => $request->isSubscriber,
            'company_id' => $actualCompanyId,
            'password' => hash::make($request->password),
        ]);

        $user->attachRole('user');

        return response()->json(['success' => true,
        'message' => 'The user has been registred succesfuly ... user account send to you via '.$request->email, ], 201);
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
            if ($user->status) {
                if (Hash::check($request->password, $user->password)) {
                    $token = $user->createToken('Laravel Password Grant Client')->accessToken;
                    $secret_key = env('JWT_SECRET_KEY');
                    $issuer_claim = env('JWT_ISSUER_CLAIMER'); // this can be the servername
                    $audience_claim = env('JWT_AUDIANCE_KLAIMER');
                    $issuedat_claim = time(); // issued at
                    $notbefore_claim = $issuedat_claim + 1; // not before in seconds
                    $expiration_time_env = (int) env('JWT_EXPIRATION_TIME');
                    $expire_claim = $issuedat_claim + $expiration_time_env; // expire time in seconds
                    $token = [
                        'iss' => $issuer_claim,
                        'aud' => $audience_claim,
                        'iat' => $issuedat_claim,
                        'nbf' => $notbefore_claim,
                        'exp' => $expire_claim,
                        'data' => [
                            'id' => $user['id'],
                            'name' => $user['name'],
                            'email' => $user['email'],
                        ],
                    ];

                    $jwt = JWT::encode($token, $secret_key, env('JWT_HASH_ALGORITHME'));

                    return response()->json([
                            'message' => 'Successful login.',
                            'token' => $jwt,
                            'expireAt' => $expire_claim,
                            'success' => true,
                        ], 200);
                } else {
                    $response = ['message' => 'Password mismatch', 'status' => false];

                    return response($response, 422);
                }
            } else {
                $response = ['message' => 'Your account is not activated', 'status' => false];

                return response($response, 422);
            }
        } else {
            $response = ['message' => 'User does not exist', 'status' => false];

            return response($response, 422);
        }
    }
}
