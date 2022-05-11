<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function index()
    {
        if (Auth::user()->hasRole('admin')) {
            return 'Has Permission , Is Admin';
        } else {
            return 'No Permissions';
        }
    }
}
