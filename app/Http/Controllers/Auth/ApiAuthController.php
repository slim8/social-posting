<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ProviderTokenController;
use App\Http\Controllers\Repositories\UserRepository;
use App\Http\Controllers\TraitController;
use App\Http\Traits\MailTrait;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ApiAuthController extends Controller
{
    protected $userRepository;
    protected $traitController;

    public function __construct()
    {
        $this->traitController = new TraitController();
        $this->userRepository = new UserRepository();
    }

    /**
     * Api To check if current user is logged in.
     */
    public function checkLoggedIn()
    {
        return response()->json(['success' => true], 201);
    }

    public function logout(Request $request)
    {
        $token = $request->user()->token();
        $token->revoke();
        $response = ['message' => trans('message.logout')];

        return response($response, 200);
    }

    public function register(Request $request)
    {
        // Add Array merge for field phone_number to be validated with Database
        // Request Field name must be like column name on database
        if($request->phoneNumber){
            $request->merge([
                'phone_number' => $request->phoneNumber,
            ]);
        }

        $validator = Validator::make($request->all(), [
            'companyName' => 'required|string|max:255',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'website' => 'string|max:255',
            'address' => 'required|string|max:255',
            'postCode' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users|unique:companies',
            'phone_number' => 'required|string|max:255|unique:companies',
            'isSubscriber' => '',
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }

        if (Company::where('phoneNumber', $request->phoneNumber)->first()) {
            return $this->traitController->processResponse(false, ['message' => 'This Phone Number is Already exist']);
        }

        if (Company::where('email', $request->email)->first()) {
            return $this->traitController->processResponse(false, ['message' => 'This Email is Already exist']);
        }
        $company = Company::create([
            'name' => $request->companyName,
            'email' => $request->email,
            'phoneNumber' => $request->phoneNumber,
            'address' => $request->address,
            'website' => $request->website,
            'planId' => '1',
            'isAdmin' => false,
        ]);
        $password = str::random(10);
        $user = User::create([
            'firstName' => $request->firstName,
            'lastName' => $request->lastName,
            'name' => $request->firstName,
            'email' => $request->email,
            'status' => 1,
            'isSubscriber' => $request->isSubscriber,
            'companyId' => $company->id,
            'password' => hash::make($password),
            'autoRefresh' => 1,
            'address' => $request->adress,
            'postCode' => $request->postCode,
            'city' => $request->city,
        ]);

        $user->attachRole('companyadmin');

        // Start Email Configuration
        $mailBody = ["mail" => $request->email, "password" => $password , "loginUrl" => envValue('APP_URL').'/auth/login' ];

        try{
            $this->traitController->sendMail($mailBody, $request->email, 'Company Account Created', 'emails.registrationMail');
        } catch(\Exception $e){
            Log::channel('exception')->info($e->getMessage());
        }
        // End Email Configuration
        Log::channel('info')->info('New company has been registred with email '.$request->email);

        return $this->traitController->processResponse(true, [
            'password' => $password,
            'message' => trans('message.company_created_sucess') . $request->email,
        ]);
    }

    public function registerUser(Request $request)
    {
        $actualCompanyId = Auth::user()->companyId;

        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email',
            'address' => 'required|string|max:255',
            'postCode' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'password' => 'required|string|min:8',
            'isSubscriber' => '',
        ], [
            'companyName.required' => 'This is a required message for company name',
        ]);
        if ($validator->fails()) {
            return response($validator->errors(), 422);
        }

        $user = User::create([
            'firstName' => $request->firstName,
            'lastName' => $request->lastName,
            'name' => $request->firstName . ' ' . $request->lastName,
            'email' => $request->email,
            'status' => 1,
            'isSubscriber' => $request->isSubscriber,
            'companyId' => $actualCompanyId,
            'password' => hash::make($request->password),
            'autoRefresh' => 1,
            'address' => $request->address,
            'postCode' => $request->postCode,
            'city' => $request->city,
        ]);

        $user->attachRole('user');

        $mailBody = ["mail" => $request->email, "password" => $password , "loginUrl" => envValue('APP_URL').'/auth/login' ];
        try{
            $this->traitController->sendMail($mailBody, $request->email, 'Company Account Created', 'emails.registrationMail');
        } catch(\Exception $e){
            Log::channel('exception')->info($e->getMessage());
        }

        Log::channel('info')->info('company admin Id :'.$this->traitController->getCurrentId().' has add teh user '.$request->email.' to his company : '.$actualCompanyId);
        return $this->traitController->processResponse(true, [
            'success' => true,
            'message' => trans('message.user_created_suceess') . $request->email,
        ]);
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
                    Log::channel('info')->info('User '.$request->email.' has been connected');
                    $token = $user->createToken('Laravel Password Grant Client')->accessToken;
                    $secret_key = envValue('JWT_SECRET_KEY');
                    $issuer_claim = envValue('JWT_ISSUER_CLAIMER'); // this can be the servername
                    $audience_claim = envValue('JWT_AUDIANCE_KLAIMER');
                    $issuedat_claim = time(); // issued at
                    $notbefore_claim = $issuedat_claim + 0; // not before in seconds
                    $expiration_time_env = (int) envValue('JWT_EXPIRATION_TIME');
                    $expire_claim = $issuedat_claim + $expiration_time_env; // expire time in seconds
                    $token = [
                        'iss' => $issuer_claim,
                        'aud' => $audience_claim,
                        'iat' => $issuedat_claim,
                        'nbf' => $notbefore_claim,
                        'exp' => $expire_claim,
                        'data' => [
                            'id' => $user['id'],
                            'fullName' => $user['firstName'] . ' ' . $user['lastName'],
                            'email' => $user['email'],
                            'roles' => $this->userRepository->getCurrentRoles($user),
                        ],
                    ];

                    $jwt = JWT::encode($token, $secret_key, envValue('JWT_HASH_ALGORITHME'));

                    // Check and disconnect Inactif Account
                    Auth::login($user);
                    $providerTokenController = new ProviderTokenController();
                    $providerTokenController->checkAccountToken();

                    return $this->traitController->processResponse(true, [
                        'message' => trans('message.sucess_login'),
                        'token' => $jwt,
                        'expireAt' => $expire_claim,
                        'roles' => $this->userRepository->getCurrentRoles($user),
                    ]);
                } else {
                    Log::channel('notice')->notice('User '.$request->email.' try to connect with mismatch password');

                    $response = ['message' => trans('message.password_mismatch'), 'status' => false];

                    return response($response, 422);
                }
            } else {
                Log::channel('notice')->notice('User '.$request->email.' try to connect but is not activated');
                $response = ['message' => trans('message.account_not_activated'), 'status' => false];

                return response($response, 422);
            }
        } else {
            trans('messages.failed');
            Log::channel('notice')->notice('User '.$request->email.' try to connect but is not exist');
            $response = ['message' => 'User does not exist', 'status' => false];

            return response($response, 422);
        }
    }
}
