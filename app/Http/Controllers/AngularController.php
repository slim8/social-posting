<?php

namespace App\Http\Controllers;

class AngularController extends Controller
{
    public function index()
    {
        // Temporar Redirect for De If Exist
        $deContent = public_path().'/deutch/de/index.html';
        if (file_exists($deContent)) {
            return file_get_contents($deContent);
        } else {
            return file_get_contents(public_path().'/angular/index.html');
            // return view('angular');
        }
    }
}
