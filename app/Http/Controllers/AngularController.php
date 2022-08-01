<?php

namespace App\Http\Controllers;

class AngularController extends Controller
{
    public function index()
    {
        // Temporar Redirect for De If Exist
        $deContent = public_path().'/de/de/index.html';
        if (file_exists($deContent)) {
            return file_get_contents($deContent);
        } else {
            return view('angular');
        }
    }
}
