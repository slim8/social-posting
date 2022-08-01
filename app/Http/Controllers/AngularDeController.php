<?php

namespace App\Http\Controllers;

class AngularDeController extends Controller
{
    public function index()
    {
        $deContent = public_path().'/deutch/de/index.html';
        if (file_exists($deContent)) {
            // return 'Morning';
            return file_get_contents($deContent);
        }
    }
}
