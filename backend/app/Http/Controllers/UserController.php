<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class UserController extends Controller
{
    public function index()
    {
        if (Auth::user()->hasRole(['user','admin'])) {
            return 'Has Permission';
        } else {
            return 'No Permission';
        }
    }
}
