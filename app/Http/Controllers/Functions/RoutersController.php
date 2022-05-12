<?php

namespace App\Http\Controllers\functions;

use App\Http\Controllers\Controller;

class RoutersController extends Controller
{
    public function index(string $count = '')
    {
        echo 'this i sthe count ==> ';
        echo $count;
    }
}
