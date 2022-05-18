<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
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
