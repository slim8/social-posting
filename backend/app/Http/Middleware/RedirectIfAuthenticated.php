<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @param string|null ...$guards
     *
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */

    public function checkIfUserLoginSuccessByJWT(string $token)
    {
        try {
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET_KEY'), env('JWT_HASH_ALGORITHME')));

            $idUser = $decoded->data->id;

            return $decoded->data->id;

            // Auth::login();
            // return $decoded->data->id;

            // if ($idUser) {
            //     return DB::table('personal_access_tokens')->where('id', $token['id'])->first('token')
            // }

            return $idUser;
        } catch (Exception $e) {
            var_dump('exceptipon');

            return false;
        }
    }

    public function handle($request, Closure $next)
    {
        $header = $request->header('Authorization');
        if (!empty($header)) {
            $token = str_replace('Bearer ', '', $header);

            $connectedUser = $this->checkIfUserLoginSuccessByJWT($token);
            //var_dump($connectedUser);
            // if (!empty($user)) {
            //     return 'Not Connected';
            //     exit;
            // }
        }

        var_dump($next);
        return $next($request);
    }

    // public function handle(Request $request, Closure $next, ...$guards)
    // {
    //     // $guards = empty($guards) ? [null] : $guards;

    //     // foreach ($guards as $guard) {
    //     //     if (Auth::guard($guard)->check()) {
    //     //         return redirect(RouteServiceProvider::HOME);
    //     //     }
    //     // }

    //     // return $next($request);
    // }
}
