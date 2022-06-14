<?php

namespace App\Models;

use App\Http\Extends\ExtendedModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Account extends ExtendedModel
{
    use HasFactory;
    use SoftDeletes;

    protected $hidden = ['pivot'];

    public static $STATUS_DISCONNECTED = 'DISCONNECTED';

    protected $fillable = [
        'name',
        'provider',
        'status',
        'expiryDate',
        'scoope',
        'authorities',
        'link',
        'companyId',
        'uid',
        'profilePicture',
        'category',
        'providerType',
        'accessToken',
        'relatedAccountId',
        'providerTokenId',
        'relatedUid',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'companyId');
    }

    public function posts()
    {
        return $this->belongsToMany(Post::class, 'accountPosts', 'postId');
    }

    public function related_account()
    {
        return $this->belongsTo(Account::class, 'relatedAccountId');
    }

    public function providerToken()
    {
        return $this->belongsTo(ProviderToken::class, 'providerTokenId');
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
