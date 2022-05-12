<?php

namespace App\Http\Middleware\Extends;

use Closure;
use Laratrust\Middleware\LaratrustMiddleware;

class LaratrustRole extends LaratrustMiddleware
{
    /**
     * Handle incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param Closure                  $next
     * @param string                   $roles
     * @param string|null              $team
     * @param string|null              $options
     *
     * @return mixed
     */
    public function handle($request, Closure $next, $roles, $team = null, $options = '')
    {
        if (!$this->authorization('roles', $roles, $team, $options)) {
            return response()->json(['unauthorized'], 401);
        }

        return $next($request);
    }
}
