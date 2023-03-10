<?php

namespace App\Models;

use App\Http\Extends\ExtendedModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends ExtendedModel
{
    use HasFactory;
    use SoftDeletes;
    public static $STATUS_PUBLISH = 'PUBLISH';
    public static $STATUS_DRAFT = 'DRAFT';
    protected $fillable = [
        'message',
        'url',
        'status',
        'publishedAt',
        'videoTitle',
        'isScheduled',
        'createdBy',
        'deleted',
    ];

    public function accounts()
    {
        return $this->belongsToMany(Account::class, 'account_posts', 'postId');
    }

    public function postMedia()
    {
        return $this->hasMany(PostMedia::class , 'postId');
    }

    public function post_tags()
    {
        return $this->belongsToMany(Hashtag::class, 'post_tags', 'postId');
    }

    public function creator()
    {
        return $this->belongsTo(Users::class, 'createdBy');
    }
}
