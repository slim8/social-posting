<?php

namespace App\Models;

use App\Http\Extends\ExtendedModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PostMedia extends ExtendedModel
{
    use HasFactory;

    protected $fillable = [
        'url',
        'type',
        'postId',
    ];

    public function post()
    {
        $this->belongsTo(Post::class);
    }
}
