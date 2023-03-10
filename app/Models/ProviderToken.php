<?php

namespace App\Models;

use App\Http\Extends\ExtendedModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProviderToken extends ExtendedModel
{
    use HasFactory;

    protected $fillable = [
        'expiryDate',
        'longLifeToken',
        'createdBy',
        'provider',
        'profilePicture',
        'profileName',
        'userName',
        'accountUserId'
    ];

    public function creator()
    {
        return $this->belongsTo(Users::class,'createdBy');
    }
}
