<?php

namespace App\Http\Controllers\Roles;

use App\Http\Controllers\Controller;
use App\Http\Controllers\repositories\CompanyRepository;
use App\Http\Controllers\repositories\PlanRepository;
use App\Http\Controllers\repositories\UserRepository;
use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\Company;
use App\Models\User;

class AdminsController extends Controller
{
    use RequestsTrait;
    use UserTrait;

    protected $companyRepository;
    protected $planRepository;
    protected $userRepository;

    public function __construct()
    {
        $this->companyRepository = new CompanyRepository();
        $this->planRepository = new PlanRepository();
        $this->userRepository = new UserRepository();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getUsers()
    {
        $users = [];
        foreach (User::all() as $user) {
            $linkedCompany = $this->companyRepository->getById($user->company_id);
            if (!$linkedCompany->is_admin) {
                $roles = [];
                foreach ($this->userRepository->getCurrentRoles($user) as $role) {
                    $roles[] = $role;
                }
                $user->userRoles = $roles;
                unset($user->roles);
                $user->companyName = $linkedCompany->name;
                $users[] = $user;
            }
        }

        return $users;
    }

    public function getCompanies()
    {
        return Company::where('isAdmin', 'not like', '1')->get();
    }

    /**
     * Get all companies.
     */
    public function getAllCompanies()
    {
        $companies = $this->getCompanies();
        if (!$companies) {
            return RequestsTrait::processResponse(false, ['companies' => [], 'message' => 'No company Found']);
        }

        return RequestsTrait::processResponse(true, ['companies' => $companies]);
    }

    /**
     * Return All users (For Admin or Admin Company).
     */
    public function getAllUsers()
    {
        $users = [];
        $usersObject = UserTrait::getUserObject()->hasRole('companyadmin') ? User::where('companyId', UserTrait::getCompanyId())->where('id', 'not like', UserTrait::getCurrentAdminId())->get() : $this->getUsers();

        if (!$usersObject) {
            return RequestsTrait::processResponse(false, ['users' => [], 'message' => 'No User Found']);
        }

        // Return accounts for all user
        foreach ($usersObject as $user) {
            $user->accounts = UserTrait::getAccountsLinkedToUser($user->id);
            $users[] = $user;
        }

        return RequestsTrait::processResponse(true, ['users' => $users]);
    }
}
