<?php

namespace App\Http\Controllers\Roles;

use App\Http\Controllers\Controller;
use App\Http\Controllers\repositories\CompanyRepository;
use App\Http\Controllers\repositories\PlanRepository;
use App\Http\Controllers\repositories\UserRepository;
use App\Models\Company;
use App\Models\User;

class AdminsController extends Controller
{
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
        return Company::where('is_admin', 'not like', '1')->get();
    }
}
