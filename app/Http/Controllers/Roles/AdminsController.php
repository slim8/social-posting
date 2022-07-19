<?php

namespace App\Http\Controllers\Roles;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Repositories\CompanyRepository;
use App\Http\Controllers\Repositories\PlanRepository;
use App\Http\Controllers\Repositories\UserRepository;
use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AdminsController extends Controller
{
    protected $companyRepository;
    protected $planRepository;
    protected $userRepository;
    protected $traitController;

    public function __construct()
    {
        $this->companyRepository = new CompanyRepository();
        $this->planRepository = new PlanRepository();
        $this->userRepository = new UserRepository();
        $this->traitController = new TraitController();
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
            return $this->traitController->processResponse(false, ['companies' => [], 'message' => 'No company Found']);
        }

        return $this->traitController->processResponse(true, ['companies' => $companies]);
    }

    /**
     * Return All users (For Admin or Admin Company).
     */
    public function getAllUsers()
    {
        $users = [];
        $usersObject = $this->traitController->getUserObject()->hasRole('companyadmin') ? User::where('companyId', $this->traitController->getCompanyId())->where('id', 'not like', $this->traitController->getCurrentId())->get() : $this->getUsers();

        if (!$usersObject) {
            return $this->traitController->processResponse(false, ['users' => [], 'message' => 'No User Found']);
        }

        // Return accounts for all user
        foreach ($usersObject as $user) {
            $user->accounts = $this->traitController->getAccountsLinkedToUser($user->id);
            $users[] = $user;
        }
        Log::channel('info')->info('User : '.$this->traitController->getCurrentId().' Has request All his sub users on his company');

        return $this->traitController->processResponse(true, ['users' => $users]);
    }
}
