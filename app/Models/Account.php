<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Account extends Model
{
    use HasFactory, SoftDeletes;

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
        'providerType',
        'accessToken',
        'related_account_id',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function related_account(){
        return $this->belongsTo(Account::class, 'related_account_id');
    }
}
