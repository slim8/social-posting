<?php

namespace App\Http\Controllers\Roles;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Functions\UtilitiesController;
use App\Http\Controllers\Repositories\CompanyRepository;
use App\Http\Controllers\Repositories\PlanRepository;
use App\Http\Controllers\Repositories\UserRepository;
use App\Http\Controllers\TraitController;
use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AdminsController extends Controller
{
    protected $companyRepository;
    protected $planRepository;
    protected $userRepository;
    protected $traitController;
    protected $utilitiesController;

    public function __construct()
    {
        $this->companyRepository = new CompanyRepository();
        $this->planRepository = new PlanRepository();
        $this->userRepository = new UserRepository();
        $this->traitController = new TraitController();
        $this->utilitiesController = new UtilitiesController();
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
        $usersObject = $this->traitController->getUserObject()->hasRole('companyadmin') ? User::where('companyId', $this->traitController->getCompanyId())->where('id', 'not like', $this->traitController->getCurrentId())->where('deleted', 0)->get() : $this->getUsers();

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

    /**
     * Delete User from company Id
     * Just set deleted class to true.
     */
    public function deleteUser($userId)
    {
        if ($userId == $this->traitController->getCurrentId()) {
            return $this->traitController->processResponse(false, ['message' => 'You can not delete your account']);
        }

        if (!$this->utilitiesController->checkUserRight($userId)) {
            return $this->traitController->processResponse(false, ['message' => 'This account is not linked to this admin']);
        }

        $user = User::where('id', $userId)->first();

        $user->update(['status' => 0, 'deleted' => 1]);

        Log::channel('notice')->notice('[deleteUser] User : '.$this->traitController->getCurrentId().' Delete User '.$userId);

        return $this->traitController->processResponse(true);
    }

    /**
     * Activate Or Suspend Account.
     */
    public function suspensionUser(Request $request, int $userId = null, int $action = null)
    {
        if ($action !== 0 && $action !== 1) {
            Log::channel('notice')->notice('[suspensionUser] User : '.$this->traitController->getCurrentId().' Try To Disable/Enable User without Specify Action');

            return $this->traitController->processResponse(false, ['message' => 'Please specify action 0 for disable or 1 for enable']);
        }

        if (!$userId) {
            Log::channel('notice')->notice('[suspensionUser] User : '.$this->traitController->getCurrentId().' Try To Disable/Enable User without Account ID');

            return $this->traitController->processResponse(false, ['message' => 'Please choose a valid account ID']);
        }

        if ($userId == $this->traitController->getCurrentId()) {
            return $this->traitController->processResponse(false, ['message' => 'You can not Disable/Enable your account']);
        }

        if (!$this->utilitiesController->checkUserRight($accounts)) {
            return $this->traitController->processResponse(false, ['message' => 'This account is not linked to this admin']);
        }
        $user = User::where('id', $userId)->first();
        $user->update(['status' => $action]);

        if ($action) {
            Log::channel('info')->info('[suspensionUser] User : '.$this->traitController->getCurrentId().' has Enable User Id : '.$userId);

            $object['message'] = 'Your user has been ENABLED';
        } else {
            Log::channel('info')->info('[suspensionUser] User : '.$this->traitController->getCurrentId().' Try To Disable User Id : '.$userId);
            $object['message'] = 'Your user has been DISABLED';
        }

        return $this->traitController->processResponse(true, $object);
    }
}
