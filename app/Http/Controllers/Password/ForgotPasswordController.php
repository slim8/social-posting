<?php

namespace App\Http\Controllers\Password;

use App\Http\Controllers\Controller;
use App\Http\Controllers\TraitController;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
    protected $traitController;

    public function __construct()
    {
        $this->traitController = new TraitController();
    }

    /**
     * Forget Password Function [Send link via mail].
     */
    public function forgetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
        ]);

        $token = Str::random(64);

        Log::channel('info')->info('a forget password request for account '.$request->email);

        DB::table('password_resets')->insert(
            ['email' => $request->email, 'token' => $token, 'created_at' => Carbon::now()]
        );

        try{
            $this->traitController->sendMail(['title' => 'Forgot password', 'token' => $token, 'resetPasswordUrl' => envValue('APP_URL').'/auth/reset-password/'], $request->email, 'Request Forget Password', 'emails.forgetPassword');
        } catch(\Exception $e){
            Log::channel('exception')->info($e->getMessage());
        }

        // return $this->traitController->processResponse(true);
        return $this->traitController->processResponse(true, ['token' => $token]);
    }

    /**
     * reset Password Function.
     */
    public function resetPassword(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'email' => 'required|email|exists:users',
            'password' => 'required|string|min:6',
            'passwordConfirmation' => 'required|string|min:6',
            'token' => 'required|string',
        ]);

        if ($validation->fails()) {
            return Response()->json($validation->errors(), 422);
        }

        if ($request->password !== $request->passwordConfirmation) {
            Log::channel('notice')->notice('reset password request for email : '.$request->email.' with mismatch password');

            return $this->traitController->processResponse(false, ['passwordConfirmation' => ['Password did not match']]);
        }

        $updatePassword = DB::table('password_resets')
                            ->where(['email' => $request->email, 'token' => $request->token])
                            ->first();

        if (!$updatePassword) {
            Log::channel('notice')->notice('reset password request for email : '.$request->email.' with invalid token');

            return $this->traitController->processResponse(false, ['message' => 'Inavlid Token']);
        }

        $user = User::where('email', $request->email)
                    ->update(['password' => Hash::make($request->password)]);

        DB::table('password_resets')->where(['email' => $request->email])->delete();
        Log::channel('info')->info('success reset password request for email : '.$request->email);

        return $this->traitController->processResponse(true, ['message' => 'Your password has been changed , you can now logged in']);
    }
}
