<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Plan;
use App\Models\PlanProvider;
use App\Models\User;
// use App\Models\User as ModelsUser;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
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
            'email' => 'ali.softtodo@gmail.com',
            'phoneNumber' => '000000000',
            'address' => 'Adresse',
            'website' => 'Website',
            'planId' => $plan->id,
            'isAdmin' => true,
        ]);

        $user = User::create([
            'firstName' => 'MGO',
            'lastName' => 'Administrator',
            'name' => 'MGO',
            'email' => 'ali.softtodo@gmail.com',
            'status' => 1,
            'isSubscriber' => 1,
            'companyId' => $company->id,
            'password' => hash::make('Soft1to2do'),
            'autoRefresh' => 1,
            'deleted' => 0,
        ]);

        $user->attachRole('admin');
    }
}
