<?php

namespace App\Http\Controllers\Roles;

use App\Http\Controllers\Controller;
use App\Http\Controllers\functions\UtilitiesController;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\User;
use App\Models\UsersAccounts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CompanyAdminsController extends Controller
{
    use UserTrait;
    use RequestsTrait;
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
            return RequestsTrait::processResponse(false, ['message' => 'One or more accounts are not linked to this admin']);
        }

        if (!$this->utilitiesController->checkIfUsersAreLinkedToActualCompany($users)) {
            return RequestsTrait::processResponse(false, ['message' => 'One or more users are not linked to this company']);
        }

        foreach ($accounts as $account) {
            foreach ($users as $user) {
                if (!UsersAccounts::hasAccountPermission($user, $account)) {
                    UserTrait::setPermissionaccountToUser($user, $account);
                }
            }
        }

        return RequestsTrait::processResponse(true);
    }
}
