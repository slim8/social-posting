<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanProvider extends Model
{
    use HasFactory;

    protected $fillable = [
        'limit',
        'remaining',
        'provider',
        'plan_id',
    ];

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
