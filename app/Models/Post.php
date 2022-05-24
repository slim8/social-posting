<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'message',
        'url',
        'status',
        'publishedAt',
        'isScheduled',
        'deleted',
    ];

    public function accounts()
    {
        return $this->hasMany(Account::class, 'account_posts');
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
