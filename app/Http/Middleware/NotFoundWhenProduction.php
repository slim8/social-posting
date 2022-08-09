<?php

namespace App\Http\Middleware;

use Closure;
use \Illuminate\Http\Response;
use \App\Http\Controllers\TraitController;
class NotFoundWhenProduction
{
    protected $traitController;

    public function __construct()
    {
        $this->traitController = new TraitController();
    }

    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $env = strtolower(envValue('APP_ENV'));
        if ($env == 'production' || $env == 'prod' || $env == 'staging' || $env == 'stage' || $env == 'live') {
            return $this->traitController->processResponse(false ,['message' => 'You are unauthorized to access this resource']);        }

        return $next($request);
    }
}
