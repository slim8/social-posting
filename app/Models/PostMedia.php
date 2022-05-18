<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostMedia extends Model
{
    use HasFactory;

    protected $fillable = [
        'url',
        'type',
        'post_id',
    ];

    public function post(){
        $this->belongsTo(Post::class);
    }
}
