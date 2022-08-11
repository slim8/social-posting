<?php

namespace App\Models;

use App\Http\Extends\ExtendedUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laratrust\Traits\LaratrustUserTrait;
use Laravel\Sanctum\HasApiTokens;

class User extends ExtendedUser
{
    use LaratrustUserTrait;
    use HasApiTokens;
    use HasFactory;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'firstName',
        'lastName',
        'status',
        'autoRefresh',
        'isSubscriber',
        'companyId',
        'address',
        'postCode',
        'city'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'rememberToken',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'emailVerifiedAt' => 'datetime',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'companyId');
    }

    public function providerToken()
    {
        return $this->hasMany(ProviderToken::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function accounts()
    {
        return $this->belongsToMany(Account::class);
    }

    public function post()
    {
        return $this->hasMany(Post::class , 'created_by');
    }
}
