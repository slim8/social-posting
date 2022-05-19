<?php

namespace App\Http\Controllers\repositories;

use App\Http\Controllers\Controller;
use App\Models\Plan;

class PlanRepository extends Controller
{
    public function getById($id)
    {
        return Plan::where('id', '=', $id)->first();
    }
}
