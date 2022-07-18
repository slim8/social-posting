<?php

namespace App\Models;

use App\Http\Extends\ExtendedModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TextMediaNews extends ExtendedModel
{
    use HasFactory;

    protected $fillable = [
        'title',
        'subtitle',
        'description',
        'picture',
        'newsId',
    ];

}
