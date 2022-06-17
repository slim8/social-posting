<?php

namespace App\Models;

use App\Http\Extends\ExtendedModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Dictionary extends ExtendedModel
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'lang'
    ];
}
