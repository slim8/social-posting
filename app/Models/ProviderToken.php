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
        'provider',
        'profile_picture',
        'profile_name',
        'user_name',
        'accountUserId'
    ];

    public function creator()
    {
        return $this->belongsTo(Users::class,'created_by');
    }
}
