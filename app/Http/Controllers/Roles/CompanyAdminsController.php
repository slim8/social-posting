<?php

namespace App\Http\Controllers\Roles;

use App\Http\Controllers\Controller;
use App\Http\Controllers\functions\UtilitiesController;
use App\Models\User;
use App\Models\UsersAccounts;
use GuzzleHttp\Psr7\Request;

class CompanyAdminsController extends Controller
{
    protected $utilitiesController;

    public function __construct()
    {
        $this->utilitiesController = new UtilitiesController();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getUsers()
    {
        return User::all();
    }

    /**
     * Add Account Pages/Group to User.
     */
    public function addAccountToUser(Request $request)
    {
        $pages = $request->pages;
        $users = $request->users;

        if(!$this->utilitiesController->checkIfAccountLinkedToCurrentAdmin($pages)){
            return response()->json(['success' => false,
        'message' => 'One or more accounts are not linked to this admin', ], 201);
        }

        if(!$this->utilitiesController->checkIfUsersAreLinkedToActualCompany($users)){
            return response()->json(['success' => false,
        'message' => 'One or more users are not linked to this company', ], 201);
        }


        foreach($pages as $page){
            foreach($users as $user){
                if(!UsersAccounts::hasAccountPermission($user,$page)){
                    dd('add the new user to the page');
                }
            }

        }
    }
}
