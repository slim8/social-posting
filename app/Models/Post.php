<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'message',
        'url',
        'status',
        'publishedAt',
        'deleted',
        'account_id',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function PostMedia()
    {
        return $this->hasMany(PostMedia::class);
    }

    public function tags()
    {
        return $this->hasMany(Tag::class)->using(PostTag::class);
    }
}
