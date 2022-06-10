<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


use App\Models\Company;
use App\Models\Plan;
use App\Models\PlanProvider;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $plan = Plan::create([
            'name' => 'Plan A',
            'price' => 50,
            'providerLimit' => '1000',
            'usersLimit' => '1000',
        ]);

        PlanProvider::create([
            'limit' => '1000',
            'remaining' => '1000',
            'provider' => 'facebook',
            'planId' => $plan->id,
        ]);

        $company = Company::create([
            'name' => 'MGO',
            'email' => 'maher.boughdiri@softtodo.com',
            'phoneNumber' => '000000000',
            'adress' => 'Adresse',
            'website' => 'Website',
            'planId' => $plan->id,
            'isAdmin' => true,
        ]);

        $user = User::create([
            'firstName' => 'maher',
            'lastName' => 'boughdiri',
            'name' => 'MGO',
            'email' => 'maher.boughdiri@softtodo.com',
            'status' => 1,
            'isSubscriber' => 1,
            'companyId' => $company->id,
            'password' => hash::make('12345678'),
            'autoRefresh' => 1,
        ]);

        $user->attachRole('admin');
    }
}
