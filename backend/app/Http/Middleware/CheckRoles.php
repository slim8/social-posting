<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRoles
{
    public function checkIfUserLoginSuccessByJWT(string $token)
    {
        try {
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET_KEY'), env('JWT_HASH_ALGORITHME')));

            return $decoded->data->id;
        } catch (Exception $e) {
            var_dump('exceptipon');

            return false;
        }
    }

    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     *
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle($request, Closure $next, ...$guards)
    {
        $header = $request->header('Authorization');
        if (!empty($header)) {
            $token = str_replace('Bearer ', '', $header);
            $connectedUser = $this->checkIfUserLoginSuccessByJWT($token);
            if ($connectedUser) {
                $user = User::where('id', $connectedUser)->first();
                Auth::login($user);
                $token = $user->createToken('Laravel Password Grant Client')->accessToken;
                var_dump('is tokened');
            }

            var_dump('yes');
            if (Auth::user()->hasRole('user')) {
                var_dump('Has Permission');
            } else {
                var_dump('No Permission');
            }

            if (!$user->accesible) {
                var_dump('could not be reaxched');
            }
        }

        return $next($request);
    }
}
