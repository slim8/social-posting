<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'message',
        'url',
        'images',
        'videos',
        'status',
        'publishedAt',
        'deleted',
        'account_id',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
