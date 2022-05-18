<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProviderToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'expiryDate',
        'longLifeToken',
        'created_by',
    ];

    public function creator()
    {
        return $this->belongsTo(Users::class,'created_by');
    }
}
