<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'provider',
        'status',
        'expiryDate',
        'scoope',
        'authorities',
        'link',
        'company_id',
        'uid',
        'profilePicture',
        'category',
        'providerType'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}
