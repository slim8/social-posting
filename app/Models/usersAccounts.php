<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsersAccounts extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'userId',
        'accountId',
    ];

    public function accounts()
    {
        return $this->hasMany(Account::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public static function hasAccountPermission($userId, $accountId)
    {
        return UsersAccounts::where('account_id', $accountId)->where('user_id', $userId)->count();
    }
}
