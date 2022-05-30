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
        'video_title',
        'isScheduled',
        'deleted',
    ];

    public function accounts()
    {
        return $this->belongsToMany(Account::class, 'account_posts', 'post_id');
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
