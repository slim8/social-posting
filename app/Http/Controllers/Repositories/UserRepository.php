<?php

namespace App\Http\Controllers\repositories;

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
