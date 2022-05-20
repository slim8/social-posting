<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Roles\AdminsController;

class RoutingController extends Controller
{
    public function getAllCompanies()
    {
        $companyController = new AdminsController();
        $companies = $companyController->getCompanies();
        if (!$companies) {
            return response()->json(['success' => false,
            'companies' => [],
            'message' => 'No company Found', ], 201);
        }

        return response()->json(['success' => true,
            'companies' => $companies, ], 201);
    }

    public function getAllAdminsUsers()
    {
        $companyController = new AdminsController();
        $companies = $companyController->getUsers();
        if (!$companies) {
            return response()->json(['success' => false,
            'users' => [],
            'message' => 'No company Found', ], 201);
        }

        return response()->json(['success' => true,
            'users' => $companies, ], 201);
    }
}
