<?php

namespace App\Http\Controllers\repositories;

use App\Http\Controllers\Controller;
use App\Models\Company;

class CompanyRepository extends Controller
{
    public function getById($id)
    {
        return Company::where('id', '=', $id)->first();
    }
}
