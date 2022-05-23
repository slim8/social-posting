<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'url',
        'post_id_provider',
        'account_id',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
