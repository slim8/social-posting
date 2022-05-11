<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        if (Auth::user()->hasRole('user')) {
            return 'Has Permission , Is user';
        } elseif (Auth::user()->hasRole('admin')) {
            return 'Is Admin , is Admin';
        } else {
            return 'can not be reached';
        }
    }
}
