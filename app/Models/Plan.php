<?php

namespace App\Models;

use App\Http\Extends\ExtendedModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends ExtendedModel
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'providerLimit',
        'usersLimit',
    ];

    public function companies()
    {
        return $this->hasMany(Company::class);
    }

    public function plan_providers()
    {
        return $this->hasMany(PlanProvider::class);
    }
}
