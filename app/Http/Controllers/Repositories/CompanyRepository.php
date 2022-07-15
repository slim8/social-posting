<?php

namespace App\Http\Controllers\Repositories;

use App\Http\Controllers\Controller;
use App\Models\Company;

class CompanyRepository extends Controller
{
    public function getById($id)
    {
        return Company::where('id', '=', $id)->first();
    }
}
