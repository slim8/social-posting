<?php

namespace App\Models;

use App\Http\Extends\ExtendedModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Hashtag extends ExtendedModel
{
    use HasFactory;

    protected $hidden = ['pivot'];

    protected $fillable = [
        'name',
    ];

    public function posts()
    {
        return $this->belongsToMany(Post::class)->using(PostHashtag::class);
    }
}
