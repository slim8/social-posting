<?php

namespace App\Models;

use App\Http\Extends\ExtendedModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanProvider extends ExtendedModel
{
    use HasFactory;

    protected $fillable = [
        'limit',
        'remaining',
        'provider',
        'planId',
    ];

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
