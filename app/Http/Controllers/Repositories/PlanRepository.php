<?php

namespace App\Http\Controllers\Repositories;

use App\Http\Controllers\Controller;
use App\Models\Plan;

class PlanRepository extends Controller
{
    public function getById($id)
    {
        return Plan::where('id', '=', $id)->first();
    }
}
