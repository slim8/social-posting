<?php

namespace App\Http\Controllers\Roles;

use App\Http\Controllers\Controller;
use App\Http\Controllers\functions\UtilitiesController;
use App\Http\Traits\UserTrait;
use App\Models\User;
use App\Models\UsersAccounts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CompanyAdminsController extends Controller
{
    use UserTrait;
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
        $validator = Validator::make($request->all(), [
            'accounts' => 'required',
            'users' => 'required',
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }

        $accounts = $request->accounts;
        $users = $request->users;

        if (!$this->utilitiesController->checkIfAccountLinkedToCurrentAdmin($accounts)) {
            return response()->json(['success' => false,
        'message' => 'One or more accounts are not linked to this admin', ], 201);
        }

        if (!$this->utilitiesController->checkIfUsersAreLinkedToActualCompany($users)) {
            return response()->json(['success' => false,
        'message' => 'One or more users are not linked to this company', ], 201);
        }

        foreach ($accounts as $account) {
            foreach ($users as $user) {
                if (!UsersAccounts::hasAccountPermission($user, $account)) {
                    UserTrait::setPermissionaccountToUser($user, $account);
                }
            }
        }

        return response()->json(['success' => true], 201);
    }
}
