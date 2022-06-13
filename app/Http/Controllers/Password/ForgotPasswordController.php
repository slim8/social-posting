<?php

namespace App\Http\Controllers\Password;

use App\Http\Controllers\Controller;
use App\Http\Traits\RequestsTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use App\Models\User; 
use Illuminate\Support\Str ;
use App\Mail\ForgetPassword;

class ForgotPasswordController extends Controller
{
    use RequestsTrait;

    /**
     * Forget Password Function [Send link via mail]
     */
    public function forgetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
        ]);

        $token = Str::random(64);

        DB::table('password_resets')->insert(
            ['email' => $request->email, 'token' => $token, 'created_at' => Carbon::now()]
        );
       
        Mail::to($request->email)->send(new ForgetPassword(['title' => 'Forgot password' , 'body' => $token]));

        // return RequestsTrait::processResponse(true);
        return RequestsTrait::processResponse(true , ['token' => $token ]);
    }

    /**
     * reset Password Function 
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required',

        ]);

        $updatePassword = DB::table('password_resets')
                            ->where(['email' => $request->email, 'token' => $request->token])
                            ->first();

        if(!$updatePassword)
            return RequestsTrait::processResponse(false,['message' => 'Inavlid Token']);

        $user = User::where('email', $request->email)
                    ->update(['password' => Hash::make($request->password)]);

        DB::table('password_resets')->where(['email'=> $request->email])->delete();

        return RequestsTrait::processResponse(true , ['message' => "Your password has been changed , you can now logged in"]);
        
    }
}
