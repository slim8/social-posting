<?php

namespace App\Models;

use App\Http\Extends\ExtendedModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class News extends ExtendedModel
{
    use HasFactory;

    protected $fillable = [
        'title',
        'teaser',
        'picture',
        'date',
        'template',
    ];

    public function textMediaNews()
    {
        return $this->hasMany(TextMediaNews::class);
    }
}
