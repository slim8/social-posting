<?php

namespace App\Models;

use App\Http\Extends\ExtendedModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountPost extends ExtendedModel
{
    use HasFactory;

    protected $fillable = [
        'postId',
        'url',
        'postIdProvider',
        'accountId',
        'message',
        'videoTitle',
        'source',
        'thumbnailRessource'
    ];

    public function account()
    {
         return $this->hasMany(Account::class , 'id' , 'account_id');
    }

    public function accounts()
    {
         return $this->hasMany(Account::class , 'id' , 'accountId');
    }

    public function post()
    {
        return $this->belongsTo(Post::class , 'postId');
    }
}
