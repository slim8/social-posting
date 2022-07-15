<?php

namespace App\Models;

use App\Http\Extends\ExtendedModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PostHashtag extends ExtendedModel
{
    use HasFactory;

    protected $fillable = [
        'accountPostId',
        'hashtagId'
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class);
    }
}
