<?php

namespace App\Http\Controllers\Repositories;

use App\Http\Controllers\Controller;

class UserRepository extends Controller
{
    public function getCurrentRoles($user)
    {
        $roles = [];

        foreach ($user->roles->toArray() as $role) {
            $roles[] = $role['name'];
        }

        return $roles;
    }
}
