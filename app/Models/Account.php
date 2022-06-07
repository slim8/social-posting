<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Account extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $hidden = ['pivot'];

    static $STATUS_DISCONNECTED = "DISCONNECTED";

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
        'provider_token_id',
        'related_Uid',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function posts()
    {
        return $this->belongsToMany(Post::class, 'account_posts' , 'post_id');
    }

    public function related_account()
    {
        return $this->belongsTo(Account::class, 'related_account_id');
    }

    public function providerToken()
    {
        return $this->belongsTo(ProviderToken::class,'provider_token_id');
    }
}
