<?php

namespace App\Models;

use App\Http\Extends\ExtendedModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Mentions extends ExtendedModel
{
    use HasFactory;

    protected $fillable = [
        'postMediaId',
        'username',
        'postId',
        'posX',
        'posY',
        'provider',
        'companyId',
    ];

    public function post()
    {
        $this->belongsTo(Post::class);
    }
}
