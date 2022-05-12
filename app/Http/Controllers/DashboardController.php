<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        dd(
            $request
        );
        if (Auth::user()->hasRole('user')) {
            return 'Has Permission , Is user';
        } elseif (Auth::user()->hasRole('admin')) {
            return 'Is Admin , is Admin';
        } else {
            return 'can not be reached';
        }
    }
}
